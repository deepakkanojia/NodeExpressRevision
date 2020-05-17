const express = require('express');
const router = express.Router();
const {check , validationResult } = require('express-validator/check');
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
] ,(req,res)=>{
    // console.log(req.body);
    //ab sare result iske ander store honge
    const errors = validationResult(req);
    //abhi check kerna hai ki hamara errors khali nahi hai 
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }
    res.send('User routes');
})

module.exports = router;