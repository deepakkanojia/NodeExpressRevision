//These libraries we require we have installed these in previous session
const mongoose = require('mongoose');
//another librarie that we require 
const config = require('config');
//now we want to connect with database 
const db = config.get('mongoURI');

//abhi connection string aa gayi to ab connect karenge
const connectDB = async () => {
    try{
        // abhi ye connection karege mongoose.connect(db) us string ke saath
       
        await mongoose.connect(db,{
           useNewUrlParser : true,
           useUnifiedTopology : true
       });
       console.log('Connected Succesfully');

    }catch(err)
    {
        console.error(err.message);
        process.exit(1);
    }
}
// ab ye export karna hai
module.exports = connectDB;
