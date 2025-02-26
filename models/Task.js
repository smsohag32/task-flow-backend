import mongoose from "mongoose";

const { Schema } = mongoose;

const TaskSchema = new Schema(
   {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: Date, required: true },
      status: {
         type: String,
         enum: ["Pending", "Completed"],
         default: "Pending",
      },
      priority: {
         type: String,
         enum: ["High", "Medium", "Low"],
         default: "Medium",
      },
      googleCalendarEventId: { type: String },
   },
   { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
