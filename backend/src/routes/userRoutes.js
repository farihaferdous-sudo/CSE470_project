import express from "express";
import { createUser, loginUser, getUser, addNotification } from "../controllers/userController.js";

const router = express.Router();

// Routes
router.post("/", createUser); // Create new user
router.post("/login", loginUser); // Login user
router.get("/", getUser); // Get all user
router.put("/:id/notifications", addNotification); // Add notification to a user
router.post("/login", loginUser);


export default router;