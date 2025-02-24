import mongoose from "mongoose";

async function ConnectDB(){
    try {
        const connectMongoos = await mongoose.connect(process.env.Mongoos_Connection_String)
        console.log(`DB connect successfully ${connectMongoos.connection.host}`)
    } catch (error) {
        console.log("something went wrong please check Mongoose",error,process.env.Mongoos_Connection_String)
        
    }
}
export default ConnectDB