import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createInterviewReport,
  getMyReports,
  getReportById,
  downloadReportPdf
} from "../controllers/interview.controller.js";

const router = express.Router();

router.get("/generate", (req, res) => {
  res.status(405).json({
    message: "This endpoint expects a POST request to generate an interview report.",
  });
});

router.post("/generate", protect, upload.single("resume"), createInterviewReport);
router.get("/my-reports", protect, getMyReports);
router.get("/report/:id", protect, getReportById);
router.get("/report/:id/pdf", protect, downloadReportPdf);
export default router;