const mongoose = require('mongoose');
require("dotenv").config();
 
exports.connectToDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Running');
    }catch(err){
        console.log(err);
    }
}