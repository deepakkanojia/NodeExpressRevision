const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

app.get('/',(req,res)=>{
    res.send('API runing');
})

app.listen(PORT , function(err){
    if(err)console.log('error occured', err);
    console.log('server id running on port', PORT);
})