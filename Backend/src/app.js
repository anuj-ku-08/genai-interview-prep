import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.send("Gen AI Job Preparation API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;