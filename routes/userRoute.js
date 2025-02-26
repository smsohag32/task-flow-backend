import express from "express";
import {
   registerUser,
   loginUser,
   getUserProfile,
   updateUserProfile,
   changePassword,
   forgotPassword,
   resetPassword,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get User Profile (protected route)
router.get("/profile", authMiddleware, getUserProfile);

// Update User Profile (protected route)
router.put("/profile", authMiddleware, updateUserProfile);

// Change User Password (protected route)
router.put("/change-password", authMiddleware, changePassword);

// Forgot Password (generate reset token)
router.post("/forgot-password", forgotPassword);

// Reset Password (using reset token)
router.post("/reset-password", resetPassword);

export default router;
