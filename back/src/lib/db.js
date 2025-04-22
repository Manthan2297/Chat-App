import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected successfully ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
