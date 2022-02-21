const defaultUnitTypes = require('./defaultUnitTypes.json');

const dbService = {
    authenticate(username, password) {
        return true;
    },
    getUserData(username) {
        return { username: username, gold: 100, unitTypes: defaultUnitTypes.unitTypes };
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