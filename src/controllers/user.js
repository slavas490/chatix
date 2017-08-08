import express from 'express'
import userModel from '../models/user'

const router = express.Router()

router.post('/account/create', (req, res)=>{
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
        userModel.find({ username: params.username })
        .then(out => {
            if(out && out.length>0){
                res.err("username already exist", 10);
                return false;
            }
            else{
                let user = userModel({
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

module.exports = router