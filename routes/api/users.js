const express = require('express');
const router = express.Router();

// defining routes
//test rout
// /api/users
router.get('/', (req,res)=>{
    res.send('User routes');
})

module.exports = router;