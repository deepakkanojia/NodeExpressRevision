const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check , validationResult} = require('express-validator');
const Post = require('../../models/Post');

// @private
//@create a post
// @post  /api/posts
router.post('/',[auth,[
    check('text' , 'text is required')
    .not()
    .isEmpty()
]] , async(req,res)=>{
    try {
       const errors = validationResult(req);
       if(!errors.isEmpty())
       {
           return res.status(400).json({errors : errors.array()});
       } 


    } catch (error) {
        console.error('error' , error);
    }
    // res.send('posts routes');
})

module.exports = router;