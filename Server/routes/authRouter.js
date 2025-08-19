import express from "express";
import User from "../models/userModel.js";
import { generateToken,jwtAuthMiddleware } from "../middleware/jwtAuthMiddleware.js";

const router = express.Router();

router.get("/me", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { name, email, profilepic } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = new User({
        name,
        email,
        profilepic: profilepic || "/default-profile.jpg",
        authProvider: 'google'
      });
      await user.save();
    }

    const payload = {
      id: user.id,
      name: user.name,
    };

    const token = generateToken(payload);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Authentication successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
