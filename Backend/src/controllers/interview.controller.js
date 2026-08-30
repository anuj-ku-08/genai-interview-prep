import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import InterviewReport from "../models/interview.model.js";
import { generateInterviewReportFromAI } from "../services/ai.service.js";

export const createInterviewReport = async (req, res) => {
  try {
    const { jobRole, jobDescription } = req.body;
    const file = req.file;

    if (!jobRole) {
      return res.status(400).json({ message: "Job role is required" });
    }

    if (!file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    // 1. Parse PDF
    const dataBuffer = fs.readFileSync(file.path);
    const parsedPdf = await pdfParse(dataBuffer);
    const resumeText = parsedPdf.text;

    // Remove temporary file
    fs.unlinkSync(file.path);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from the PDF" });
    }

    // 2. Call Gemini AI Service
    const aiAnalysis = await generateInterviewReportFromAI({
      jobRole,
      jobDescription,
      resumeText,
    });

    // 3. Save to Database
    const report = await InterviewReport.create({
      user: req.user._id,
      jobRole,
      jobDescription: jobDescription || "",
      resumeText,
      skillGapAnalysis: aiAnalysis.skillGapAnalysis,
      technicalQuestions: aiAnalysis.technicalQuestions,
      behavioralQuestions: aiAnalysis.behavioralQuestions,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      report,
    });
  } catch (error) {
    console.error("Interview Generation Error:", error);
    res.status(500).json({ message: "Error generating interview report" });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await InterviewReport.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ reports });
  } catch (error) {
    console.error("Get Reports Error:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await InterviewReport.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ report });
  } catch (error) {
    console.error("Get Report By ID Error:", error);
    res.status(500).json({ message: "Error fetching report details" });
  }
};