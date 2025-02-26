import express from "express";
import { googleAuth, oauth2Callback } from "../controllers/googleAuth.controller.js";

const googleAuthRoute = express.Router();

googleAuthRoute.get("/auth/google", googleAuth);
googleAuthRoute.get("/oauth2callback", oauth2Callback);
// googleAuthRoute.post("/calendar/addTask", addTask);

export default googleAuthRoute;
