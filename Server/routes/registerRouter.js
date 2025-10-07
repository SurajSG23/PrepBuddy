const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

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
  console.log(user2);
  res.send(req.body);
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

module.exports = router;
