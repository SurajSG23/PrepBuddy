import express from "express";
import userModel from "../models/userModel.js";
import testModel from "../models/testModel.js";
import {generateToken} from "../middleware/jwtAuthMiddleware.js"
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Register page1");
});

router.get("/user", (req, res) => {
  res.send("Register page2");
});

router.get("/getuser/:email", async (req, res) => {
  let user = await userModel.findOne({ email: req.params.email });
  if (!user) {
    return res.status(400).send("User not found");
  }
  res.send(user);
});

router.get("/getuser2/:id", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.id });
  if (!user) {
    return res.status(400).send("User not found");
  }
  res.send(user);
});

router.get("/getTopTen", async (req, res) => {
  let user = await userModel.find({}).sort({ points: -1 }).limit(10);
  if (!user) {
    return res.status(400).send("User not found");
  }
  res.send(user);
});

router.get("/getRank/:id", async (req, res) => {
  try {
    const allUsers = await userModel.find({}).sort({ points: -1 });
    const rankIndex = allUsers.findIndex(
      (user) => user._id.toString() === req.params.id
    );
    if (rankIndex === -1) {
      return res.status(404).send("User not found");
    }
    res.send({ rank: rankIndex + 1 });
  } catch (error) {
    console.error("Error getting rank:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already exists");
  }
  const user2 = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    profilepic: req.body.profilepic,
  });
  const payload = {
    id: user2.id,
    name: user2.name,
    email: user2.email

  }

  const token = generateToken(payload);
  console.log(user2);
  res.status(200).send({
  user: req.body,
  token: token
});
});

router.post("/changeName/:id", async (req, res) => {
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { new: true }
  );
  if (!user) {
    return res.status(400).send("User not found");
  }
  res.send(user);
});

router.post("/changeProfilePic/:id", async (req, res) => {
  let user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    { profilepic: req.body.profilepic },
    { new: true }
  );
  if (!user) {
    return res.status(400).send("User not found");
  }
  res.send(user);
});

router.delete("/deleteAccount/:id", async (req, res) => {
  try {
    await testModel.deleteMany({ userid: req.params.id });
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send({ message: "Account and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
