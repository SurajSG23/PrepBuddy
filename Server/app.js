import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registerRouter from "./routes/registerRouter.js";
import testRouter from "./routes/testRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { jwtAuthMiddleware } from "./middleware/jwtAuthMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
dotenv.config();

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

app.use(
  cors({
    origin: ["http://localhost:5173", "https://prep-buddy-test.vercel.app", "https://prep-buddy-k75f.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/register", registerRouter);
app.use("/test", jwtAuthMiddleware, testRouter);
app.use("/upload", jwtAuthMiddleware, uploadRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
