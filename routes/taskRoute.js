import express from "express";
import {
   createTask,
   getTasks,
   getTaskById,
   updateTask,
   changeTaskStatus,
   deleteTask,
} from "../controllers/task.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const taskRoute = express.Router();

// Route to create a new task
// Only accessible by authenticated users
taskRoute.post("/task", authMiddleware, createTask);

// Route to get all tasks for the authenticated user
// Only accessible by authenticated users
taskRoute.get("/tasks/all", authMiddleware, getTasks);

// Route to get a specific task by its ID
// Only accessible by authenticated users
taskRoute.get("/task/:id", authMiddleware, getTaskById);

// Route to update a task by its ID
// Only accessible by authenticated users
taskRoute.put("/task/:id", authMiddleware, updateTask);

// Route to change the status of a task by its ID
// Only accessible by authenticated users
taskRoute.patch("/task/:id/status", authMiddleware, changeTaskStatus);

// Route to delete a task by its ID
// Only accessible by authenticated users
taskRoute.delete("/task/:id", authMiddleware, deleteTask);

export default taskRoute;
