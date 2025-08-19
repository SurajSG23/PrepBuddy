<<<<<<< HEAD
import mongoose from "mongoose";
=======
const mongoose = require("mongoose");
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e

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
<<<<<<< HEAD
    type: String,
  },
});

export default mongoose.model("test", testSchema);
=======
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("test", testSchema);
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
