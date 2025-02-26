import express from "express";
import userRoute from "./userRoute.js";
import taskRoute from "./taskRoute.js";
import googleAuthRoute from "./googleAuthRoute.js";

const router = express.Router();

router.use("/api/v1", userRoute);
router.use("/api/v1", taskRoute);
router.use("/api/v1", googleAuthRoute);

export default router;
