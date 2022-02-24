const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, { cors: { origin: '*' } });
const User = require("./src/user.js");
const Match = require("./src/match.js");

const maxSearchAttemps = 2;
const users = [];
var matches = [];

// Matchmaking
setInterval(() => {
    users.forEach((user, userIndex) => {
        //console.log(`Checking user ${user.id} - ${user.status}`);
        if(user.status == 'searching') {
            var roomId = `${user.id}`;
            //console.log(`Looking for oponent`);
            const oponent = users.find((op, opIndex) => (op.authenticated && opIndex != userIndex && op.status == 'searching'));
            if(!oponent) { console.log(`Oponent not found, ${maxSearchAttemps - user.searchAttempts} attempts left...`); }
            if(!oponent && (user.searchAttempts += 1) >= maxSearchAttemps) { // 30 segundos procurando
                user.status = 'playing';
                user.joinRoom(roomId);
                var userUnities = user.userData.unitTypes.filter(unitType => user.userData.selectedUnitTypes.includes(unitType.name));
                console.log(userUnities);
                //console.log(`Starting match with bot on room #${roomId}`);
                matches.push(new Match(io, roomId, user.id, userUnities, null, null));
            }
            if(oponent) {
                //console.log(`Oponent found!`);
                roomId += `${oponent.id}`;
                user.status = 'playing';
                user.joinRoom(roomId);
                oponent.status = 'playing';
                oponent.joinRoom(roomId);
                //console.log(`Starting match with #${oponent.id} on room #${roomId}`);
                var userUnities = user.userData.unitTypes.filter(unitType => user.userData.selectedUnitTypes.includes(unitType.name));
                var oponentUnities = oponent.userData.unitTypes.filter(unitType => oponent.userData.selectedUnitTypes.includes(unitType.name));
                matches.push(new Match(io, roomId, user.id, userUnities, oponent.id, oponentUnities));
            }
        }
    });
}, 3000);

// Match executing
setInterval(() => {
    // Executing and Removing done matches
    const doneMatches = [];
    matches.forEach((match, matchIndex) => {
        switch(match.status) {
            case 'waiting':
                match.init(1, 1);
            break;
            case 'running':
                match.executeCycle();
            break;
            case 'finished':
                match.emitEnd();
                const userOne = users.find(user => user.id == match.userOneId);
                userOne.status = 'idle';
                if(match.tables[0].life > 0) { userOne.gold += 20; }
                if(match.userOneId != 'bot'){
                    const userTwo = users.find(user => user.id == match.userOneId);
                    userTwo.status = 'idle';
                    if(match.tables[1].life > 0) { userTwo.gold += 20; }
                }
                doneMatches.push(matchIndex);
            break;
        }
    });
    doneMatches.forEach(id => {
        matches.splice(id, 1);
    })
}, 500);

const onConnection = (socket) => {
    console.log(`Socket #${socket.id} connected`);
    users.push(new User(io, socket));
    const userIndex = users.length - 1;
    socket.on('disconnect', () => {
        console.log(`Socket #${socket.id} disconnected`);
        users.splice(userIndex, 1);
    })
}

io.on("connection", onConnection);
httpServer.listen(3000);
console.log('Server up on port :3000');

/* Em um caso real: */
// const partida = new Match(<userId>, <userUnitTypes>[], <userId>, <userUnitTypes>[], <debug>?);
// const partida = new Match(null, null, null, null, true);
// partida.init(2, 1);

// // Talvez um interval ( no fim será removido o getUserInput )
// const loop = () => {
//     partida.executeCycle();
//     if(partida.isRunning()) {
//         setTimeout(loop, 500);
//     }else{
//         partida.log();
//         console.log('FIM DA PARTIDA');
//         getUserInput();
//     }
// }

// const getUserInput = () => {
//     console.log('\n');
//     partida.tables[0].log();
//     partida.tables[1].log();
//     const text = `
// [u1] - Inserir unidade em mesa 1 \t [i1] - Inserir inimigo em mesa 1
// [u2] - Inserir unidade em mesa 2 \t [i2] - Inserir inimigo em mesa 2
// [c]   - Começar a partida
// [i]   - Inicializar instancia
// [l]   - Listar instancia
// >`;
//     rl.question(text, async (input) =>{
//         switch(input) {
//             case 'u1':
//                 partida.tables[0].addUnit(true);
//                 partida.tables[0].gold = partida.tables[0].unitPrice;
//             break;
//             case 'u2':
//                 partida.tables[1].addUnit(true);
//                 partida.tables[1].gold = partida.tables[1].unitPrice;
//             break;
//             case 'i1':
//                 partida.tables[0].addEnemy();
//             break;
//             case 'i2':
//                 partida.tables[1].addEnemy();
//             break;
//             case 'c':
//                 partida.init(2, 1);
//                 loop();
//             break;
//             case 'i':
//                 partida.init(2, 1);
//             break;
//             case 'l':
//                 console.log(partida);
//                 console.log('[Enter] - Voltar');
//                 rl.question('', getUserInput);
//             break;
//             default:
//                 console.log('Comando não reconhecido');
//                 getUserInput();
//             break;
//         }
//     });
// }

// getUserInput();