import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createInterviewReport,
  getMyReports,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/generate", protect, upload.single("resume"), createInterviewReport);
router.get("/my-reports", protect, getMyReports);

export default router;