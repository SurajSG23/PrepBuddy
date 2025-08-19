import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRouter from "./routes/testRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import progressRouter from "./routes/progressRouter.js";
import authRouter from "./routes/authRouter.js";
import quizRouter from "./routes/quizRouter.js";


import { connectDB } from "./config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const questionsPath = path.join(
  __dirname,
  "..",
  "Client",
  "src",
  "components",
  "Custom",
  "questions.json"
);
let questionsData;
try {
  const questionsPath = path.join(
    __dirname,
    "..",
    "Client",
    "src",
    "components",
    "Custom",
    "questions.json"
  );
  const fileContent = fs.readFileSync(questionsPath, "utf-8");
  questionsData = JSON.parse(fileContent);
} catch (error) {
  process.exit(1);
}
app.get("/api/questions/:topicName", (req, res) => {
  const { topicName } = req.params;
  const questionsForTopic = questionsData[topicName];

  if (questionsForTopic) {
    res.json(questionsForTopic);
  } else {
    res.status(404).json({ message: "Topic not found" });
  }
});

// More permissive CORS for development
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost on any port for development
      if (origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      
      // Allow specific production domains
      const allowedOrigins = [
        "https://prep-buddy-test.vercel.app", 
        "https://prep-buddy-k75f.vercel.app"
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/upload", uploadRouter);
app.use("/progress", progressRouter);
app.use("/quiz", quizRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
