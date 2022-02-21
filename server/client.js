const io = require('socket.io-client');
const socket = io('http://localhost:3000', {
    origins:"*"
});

const clientData = {
    userData: {},
    authenticated: true,
    status: 'login',
    tables: [],
};

const searchMatch = () => {
    socket.emit('CLIENT_SEARCH');
}

socket.io.on("error", (error) => {
    console.log('Error trying to connect to server, trying again...');
})

socket.on('SERVER_LOGIN_SUCCESS', (data) => {
    const { userData } = data;
    clientData.userData = userData;
    clientData.status = 'idle';
    clientData.authenticated = true;
    console.log('Searching match...');
    setTimeout(searchMatch, 2000)
});

socket.on('SERVER_LOGIN_FAIL', (data) => {
    console.log('Login failed!');
});

socket.on('SERVER_MATCH_CYCLE', (data) => {
    const { tables } = data;
    tables.forEach((table, tableIndex) => {
        const targetTable = clientData.tables[tableIndex];
        table.forEach(event => {
            switch(event.type) {
                case 'unit':
                    if(event.targetIndex == 'user') {
                        targetTable.life = Array.isArray(event.data) ? event.data[event.data.length-1].health : event.data.health;
                    }else if(targetTable.enemyList[event.targetIndex]){
                        targetTable.enemyList[event.targetIndex].attributes.health.curr = Array.isArray(event.data) ? event.data[event.data.length-1].health : event.data.health;
                    }
                break;
                case 'enemy':
                    if(event.targetIndex == 'user') {
                        targetTable.life = Array.isArray(event.data) ? event.data[event.data.length-1].health : event.data.health;
                    }else if(targetTable.unitList[event.targetIndex]){
                        targetTable.unitList[event.targetIndex].attributes.health.curr = Array.isArray(event.data) ? event.data[event.data.length-1].health : event.data.health;
                    }
                break;
                case 'addUnit':
                    targetTable.unitList.push(event.data)
                break;
                case 'addEnemy':
                    targetTable.enemyList.push(event.data)
                break;
                case 'upgradeUnit':
                    targetTable.unitList[event.index] = event.data;
                break;
            }
        });
    });
    console.clear();
    clientData.tables.forEach((table, tableIndex) => {
        const unitListHealth = table.unitList.reduce((acc, unit) => (acc + unit.attributes.health.curr), 0)
        const enemyListHealth = table.enemyList.reduce((acc, unit) => (acc + unit.attributes.health.curr), 0)
        console.log(`
Mesa ${tableIndex+1} ${table.life} HP - Usuario #${table.userId} (${table.userId == socket.id ? 'VOCÊ' : 'OPONENTE'})
        ${table.unitList.length} unidades \t ${unitListHealth} HP total
        ${table.enemyList.length} inimigos\t ${enemyListHealth} HP total
`);
    });
    console.log('\n Received SERVER_MATCH_CYCLE');
});

socket.on('SERVER_MATCH_INIT', (data) => {
    console.log('\n Received SERVER_MATCH_INIT');
    const { tables } = data;
    clientData.status = 'playing';
    clientData.tables = tables;
});

socket.on('SERVER_MATCH_END', (data) => {
    console.log('\n Received SERVER_MATCH_END');
    console.log('Searching match...');
    setTimeout(searchMatch, 2000)
});

socket.emit('CLIENT_LOGIN', { username: 'iago', password: '123' });
