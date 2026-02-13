const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    issue_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    number: Number,
    repo_id: {
      type: String,
      required: true,
      index: true,
    },
    title: String,
    body: String,
    labels: [String],
    comment_count: Number,
    created_at: Date,
    updated_at: Date,
    state: {
      type: String,
      default: "open",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("issue", issueSchema);
