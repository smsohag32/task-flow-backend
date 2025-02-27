import { Task } from "../models/index.js";
import addTaskToGoogleCalendar from "./calendar.controller.js";

export const createTask = async (req, res) => {
   try {
      const { title, description, dueDate, status, priority } = req.body;
      const userId = req.user.id;

      if (!title || !dueDate) {
         return res.status(400).json({ message: "Title and Due Date are required." });
      }

      const newTask = new Task({ userId, title, description, dueDate, status, priority });
      await newTask.save();

      const taskForGoogleCalendar = {
         title,
         description,
         dueDate,
         status,
         priority,
      };

      // try {
      //    await addTaskToGoogleCalendar(req.session.tokens, taskForGoogleCalendar);
      //    res.status(200).send(`Task synced with Google Calendar: ${newTask.title}`);
      // } catch (googleError) {
      //    console.error("Error syncing with Google Calendar:", googleError);
      //    res.status(500).send("Task created, but failed to sync with Google Calendar.");
      // }

      res.status(201).json({ message: "Task created successfully", task: newTask });
   } catch (error) {
      res.status(500).json({ message: "Server Error", error });
   }
};
export const getTasks = async (req, res) => {
   try {
      const userId = req.user.id;
      const tasks = await Task.find({ userId }).sort({ dueDate: 1 });

      res.status(200).json({ tasks });
   } catch (error) {
      res.status(500).json({ message: "Server Error", error });
   }
};

export const getTaskById = async (req, res) => {
   try {
      const task = await Task.findById(req.params.id);

      if (!task || task.userId.toString() !== req.user.id) {
         return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({ task });
   } catch (error) {
      res.status(500).json({ message: "Server Error", error });
   }
};

export const updateTask = async (req, res) => {
   try {
      const { title, description, dueDate, priority, status } = req.body;
      const task = await Task.findById(req.params.id);

      if (!task || task.userId.toString() !== req.user.id) {
         return res.status(404).json({ message: "Task not found" });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;

      await task.save();
      res.status(200).json({ message: "Task updated successfully", task });
   } catch (error) {
      res.status(500).json({ message: "Server Error", error });
   }
};

export const changeTaskStatus = async (req, res) => {
   try {
      const { status } = req.body;
      const task = await Task.findById(req.params.id);

      if (!task || task.userId.toString() !== req.user.id) {
         return res.status(404).json({ message: "Task not found" });
      }

      if (!["Inprogress", "Pending", "Completed"].includes(status)) {
         return res.status(400).json({ message: "Invalid status value" });
      }

      task.status = status;
      await task.save();

      res.status(200).json({ message: "Task status updated", task });
   } catch (error) {
      res.status(500).json({ message: "Server Error", error });
   }
};

export const deleteTask = async (req, res) => {
   try {
      const id = req.params.id;
      const task = await Task.findById(id);
      console.log(task);
      if (!task || task.userId.toString() !== req.user.id) {
         return res.status(404).json({ message: "Task not found" });
      }

      await task.deleteOne();
      res.status(200).json({ message: "Task deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: "Server Error", error });
   }
};
