import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import registerRouter from "./routes/registerRouter.js";
import authRoutes from "./routes/authRoutes.js";
import testRouter from "./routes/testRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import {
  generalLimiter,
  quizLimiter,
  uploadLimiter,
  progressiveSlowDown,
  authLimiter,
} from "./middleware/rateLimiter.js";
import { initializeRedis } from "./middleware/redisStore.js";
import { rateLimitAnalytics } from "./middleware/rateLimitMonitor.js";
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis for distributed rate limiting (production)
if (process.env.NODE_ENV === "production") {
  initializeRedis();
}

app.use(
  cors({
    origin: ["http://localhost:5173", "https://prep-buddy-test.vercel.app"],
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// Trust proxy for accurate client IPs when behind reverse proxies
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Global progressive slow down
app.use(progressiveSlowDown);
// Rate limit analytics (logs 429s and headers)
app.use(rateLimitAnalytics);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health check (no rate limiting)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Apply route-specific rate limiting
app.use("/register", generalLimiter, registerRouter);
app.use("/auth", authLimiter, authRoutes);
app.use("/test", quizLimiter, testRouter);
app.use("/upload", uploadLimiter, uploadRouter);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: "The requested endpoint does not exist",
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
