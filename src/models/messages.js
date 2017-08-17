import mongoose from 'mongoose'
import db from '../utils/db';

const Schema = mongoose.Schema;

let schema = Schema({
    from: { type: Schema.Types.ObjectId, ref: 'user' },
    to: { type: Schema.Types.ObjectId, ref: 'user' },
    date: Date,
    text: String,
    _shown: Boolean,
    _del_uid: Schema.Types.ObjectId
});

let model = mongoose.model('messages', schema);

export default model;