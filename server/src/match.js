const Table = require('./table.js');

class Match {
    // Receives both users ID and UnitTypes (null will create a bot user)
    constructor(io, roomName, userOneId, userOneUnitTypes, userTwoId, userTwoUnitTypes, debug = false) {
        this._io = io;
        this.roomName = roomName;
        this.roomClients =  io.in(roomName).clients;
        this.userOneId = userOneId;
        this.userOneUnitTypes = userOneUnitTypes;
        this.userTwoId = userTwoId;
        this.userTwoUnitTypes = userTwoUnitTypes;
        this.debug = debug;
        this.status = 'waiting';
        this.cycle = 0;
        this.cycleEnemy = 0;
        this.cycleEnemyMax = 30;
    }
    // Emit cycle information to the room
    emitCycle() {
        if(this.tables){
            // console.log(`Emiting SERVER_MATCH_CYCLE on room #${this.roomName}`);
            this._io.to(this.roomName).emit('SERVER_MATCH_CYCLE', { tables: this.tables.map(table => table.cycleActions) });
            this.tables.forEach(table => table.cycleActions = []);
        }
    }

    // Emit initilization information to the room
    emitInit() {
        // console.log(`Emiting SERVER_MATCH_INIT on room #${this.roomName}`);
        this._io.to(this.roomName).emit('SERVER_MATCH_INIT', { tables: this.tables });
    }

    // Emit final information to the room
    emitEnd() {
        // console.log(`Emiting SERVER_MATCH_END on room #${this.roomName}`);
        this._io.to(this.roomName).emit('SERVER_MATCH_END', { tables: this.tables });
        this.tables.forEach(table =>  {
            const socketInstance = this._io.sockets.sockets.get(table.userId);
            table.desassociateSocketEvents(socketInstance);
        });
    }

    // Logs both tables from the match
    log() {
        this.tables.forEach(table => table.log());
    }

    // Initialize the match with [unityNumber] random unities and [enemyNumber] enemies on both tables
    init(unitNumber, enemyNumber) {
        console.log(`Creating tables for match #${this.roomName}`);
        this.tables = [
            new Table(this.userOneId || 'bot', 'User', this.userOneUnitTypes, !this.userOneId),
            new Table(this.userTwoId || 'bot', 'User', this.userTwoUnitTypes, !this.userTwoId)
        ];
        this.cycleEnemy = 0;
        this.cycle = 0;
        //console.log(`Initializing tables for match #${this.roomName}`);
        this.tables.forEach(table =>  {
            //console.log(`\t Adding unitites for match #${this.roomName}`);
            table.addUnities(unitNumber);
            //console.log(`\t Adding enemies for match #${this.roomName}`);
            table.addEnemies(enemyNumber);
            //console.log(`\t Associating socket #${table.userId} (${this._io.sockets.sockets})`);
            const socketInstance = this._io.sockets.sockets.get(table.userId);
            //console.log(`\t socket #${table.userId}: ${socketInstance}`)
            table.associateSocketEvents(socketInstance);
            table.cycleActions = [];
        })
        this.status = 'running';
        this.emitInit();
    }

    // Verify if should spawn enemy now
    executeEnemySpawn() {
        if((this.cycleEnemy += 1) >= this.cycleEnemyMax) {
            this.tables.forEach(table => table.addEnemy());
            this.cycleEnemy = 0;
        }
    }

    // Execute both tables cycles and apply results to other tables
    executeEnemyTransfer() {
        if(this.tables){
            const results = this.tables.map(table => table.executeCycle());
            this.tables.forEach((table, tableIndex) => {
                results.forEach((result, resultIndex) => {
                    if(resultIndex != tableIndex) {
                        table.addEnemies(result.enemiesKilled);
                    }
                })
            });
        }
    }

    // Execute the complete cycle, enemy spawning and enemy transfering routine
    executeCycle() {
        if(this.debug) { console.clear(); this.log(); }
        this.executeEnemySpawn();
        this.executeEnemyTransfer();
        this.emitCycle();
        this.status = this.isRunning() ? 'running' : 'finished';
    }

    // Returns false if there is any table with health bellow zero
    isRunning() { return !this.tables || this.tables.reduce((acc, curr) => acc && curr.life > 0, true); }
}

module.exports = Match;