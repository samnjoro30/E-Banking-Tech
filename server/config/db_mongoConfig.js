const mongoose = require('mongoose');
require('dotenv').config();

const mongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected!');
        break;
    }catch(err){
        console.error("Mongo DB cant connect!", err);

    }

};

module.exports = mongoDB 