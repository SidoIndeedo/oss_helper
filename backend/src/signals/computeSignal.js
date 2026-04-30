//import db models
const issueModel = require("../models/issue");
const repoModel = require("../models/repository");
const signalModel = require("../models/signal");

//import functions
const { computeAndReturnCrowdScore } = require("./crowdSignal");
const { computeAndReturnFreshnessScore } = require("./freshnessSignal");
const { computeAndReturnRepoActivityScore } = require("./repoActivitySignal");
const { LLMAnalyzer } = require("../utils/llmAnalyzer");

// Initialize LLM analyzer
const llmAnalyzer = new LLMAnalyzer();

async function computeAndReturnLabelIntentScore(issue) {
  try {
    // Use LLM to analyze the issue for beginner suitability
    const score = await llmAnalyzer.analyzeIssueForBeginners(issue);
    return Number.isFinite(score) ? score : 0.5;
  } catch (error) {
    console.error(`Error computing label intent for issue ${issue.issue_id}:`, error.message);
    // Fallback to rule-based scoring
    return fallbackLabelIntentScore(issue);
  }
}

// Fallback rule-based scoring when LLM fails
function fallbackLabelIntentScore(issue) {
  const labels = Array.isArray(issue.labels)
    ? issue.labels.map((label) => String(label).toLowerCase())
    : [];

  if (labels.some((label) => /good[\s-]*first[\s-]*issue|good-first-issue|beginner|easy|help wanted|documentation/.test(label))) {
    return 1.0;
  }

  if (labels.some((label) => /bug|performance|security|critical/.test(label))) {
    return 0.4;
  }

  return 0.6;
}

async function computeSignalForAllIssues() {
  try {
    console.log("Starting signal computation...");
    const issues = await issueModel.find();
    const repos = await repoModel.find();
    console.log(`Found ${issues.length} issues and ${repos.length} repos`);

    const repoMap = new Map();

    for (const repo of repos) {
      // Use STRING key for consistent lookups
      repoMap.set(String(repo.repo_id), repo);
    }

    let signalCount = 0;
    for (const issue of issues) {
      const repo = repoMap.get(String(issue.repo_id));

      const freshness = computeAndReturnFreshnessScore(issue);
      const crowd = computeAndReturnCrowdScore(issue);
      const labelIntent = await computeAndReturnLabelIntentScore(issue); // Now async
      
      const repoActivity = (repo && repo.activity_stats && repo.activity_stats.totalCommits) ? computeAndReturnRepoActivityScore(repo.activity_stats) : 0;

      console.log(`Processing issue ${issue.issue_id}: freshness=${freshness}, crowd=${crowd}, repoActivity=${repoActivity}, labelIntent=${labelIntent}`);

      await signalModel.updateOne(
        { issue_id: issue.issue_id },
        {
          $set: {
            freshness_score: Number.isFinite(freshness) ? freshness : 0,
            crowd_score: Number.isFinite(crowd) ? crowd : 0,
            repo_activity_score: Number.isFinite(repoActivity) ? repoActivity : 0,
            label_intent_score: Number.isFinite(labelIntent) ? labelIntent : 0.5,
            computed_at: new Date(),
          },
        },
        { upsert: true }
      );
      signalCount++;
    }

    console.log(`signals computed and stored: ${signalCount} signals`);
  } catch (error) {
    console.error("Error in computeSignalForAllIssues:", error);
    throw error;
  }
}


module.exports = { computeSignalForAllIssues };
