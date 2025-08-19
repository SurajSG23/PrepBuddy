import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import registerRouter from "./routes/registerRouter.js";
import testRouter from "./routes/testRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import cookieParser from "cookie-parser";
const connectDB = require("./config/db.js");
connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://prep-buddy-test.vercel.app"],
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
app.use("/test", testRouter);
app.use("/upload", uploadRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
