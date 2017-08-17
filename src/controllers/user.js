import express from 'express'
import mongoose from 'mongoose'
import * as models from '../models'

const router = express.Router()
const ObjectId = mongoose.Types.ObjectId;

// Find user(s)

router.get('/find/:userName', (req, res)=>{
    const q = { $regex: new RegExp(req.params.userName, 'i') };
    let sess = req.session;

    if(!sess.user) {
        res.err();
        return false;
    }

    models.user.findById(sess.user.id)
    .then(out => {
        if(out) {
            const friends = out.friends.map(e => {
                return e.toString();
            });

            return models.user.aggregate([
                {
                    $match: {
                        "_id": { $ne: ObjectId(sess.user.id) },
                        $or: [
                            { "name.first": q },
                            { "name.last": q },
                            { username: q }
                        ]
                    }
                },
                {
                    $project:
                    {
                        name: {
                            first: "$name.first",
                            last: "$name.last"
                        },
                        username: "$username",
                        friend: { $in: [ "$_id", out.friends ] }
                    } 
                }
            ]);
        }
        else {
            res.err();
        }
    })
    .then(out => {
        if(out) {
            res.send(out);
        }
        else {
            res.err();
        }
    });
});


// friends

router.get('/friends', (req, res)=>{
    let sess = req.session;

    if(!sess.user) {
        res.err();
        return false;
    }
    
    models.user.findById(sess.user.id)
    .populate('friends', 'name.first name.last username')
    .exec((err, out) => {
        if (out){
            res.send(out.friends);
        }
        else{
            res.err();
        }
    });
});

router.post('/friends/:id', (req, res)=>{
    let sess = req.session,
        id = req.params.id;
        
    if(sess.user) {
         models.user.findById(sess.user.id)
        .then(out => {
            if(out) {
                if(!out.friends.find((el) => el == id)) {
                    out.friends.push(id);
                    out.save();
                }

                res.ok();
            }
            else {
                res.err();
            }
        });
    }
});


// session

router.post('/session/restore', (req, res) => {
    let sess = req.session;
    
    if(!sess.user) {
        res.err();
    }
    else {
        models.user.findById(sess.user.id)
        .then(out => {
            if (!out) {
                res.err();
            }
            else {
                req.session.touch();
                res.ok();
            }
        })
    }
});


// account

router.post('/account/login', (req, res) => {
    let params = req.body;

    models.user.findOne({ username: params.username })
    .then(out => {
        if (!out || out.password !== params.pass) {
            res.err("user not found");
        }
        else {
            if(params.remember) {
                req.session.cookie.maxAge = 2592000000;
            }
            req.session.user = { id: out._id };
            res.ok();
        }
    })
});

router.post('/account/create', (req, res) => {
    let params = req.body, err = null;
    
    if(!params.firstName) {
        err = "first name doesn't specify";
    }
    else if(!params.lastName) {
        err = "last name doesn't specify";
    }
    else if(!params.username) {
        err = "user name doesn't specify";
    }
    else if(!params.pass) {
        err = "password doesn't specify";
    }
    else if(params.pass.length<6) {
        err = "password is too short (min: 6)";
    }
    else if(params.pass.length>32) {
        err = "password is too long (max: 32)";
    }
    else{
        models.user.find({ username: params.username })
        .then(out => {
            if(out && out.length>0){
                res.err("username already exist", 10);
                return false;
            }
            else{
                let user = models.user({
                    name: {
                        first: params.firstName,
                        last: params.lastName
                    },
                    username: params.username,
                    password: params.pass
                })

                user.save((err) => {
                    if (err){
                        res.err(err);
                    }
                    else{
                        req.session.user = { id: user._id };
                        res.ok();
                    }
                });
            }
        });
    }

    if(err){
        res.err(err);
    }
});


// User

router.get('/:id?', (req, res) => {
    let sess = req.session;
    
    if(!sess.user) {
        res.err();
    }
    else {
        try {
            models.user.findById(req.params.id ? req.params.id : sess.user.id)
            .then(out => {
                if(out) {
                    res.send({
                        _id: out._id,
                        name: {
                            first: out.name.first,
                            last: out.name.last
                        },
                        username: out.username
                    });
                }
                else {
                    res.err();
                }
            });
        }
        catch(e) { }
    }
});

module.exports = router