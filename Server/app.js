import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD
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
=======
import registerRouter from "./routes/registerRouter.js";
import testRouter from "./routes/testRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import cookieParser from "cookie-parser";
const connectDB = require("./config/db.js");
connectDB();
dotenv.config();
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
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
=======
app.use(
  cors({
    origin: ["http://localhost:5173", "https://prep-buddy-test.vercel.app"],
    credentials: true,
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
<<<<<<< HEAD

=======
app.use(cookieParser());
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e

app.get("/", (req, res) => {
  res.send("API is running...");
});

<<<<<<< HEAD
app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/upload", uploadRouter);
app.use("/progress", progressRouter);
app.use("/quiz", quizRouter);
=======
app.use("/register", registerRouter);
app.use("/test", testRouter);
app.use("/upload", uploadRouter);
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
