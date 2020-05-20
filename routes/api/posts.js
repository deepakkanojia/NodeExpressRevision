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

 // res.send('posts routes');
//3 @private
//2@get particular post
//1 @get  /api/posts/:id
router.get('/:id',auth ,async(req,res)=>{
    try {
        // takikng posts to display all the posts from recent date
       const post = await Post.findById(req.params.id); 
       res.json(post);
    } catch (error) {
        console.log('error', error);
    }
    })


     // res.send('posts routes');
//3 @private
//2@DELETE particular post
//1 @DELETE  /api/posts/:id
router.delete('/:id',auth ,async(req,res)=>{
    try { 
        // takikng posts to display all the posts from recent date
       const post = await Post.findById(req.params.id); 
        //check on user]
        if(post.user.toString() !== req.user.id)
        {
            return res.status(401).json({msg : 'User not Authorized'});
        }
            await post.remove();
            res.json({msg : 'Post have been removed'})
    } catch (error) {
        console.log('error', error);
    }
    })

    //3 @private
//2@Put particular post
//1 @Put  /api/posts/like/:id
router.put('/likes/:id' , auth , async(req,res)=>{
try {
    //abhi ye post model me find karega uski id se req.params.id is liye lagaya hai ki vo url se lele
    const post = await Post.findById(req.params.id);
    //check if post has been already present by the user liked
    if(post.like.filter(like => like.user.toString()=== req.user.id).length > 0){
        return res.json(400).json({msg : 'post already liked'});
    }
    post.likes.unshift({user : req.user.id});
    await post.save();
    req.json(post.likes);

} catch (error) {
    console.error('error is there', error);
}
})


 //3 @private
//2@Put particular post
//1 @Put  /api/posts/unlike/:id
router.put('/unlikes/:id' , auth , async(req,res)=>{
    try {
        //abhi ye post model me find karega uski id se req.params.id is liye lagaya hai ki vo url se lele
        const post = await Post.findById(req.params.id);
        //check if post has been already present by the user liked
        if(post.like.filter(like => like.user.toString()=== req.user.id).length === 0){
            return res.json(400).json({msg : 'post has been not liked'});
        }
       //get remove index
       const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
       post.like.splice(removeIndex,1);
        await post.save();
        req.json(post.likes);
    
    } catch (error) {
        console.error('error is there', error);
    }
    })
    
module.exports = router;