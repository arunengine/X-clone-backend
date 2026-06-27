import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { v2 as cloudinary } from "cloudinary"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.routes.js"
import connectDB from "./db/connectDB.js"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.routes.js"
import notificationRoute from "./routes/notification.routes.js"

dotenv.config()
connectDB()
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY,
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000", "https://x-clone-frontend-sigma.vercel.app"],
    credentials: true
}))

// Health check
app.get("/", (req, res) => res.send("API is running"))

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/notifications", notificationRoute)

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

export default app;