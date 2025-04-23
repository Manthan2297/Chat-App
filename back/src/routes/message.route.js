import express from "express";
import {
  getUserForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";
import { protectRoute } from "../middlewear/auth.middleware.js"; // Import the middleware

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/:id", protectRoute, getMessages); // Example route for getting user by ID
router.post("/send/:id", protectRoute, sendMessage); // Example route for sending a message

export default router;
