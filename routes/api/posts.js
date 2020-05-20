const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check , validationResult} = require('express-validator');
const User = require('../../models/Users');

//3 @private
//2@create a post
//1 @post  /api/posts
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
        //we use user model bcz we have used user in our post model , jisse hamara name ,avatar aa jayega
       // and remember we are logged in so we have token 
       //we dont need password so we ignore like that way in node js
        const user = await Users.findById(req.user.id).select("-password");
        //abhi yaha per naya object banaya hai
        const newPost =new Post ({
            text : req.body.text,
            avatar : user.avatar,
            user : req.user.id,
            name : user.name
        });
       const post = await newPost.save();
       res.json(post);
    } catch (error) {
        console.error('error' , error);
    }
    // res.send('posts routes');
//3 @private
//2@get all post
//1 @get  /api/posts
router.get('/',auth ,async(req,res)=>{
try {
    // takikng posts to display all the posts from recent date
   const posts = await Post.find().sort({date: -1}); 
   res.json(posts);
} catch (error) {
    console.log('error', error);
}
})
})

module.exports = router;