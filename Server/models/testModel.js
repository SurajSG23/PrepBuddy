const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
    default: "Any",
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  difficulty: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("test", testSchema);
