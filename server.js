import express from "express"
import dotenv from "dotenv"
import cloudinary from "cloudinary"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.routes.js"  
import connectDB from "./db/connectDB.js"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.routes.js"
import notificationRoute from "./routes/notification.routes.js"

dotenv.config() 
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key :process.env.CLOUDINARY_API_KEY  ,
    api_secret : process.env.CLOUDINARY_SECRET_KEY,
})

const app = express() 
const PORT = process.env.PORT;  

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRoute) ; 
app.use("/api/users" , userRoute) ;
app.use("/api/posts" , postRoute) ;
app.use("/api/notifications" , notificationRoute)


app.listen(PORT , ()=>{   
           console.log(`server is running on ${PORT}`);
           connectDB()
           
}) 