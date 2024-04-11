import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async () => {
    try {
        // console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`)
        //console.log(`\nconnection : %j`,connectionInstance)
    } catch (error) {
        console.log("Mongodb connection FAILD: ",error)
        process.exit(1)
    }
}

export default connectDB

// connecting to database 
// using mongo Atlas 