import fs from "fs";
import pdfParse from "pdf-parse";
import InterviewReport from "../models/interview.model.js";

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

    // Read and parse PDF text
    const dataBuffer = fs.readFileSync(file.path);
    const parsedPdf = await pdfParse(dataBuffer);
    const resumeText = parsedPdf.text;

    // Clean up uploaded file after reading
    fs.unlinkSync(file.path);

    // Initial placeholder response before Day 5 Gemini integration
    res.status(200).json({
      message: "Resume extracted successfully. Ready for AI processing.",
      jobRole,
      jobDescription,
      extractedTextLength: resumeText.length,
    });
  } catch (error) {
    console.error("Interview Controller Error:", error);
    res.status(500).json({ message: "Error processing interview report" });
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