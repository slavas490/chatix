import mongoose from 'mongoose'
import db from '../utils/db';

let schema = mongoose.Schema({
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
    }
});

let model = mongoose.model('user', schema);

export default model;