import mongoose from "mongoose";

// Cache connection across serverless invocations (Vercel cold-starts)
let isConnected = false;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    const primaryUrl = process.env.MONGO_URL;
    if (!primaryUrl) {
        throw new Error("MONGO_URL environment variable is not defined");
    }

    try {
        await mongoose.connect(primaryUrl, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("Connected to MongoDB Atlas successfully");
    } catch (err) {
        console.error("MongoDB Atlas connection failed:", err.message);
        
        // If in local development, try local fallback
        if (process.env.NODE_ENV !== "production") {
            try {
                console.warn("Trying local MongoDB fallback...");
                await mongoose.connect("mongodb://127.0.0.1:27017/twitter");
                console.log("Connected to local MongoDB");
                return;
            } catch (localErr) {
                console.error("Local MongoDB also failed:", localErr.message);
            }
        }

        throw new Error(`MongoDB Connection Error: ${err.message}`);
    }
};

export default connectDB;