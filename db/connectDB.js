import mongoose from "mongoose";

// Connect to MongoDB
// Uses MONGO_URL from .env, falls back to local MongoDB if that fails
const connectDB = async () => {
    const primaryUrl = process.env.MONGO_URL;
    const localUrl = "mongodb://127.0.0.1:27017/twitter";

    // Try the main URL first (Atlas or remote)
    if (primaryUrl) {
        try {
            await mongoose.connect(primaryUrl);
            console.log("Connected to MongoDB successfully");
            return;
        } catch (err) {
            console.warn("Primary MongoDB failed:", err.message, "— trying local...");
        }
    }

    // Fallback: try local MongoDB (useful during development)
    try {
        await mongoose.connect(localUrl);
        console.log("Connected to local MongoDB (127.0.0.1:27017)");
    } catch (err) {
        console.error("Both MongoDB connections failed:", err.message);
        process.exit(1); // Stop the server — can't run without a database
    }
};

export default connectDB;