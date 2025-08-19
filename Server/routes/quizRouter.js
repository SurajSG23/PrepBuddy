import express from "express";
import Test from "../models/testModel.js";

const router = express.Router();

// Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Test.find({ type: "quiz" });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
});

// Get quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Test.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
});

// Create new quiz
router.post("/", async (req, res) => {
  try {
    const newQuiz = new Test({
      ...req.body,
      type: "quiz"
    });
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
});

// Update quiz
router.put("/:id", async (req, res) => {
  try {
    const updatedQuiz = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error: error.message });
  }
});

// Delete quiz
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuiz = await Test.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
});

export default router;
