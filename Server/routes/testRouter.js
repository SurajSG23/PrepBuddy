const express = require("express");
const router = express.Router();
const testModel = require("../models/testModel");
const userModel = require("../models/userModel");

router.get("/", (req, res) => {
  res.send("Register page1");
});

router.post("/addtest", async (req, res) => {
  const test = await testModel.create({
    title: req.body.title,
    difficulty: req.body.difficulty,
    userid: req.body.userid,
    topic: req.body.topic || "Any",
  });
  res.send(test);
});

router.post("/updateScore/:id", async (req, res) => {
  try {
    const test = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $inc: {
          points: req.body.points,
          testAttended: 1,
        },
      },
      { new: true }
    );
    if (!test) {
      return res.status(404).send("User not found");
    }
    res.send(test);
  } catch (error) {
    console.error("Error updating score:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/updateScoreInTestModel/:id", async (req, res) => {
  try {
    const test = await testModel.findOneAndUpdate(
      { userid: req.params.id },
      { score: req.body.score },
      { new: true, sort: { createdAt: -1 } }
    );
    if (!test) {
      return res.status(404).send("User not found");
    }
    res.send(test);
    console.log("All tests:", test);
  } catch (error) {
    console.error("Error updating score:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/updateBadge/:id", async (req, res) => {
  try {
    const test = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        badges: req.body.badges,
      },
      { new: true }
    );
    if (!test) {
      return res.status(404).send("User not found");
    }
    res.send(test);
  } catch (error) {
    console.error("Error updating score:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/gettest/:id", async (req, res) => {
  const test = await testModel.findOne({ userid: req.params.id }).sort({
    createdAt: -1,
  });
  console.log(test);
  res.send(test);
});
router.get("/getTop3Tests/:id", async (req, res) => {
 try {
    const topTests = await testModel.find({ userid: req.params.id })
      .sort({ createdAt: -1 })
      .limit(3); 

    res.send(topTests);
  } catch (error) {
    console.error("Error fetching top 3 tests:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getAllTests/:id", async (req, res) => {
  const test = await testModel.find({ userid: req.params.id }).sort({
    createdAt: -1,
  }).limit(20);
  console.log(test);
  res.send(test);
});

module.exports = router;
