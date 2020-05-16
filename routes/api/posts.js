const express = require('express');
const router = express.Router();

// defining routes
//test rout
// /api/posts
router.get('/', (req,res)=>{
    res.send('posts routes');
})

module.exports = router;