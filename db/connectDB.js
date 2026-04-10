import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
         await mongoose.connect(process.env.MONGO_URL)
         console.log("connected to db");
         

    }catch(err){
         console.log(`error in the db : ${err}`)
         process.exit(1)
         
    }
}

export default connectDB  