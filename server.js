import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { v2 as cloudinary } from "cloudinary"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js"
import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.routes.js"
import notificationRoute from "./routes/notification.routes.js"

// Load environment variables from .env file
dotenv.config()

// Configure Cloudinary for image uploads
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const app = express()
const PORT = process.env.PORT || 5000

// Parse JSON and form data from request bodies
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Allow cookies to be sent with requests (needed for JWT auth)
app.use(cookieParser())

// Allow cross-origin requests from the frontend
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks) or Vercel domains
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true)
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`))
        }
    },
    credentials: true // Required for cookies to work cross-origin
}))

// Health check route
app.get("/", (req, res) => res.send("API is running"))

// API routes
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/notifications", notificationRoute)

// Connect to database first, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

export default app