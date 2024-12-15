const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const DBConnection = async ()=>{
    const MONGODB_URI = process.env.MONGODB_URI
    try {
        await mongoose.connect(MONGODB_URI)//,{useNewUrlParser: true})
        console.log("DB connected Succesfully (Memory restored)")
    } catch (error) {
        console.log("Error in connecting with DB", error);
    }
}
module.exports = {DBConnection};