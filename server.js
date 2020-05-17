const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
const connectDB = require('./config/db');
//connect db

connectDB();
// defining middleware
//pahele hame middleware install kerne padte the abb nahi
app.use(express.json({extended : false}));

// display kerne ke liye
app.get('/',(req,res)=>{
    res.send('API runing');
})
// defining routes for various  things through middleware
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));


app.listen(PORT , function(err){
    if(err)console.log('error occured', err);
    console.log('server id running on port', PORT);
})