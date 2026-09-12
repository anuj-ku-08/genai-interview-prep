import "dotenv/config";
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const interviewReportSchema = {
  type: Type.OBJECT,
  properties: {
    skillGapAnalysis: {
      type: Type.OBJECT,
      properties: {
        missingSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Skills mentioned in job description or expected for role but absent in resume",
        },
        matchedSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Skills present in both resume and target job profile",
        },
        recommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Actionable recommendations to bridge the gap",
        },
      },
      required: ["missingSkills", "matchedSkills", "recommendations"],
    },
    technicalQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING, description: "Why interviewer asks this" },
          sampleAnswer: { type: Type.STRING, description: "Ideal response structure" },
        },
        required: ["question", "intention", "sampleAnswer"],
      },
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          intention: { type: Type.STRING, description: "Assessing culture and soft skills" },
          sampleAnswer: { type: Type.STRING, description: "STAR method response outline" },
        },
        required: ["question", "intention", "sampleAnswer"],
      },
    },
  },
  required: ["skillGapAnalysis", "technicalQuestions", "behavioralQuestions"],
};

export const generateInterviewReportFromAI = async ({
  jobRole,
  jobDescription,
  resumeText,
}) => {
  if (!apiKey || !ai) {
    throw new Error("GEMINI_API_KEY is missing. Add a valid Google Gemini API key to Backend/.env.");
  }

  const prompt = `
You are an expert technical recruiter and hiring manager.
Analyze the following candidate's resume against the target Job Role and optional Job Description.

Target Job Role: ${jobRole}
Job Description: ${jobDescription || "Standard industry requirements for this role"}

Candidate Resume:
${resumeText}

Generate:
1. Skill Gap Analysis (Matched skills, missing skills, actionable advice).
2. 5 Technical Interview Questions tailored to this exact gap and background with intentions and sample answers.
3. 3 Behavioral Interview Questions tailored to the profile with intentions and sample answers.
`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  return JSON.parse(response.text.trim());
};