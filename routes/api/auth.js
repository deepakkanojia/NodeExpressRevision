const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const {check , validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

// defining routes
//test rout
// /api/auth

//auth mera middleware hai isko is router.get('/',auth,(req,res)) me user karenge
router.get('/',auth , async(req,res)=>{
   try{
       //abhi ye line is liye : ki user variable me findbyid karenge req.user.id ager jo cheez nahi chahiye vo hame .select(iske ander likh dena hai)
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
   }
   catch(err){
    console.error('error occured', err);
   }
})
//copied from users.js of api
// @route POST api/auth
// @description Authenticate user & get token
// @access Public
//it is a login page so we dont need to send the name

router.post('/',[
    check('email' , 'Email is required')
    .isEmail(),
    check('password' , 'password is required')
    .exists()
] ,async(req,res)=>{
    // console.log(req.body);
    //ab sare result iske ander store honge
    const errors = validationResult(req);
    //abhi check kerna hai ki hamara errors khali nahi hai 
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }

    const { email ,password } = req.body ;
    try{
    // see if the user exist
    //abhi yaha user naam ke variable me hum ek function perform ker rahe hai jisse email ko dunda jaye
        let user = await Users.findOne({email});
        if(!user){
            return res
            .status(400)
            .json([{msg :"invalid credentials"}]);
        }
        //to abhi yaha per isMatch me hum apne bcrypt ko call ker rahe hai aur vo compare ker raha hai simple string vs hashed string
        const isMatch = await bcrypt.compare(password,user.password);
        //ager nahi mila to ye hoga
        if(!isMatch)
        {
            return res
            .status(400)
            .json([{msg :"invalid credentials"}]);
        }
   
    //return json Web token

        const payload = {
            user: {
                id : user.id
            }
        }
        jwt.sign(
            payload ,
            config.get('jwtSecret'),
           {expiresIn : 360000},
           (err, token) => {
               if(err) throw err;
               return res.json({token});
           } );
    }
    catch(err){
        console.error(err);
    }
})

module.exports = router;