<<<<<<< HEAD
import mongoose from "mongoose";
import dotenv from "dotenv";
=======
const mongoose = require("mongoose");
const dotenv = require("dotenv");
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

<<<<<<< HEAD
export { connectDB };
=======
module.exports = connectDB;
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
