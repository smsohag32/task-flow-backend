import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// User Registration
export const registerUser = async (req, res) => {
   const { name, email, password } = req.body;

   try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const newUser = new User({
         name,
         email,
         password,
      });

      // Save the user to the database
      await newUser.save();

      return res.status(201).json({ message: "User created successfully" });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

// User Login
export const loginUser = async (req, res) => {
   const { email, password } = req.body;

   try {
      // Check if the user exists
      const user = await User.findOne({ email }).select("-password");
      if (!user) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
         message: "Login successful",
         token,
         user,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
         name: user.name,
         email: user.email,
         googleAuthSecret: user.googleAuthSecret,
         isGoogleConnected: user.isGoogleConnected,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

// Update User Profile (e.g. Name)
export const updateUserProfile = async (req, res) => {
   const { name, email } = req.body;

   try {
      const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });

      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
         message: "Profile updated successfully",
         user: {
            name: user.name,
            email: user.email,
         },
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

// Change User Password
export const changePassword = async (req, res) => {
   const { oldPassword, newPassword } = req.body;

   try {
      const user = await User.findById(req.user.id);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // Check if old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
         return res.status(400).json({ message: "Incorrect old password" });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 120000; // 2 min expiration
      await user.save();

      // Send reset email
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
         },
      });

      const mailOptions = {
         to: email,
         from: process.env.EMAIL,
         subject: "Password Reset",
         text: `You are receiving this email because you (or someone else) requested a password reset. Please use the following token to reset your password: ${resetToken}`,
      };

      transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "Password reset email sent." });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

// Reset Password
export const resetPassword = async (req, res) => {
   const { token, newPassword } = req.body;

   try {
      const user = await User.findOne({
         resetPasswordToken: token,
         resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
         return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Update password
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(200).json({ message: "Password reset successful" });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};
