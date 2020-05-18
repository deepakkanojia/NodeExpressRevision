const mongoose = require('mongoose');
//ye vali library install ki hai
const config = require('config');
//abhi hum library se get karenge jo hamari connection string hai
const db = config.get('mongoURI');
 
const connectDB = async () => {
    try{
       await mongoose.connect(db,{
           useNewUrlParser : true,
           useUnifiedTopology : true
       });
       console.log('MongoDb connected');
    
    }catch(err){
        console.error(err);
    }
}

module.exports  = connectDB;
