import mongoose from 'mongoose' 

class db {
    constructor() {
        mongoose.Promise = Promise;  
    }

    connect (onConnectCB) {
        mongoose.connect('mongodb://localhost/chatix');

        const _connection = mongoose.connection
        this._connection = _connection;

        _connection.on('error', console.error.bind(console, 'connection error:'));
        _connection.once('open', ()=>{
            this.isConnected = true;
            if(typeof onConnectCB === 'function') {
                onConnectCB();
            }
        });
    }
}

export default db;