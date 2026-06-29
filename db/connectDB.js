import mongoose from "mongoose";

// Cache the connection across Vercel serverless warm invocations
let cached = global._mongoConn;
if (!cached) {
    cached = global._mongoConn = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn; // Reuse existing connection
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URL)
            .then((m) => {
                console.log("connected to db");
                return m;
            })
            .catch((err) => {
                cached.promise = null;
                console.log(`error in the db : ${err}`);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

export default connectDB;