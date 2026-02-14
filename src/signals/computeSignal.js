//import db models
const issueModel = require("../models/issue");
const repoModel = require("../models/repository");
const signalModel = require("../models/signal");

//import functions
const { computeAndReturnCrowdScore } = require("./crowdSignal");
const { computeAndReturnFreshnessScore } = require("./freshnessSignal");
const { computeAndReturnRepoActivityScore } = require("./repoActivitySignal");

async function computeSignalForAllIssues() {
  const issues = await issueModel.find();
  const repos = await repoModel.find();

  const repoMap = new Map();

  for (const repo of repos) {
    repoMap.set(repo.repo_id, repo);
  }

  // repos.forEach((repo) => {
  //   repoMap.set(repo.repo_id, repo);
  // });

  for (const issue of issues) {
    const repo = repoMap.get(issue.repo_id);

    const freshness = computeAndReturnFreshnessScore(issue);
    const crowd = computeAndReturnCrowdScore(issue);
    //writing like this just in case the data isn't consistent
    const repoActivity = repo ? computeAndReturnRepoActivityScore(repo) : 0;

    await signalModel.updateOne(
      { issue_id: issue.issue_id },
      {
        $set: {
          freshness_score: freshness,
          crowd_score: crowd,
          repo_activity_score: repoActivity,
          label_intent_score: 0.5, //placeholder,
          computed_at: new Date(),
        },
      },

      { upsert: true },
    );
  }

  console.log("signals computed and stored");
}

module.exports = { computeSignalForAllIssues };
