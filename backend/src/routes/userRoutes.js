// import express from "express";
// import { createUser, loginUser, getUser, addNotification,  getNotifications, postNotification } from "../controllers/userController.js";

// const router = express.Router();

// // Routes
// router.post("/", createUser); // Create new user
// router.post("/login", loginUser); // Login user
// router.get("/", getUser); // Get all user
// router.put("/:id/notifications", addNotification); // Add notification to a user
// router.post("/login", loginUser);

// // router.get("/:id/notifications", getNotifications);
// // router.post("/:id/notifications", postNotification);


// export default router;

import express from "express";
import { createUser, loginUser, getUser, addNotification,  getNotifications, postNotification } from "../controllers/userController.js";


const router = express.Router();

// Routes
router.post("/", createUser); // Create new user
router.post("/login", loginUser); // Login user
router.get("/", getUser); // Get all user
router.put("/:id/notifications", addNotification); // Add notification to a user
router.get("/:id/notifications", getNotifications);
router.post("/:id/notifications", postNotification);


router.post("/login", loginUser);


export default router;