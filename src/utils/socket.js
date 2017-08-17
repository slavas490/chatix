import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import * as models from '../models'

const ObjectId = mongoose.Types.ObjectId;

class socket {
    constructor (socketio, sessionStorage) {
        this.socketio = socketio;

        socketio.on("connect", (socket) => {
            this.updateUserSocket(socket);

            socket.on("msg", data => this.event(socket, "msg", data));
        });
        
        this.sessionStorage = sessionStorage;
    }

    event (socket, type, data) {
        let session = this.getSession(socket);

        if(session) {
            socket.session = session;
            socket.sendId = data.f; //this.getSendId(socket);
        }

        if(typeof this[type] === "function") {
            this[type](socket, data.v);
        }
    }

    updateUserSocket (socket) {
        const session = this.getSession(socket);

        if(!session) {
            return false;
        }

        models.user.findById(session.user.id)
        .then(user => {
            user._socket = socket.id;
            user.save()
        });
    }

    getSendId (socket) {
        return socket.handshake.query.uid
    }
    
    getSession (socket) {
        const cookies = cookieParser.signedCookies(cookie.parse(socket.handshake.headers.cookie), 'keyboard cat');
        if( cookies ) {
            let c = this.sessionStorage.sessions[cookies['connect.sid']]
            return c ? JSON.parse(c) : null;
        }
        else {
            return null;
        }
    }

    getSocketByUserID (userID) {
        return models.user.findById(userID)
        .then(user => {
            if(user && user._socket){
                return this.socketio.sockets.sockets[user._socket];
            }
            else{
                return null;
            }
        });
    }

    /*
     * events
     */

    msg (socket, data) {
        if(!socket.session.user.id) {
            return false;
        }

        try {
            let msg = {
                from: ObjectId(socket.session.user.id),
                to: ObjectId(socket.sendId),
                date: new Date(),
                text: data,
                _shown: false
            };

            models.messages.collection.insert(msg)
            .then(out => {
                if(out && out.insertedCount) {
                    return this.getSocketByUserID(socket.sendId);
                }
            })
            .then(user => {
                if(user) {
                    user.emit("msg", msg);
                }
            });
        }
        catch(e) { }
    }
}

export default socket;