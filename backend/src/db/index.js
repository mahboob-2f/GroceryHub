import mongoose from "mongoose";

const connectDB= async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("MongoDB connected !!! , DB host : ",connectionInstance.connection.host);

    }catch(error){
        console.log('Connection Error : ',error.message);
    }
}
export default connectDB;