const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema(
  {
    issue_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    freshness_score: Number,
    crowd_score: Number,
    repo_activity_score: Number,
    label_intent_score: Number,
    computed_at: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("signal", signalSchema);
