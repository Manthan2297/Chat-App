import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"; // Example route for messages
import { connectDB } from "./lib/db.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON (required if using req.body)
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes); // Example route for messages

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
