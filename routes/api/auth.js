const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

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

module.exports = router;