import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbLink = `mongodb+srv://smsohag32:${process.env.DB_PASSWORD}@health-care.cbj6b.mongodb.net/task-flow?retryWrites=true&w=majority&appName=health-care`;

export const connectDb = async () => {
   try {
      await mongoose.connect(dbLink);
      console.log("database connected");
   } catch (error) {
      console.log("database is not connected");
      console.log(error.message);
   }
};
