const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    percent: { type: Number, required: true },
  },
  {
    _id: false,
  },
);

const repositorySchema = new mongoose.Schema(
  {
    repo_id: { type: Number, required: true, unique: true, index: true },
    
    name: String,
    full_name: String,
    primary_language: [languageSchema],
    stars: Number,
    last_activity_at: Date,
    url: String,

    activity_stats: {
      totalCommits: Number,
      activeWeeks: Number,
      consistency: Number,
      staleness: Number,
      momentum: Number,
      weekendFocus: Number
    },
  },
  
  { timestamps: true }
);
module.exports = mongoose.model("repository", repositorySchema);
