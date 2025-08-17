const mongoose = require('mongoose');
require("dotenv").config();

const connectToDb = async ()=>{
    try{
        
        console.log(process.env.MONGO_URL)
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Running');
    }catch(err){
        console.log(err);
    }
}

module.exports = connectToDb;