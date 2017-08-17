import mongoose from 'mongoose'
import db from '../utils/db';

const Schema = mongoose.Schema;

let schema = Schema({
    name: {
        first: String,
        last: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [ { type: Schema.Types.ObjectId, ref: 'user' } ],
    _socket: String
});

let model = mongoose.model('user', schema);

export default model;