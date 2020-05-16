const express = require('express');
const router = express.Router();

// defining routes
//test rout
// /api/auth
router.get('/', (req,res)=>{
    res.send('Auth routes');
})

module.exports = router;