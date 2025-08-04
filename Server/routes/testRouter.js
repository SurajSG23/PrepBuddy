import express from "express";
import testModel from "../models/testModel.js";
import userModel from "../models/userModel.js";

const router = express.Router();

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
    const topTests = await testModel
      .find({ userid: req.params.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.send(topTests);
  } catch (error) {
    console.error("Error fetching top 3 tests:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getAllTests/:id", async (req, res) => {
  const test = await testModel
    .find({ userid: req.params.id })
    .sort({
      createdAt: -1,
    })
    .limit(20);
  console.log(test);
  res.send(test);
});



router.get("/suggest/:id", async (req, res) => {
  try {
    const tests = await testModel.find({ userid: req.params.id }).sort({ score: 1 }).limit(5);

    if (tests.length === 0) {
      return res.send({ suggestion: "You haven't taken any tests yet! Why not start with a test from the homepage?" });
    }

    const lowestScoreTest = tests[0];
    const averageScore = tests.reduce((acc, t) => acc + t.score, 0) / tests.length;

    let suggestion = "";
    if (averageScore >= 7) {
      suggestion = `You're doing great with an average score of ${averageScore.toFixed(1)}/10! Why not challenge yourself with a 'Hard' difficulty test on a new topic?`;
    } else if (lowestScoreTest.score <= 5) {
      suggestion = `I noticed you scored ${lowestScoreTest.score}/10 on a test about '${lowestScoreTest.title}'. Perhaps you could practice more on that topic? Repetition is key!`;
    } else {
      suggestion = "You're making steady progress! Keep taking different tests to cover all your bases. How about trying a test on a Tier-1 company next?";
    }

    res.send({ suggestion });

  } catch (error) {
    console.error("Error fetching suggestion:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add this entire block to routes/testRouter.js

router.get("/suggest/:id", async (req, res) => {
  try {
    // Find the user's last 5 tests, sorted by lowest score first
    const tests = await testModel.find({ userid: req.params.id }).sort({ score: 1 }).limit(5);

    if (tests.length === 0) {
      return res.send({ suggestion: "You haven't taken any tests yet! Why not start with a test for a company like Google or Microsoft from the homepage?" });
    }

    const lowestScoreTest = tests[0];
    const averageScore = tests.reduce((acc, t) => acc + t.score, 0) / tests.length;

    let suggestion = "";
    if (averageScore >= 8) {
      suggestion = `You're doing great with an average score of ${averageScore.toFixed(1)}/10! To challenge yourself, how about trying a 'Hard' difficulty test on a new topic?`;
    } else if (lowestScoreTest.score <= 5) {
      suggestion = `I noticed you scored ${lowestScoreTest.score}/10 on a test about '${lowestScoreTest.title}'. It might be a good idea to practice more on that topic. Repetition is key to mastery!`;
    } else {
      suggestion = "You're making solid progress! Keep broadening your skills by trying tests from different companies or focusing on a specific technical subject you want to strengthen.";
    }

    res.send({ suggestion });

  } catch (error) {
    console.error("Error fetching suggestion:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
