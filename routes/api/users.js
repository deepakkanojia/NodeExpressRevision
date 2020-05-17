const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//library that we installed earliar
const gravtar = require('gravatar');
//include this file also for validation result
const {check , validationResult } = require('express-validator/check');
const Users = require('../../models/Users');
// defining routes it is a post request
// 1st we use get request from our server to test weather it is working or not
//test rout
// /api/users

// @route POST api/users
// @description Register user
// @access

router.post('/',[
    check('name' , 'Name is required')
    .not()
    .isEmpty(),
    check('email' , 'Email is required')
    .isEmail(),
    check('password' , 'enter password should be greater than 8 words')
    .isLength({min : 8})
] ,async(req,res)=>{
    // console.log(req.body);
    //ab sare result iske ander store honge
    const errors = validationResult(req);
    //abhi check kerna hai ki hamara errors khali nahi hai 
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }

    const {name , email ,password } = req.body ;
    try{
    // see if the user exist
    //abhi yaha user naam ke variable me hum ek function perform ker rahe hai jisse email ko dunda jaye
        let user = await Users.findOne({email});
        if(user){
            return res.status(400).json([{msg :"user already present"}]);
        }

        //creating instance of user
            user = new Users({
                name,
                email,
                gravatar,
                password
            });


    //Get user gravatar
    const avatar = gravtar.url(email , {
        s : 200,
        // s is for size
        r : 'pg',
        // r is for rating 
        d : 'mm'
        //d default icon 
    })

    //Encrypt password using bcrypt
    // abhi yaha per salt variable lenge hashing ke liye
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

    //return json Web token

    res.send('User routes');
    }
    catch(err){
        console.error(err);
    }
})

module.exports = router;