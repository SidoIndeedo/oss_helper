const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
  {
    repo_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: String,
    full_name: String,
    primary_language: String,
    stars: Number,
    last_activity_at: Date,
    url: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("repository", repositorySchema);
