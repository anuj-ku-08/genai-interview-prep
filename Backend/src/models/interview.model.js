import mongoose from "mongoose";

const interviewReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      default: "",
    },
    resumeText: {
      type: String,
      required: true,
    },
    skillGapAnalysis: {
      missingSkills: [String],
      matchedSkills: [String],
      recommendations: [String],
    },
    technicalQuestions: [
      {
        question: String,
        intention: String,
        sampleAnswer: String,
      },
    ],
    behavioralQuestions: [
      {
        question: String,
        intention: String,
        sampleAnswer: String,
      },
    ],
  },
  { timestamps: true }
);

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
export default InterviewReport;