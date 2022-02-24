const defaultUnitTypes = require('./defaultUnitTypes.json');

const dbService = {
    authenticate(username, password) {
        return true;
    },
    getUserData(username) {
        return { username: username, gold: 100, unitTypes: defaultUnitTypes.unitTypes, selectedUnitTypes: ['warrior'] };
    }
}

class User {
    constructor(io, socket) {
        this.id = socket.id;
        this._io = io;
        this._socket = socket;
        this.authenticated = false;
        this.userData;
        this.status = 'login';
        this.searchAttempts = 0;
        this.registerLoginHandlers();
        this.registerMatchmakingHandlers();
        this.registerUnitTypesHandlers();
    }
    registerLoginHandlers() {
        this._socket.on('CLIENT_LOGIN', data => {
            const { username, password } = data;
            if((this.authenticated = dbService.authenticate(username, password))) {
                this.userData = dbService.getUserData(username);
                this.status = 'idle';
                this.authenticated = true;
                this._socket.emit('SERVER_LOGIN_SUCCESS', { userData: this.userData });
            }else{
                this._socket.emit('SERVER_LOGIN_FAIL');
            }
        });
        this._socket.on('CLIENT_LOGOFF', data => {
            this.userData = {};
            this.status = 'login';
            this.authenticated = false;
        });
    }
    registerUnitTypesHandlers() {
        this._socket.on('CLIENT_SELECT_UNIT_TYPE', data => {
            const { unitTypeName } = data;
            const unitExists = this.userData?.unitTypes?.find(unit => unit.name == unitTypeName);
            if(unitExists) {
                const indexOf = this.userData.selectedUnitTypes.findIndex(unitName => unitName == unitTypeName);
                if(indexOf != -1) {
                    this.userData.selectedUnitTypes.splice(indexOf, 1);
                }else{
                    this.userData.selectedUnitTypes.push(unitTypeName);
                }
            }
            this._socket.emit('SERVER_SELECTED_UNIT_TYPES', { selectedUnitTypes: this.userData.selectedUnitTypes });
        });
    }
    registerMatchmakingHandlers() {
        this._socket.on('CLIENT_SEARCH', data => {
            if(this.status != 'searching' && this.authenticated) {
                console.log(`${this.id} searching fot match...`);
                this.searchAttempts = 0;
                this.status = 'searching';
            }
        });
        this._socket.on('CLIENT_SEARCH_STOP', data => {
            console.log(`${this.id} stop searching`);
            if(this.status != 'idle') {
                this.status = 'idle';
            }
        });
    }
    joinRoom(roomId) {
        this._socket.join(roomId);
    }
}

module.exports = User;