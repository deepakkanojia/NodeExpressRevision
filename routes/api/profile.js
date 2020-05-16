const express = require('express');
const router = express.Router();

// defining routes
//test rout
// /api/profile
router.get('/', (req,res)=>{
    res.send('profile  routes');
})

module.exports = router;