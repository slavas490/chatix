import express from 'express'
import mongoose from 'mongoose'
import * as models from '../models'

const router = express.Router()
const ObjectId = mongoose.Types.ObjectId;

// Missed

router.get('/left', (req, res) => {
    let sess = req.session;
    
    if(!sess.user) {
        res.err();
    }
    else {
        models.messages.find({
            to: ObjectId(sess.user.id),
            _shown: false
        })
        .then(out => {
            if(out) {
                res.send(out);
            }
            else {
                res.err();
            }
        });
    }
});

router.put('/left/:uid', (req, res) => {
    let sess = req.session;
    
    if(!sess.user) {
        res.err();
    }
    else {
        models.messages.find({
            to: ObjectId(sess.user.id),
            from: ObjectId(req.params.uid),
            _shown: false
        })
        .then(out => {
            out.forEach(el => {
                el._shown = true;
                el.save();
            });
        });

        res.ok();
    }
});

// Chat

router.get('/:uid', (req, res) => {
    let sess = req.session,
        uid = req.params.uid;
        
    if(!sess.user || !uid) {
        res.err();
    }
    else {
        models.messages.find({
            $or: [
                { from: ObjectId(uid), to: ObjectId(sess.user.id) },
                { to: ObjectId(uid), from: ObjectId(sess.user.id) }
            ]
        })
        .then(out => {
            if(out) {
                res.send(out);
            }
            else {
                res.err();
            }
        });
    }
});

module.exports = router