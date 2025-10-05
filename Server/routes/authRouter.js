import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { name, email, profilepic, firebaseUid } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = new User({
        _id: firebaseUid, // Use Firebase UID as MongoDB _id
        name,
        email,
        profilepic: profilepic || "/default-profile.jpg",
        authProvider: 'google'
      });
      await user.save();
    }

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
