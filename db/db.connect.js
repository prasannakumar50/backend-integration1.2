const mongoose = require("mongoose")
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeData = async ()=>{
    await mongoose.connect(mongoUri)
    .then(()=>{
        console.log("Connected Successfully")
    })
    .catch((error)=>{
        console.log("Error while connecting to database", error)
    })
}

module.exports = {initializeData}

