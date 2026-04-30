const issueModel = require("../models/issue");
const repoModel = require("../models/repository");
const signalModel = require("../models/signal");

const PROFICIENCY_LEVELS = {
  BEGINNER: 0.2,
  INTERMEDIATE: 0.5,
  ADVANCED: 0.8,
  EXPERT: 1.0,
};

async function rankIssue(userPreference) {
  console.log("📥 Received user preference:", userPreference);
  let issues;
  let repos;
  let signals;
  try{
  issues = await issueModel.find();
  repos = await repoModel.find();
  signals = await signalModel.find();
  } catch (err) {
    console.error("Error fetching data from DB:", err);
    throw new Error("Database error");
  }


  //making map for fast lookup rather than using db calls
  const signalMap = new Map();
  const repoMap = new Map();
  const ranked = [];

  let proficiency = 0;

  for (const signal of signals) {
    signalMap.set(String(signal.issue_id), signal);
  }

  for (const repo of repos) {
    repoMap.set(String(repo.repo_id), repo);
  }

  for (const issue of issues) {
    let stackMatch = 0;

    const signal = signalMap.get(String(issue.issue_id));
    const repo = repoMap.get(String(issue.repo_id));

    if (!signal || !repo) continue;

    const normalizedPrefs = Array.isArray(userPreference)
      ? userPreference.map((pref) => ({
          name: String(pref.name || "").trim().toLowerCase(),
          level: String(pref.level || "").trim().toUpperCase(),
        }))
      : [];

    const repoLanguages = [];
    if (Array.isArray(repo.primary_language)) {
      repoLanguages.push(...repo.primary_language);
    } else if (repo.primary_language && typeof repo.primary_language === "object" && repo.primary_language.name) {
      repoLanguages.push(repo.primary_language);
    } else if (typeof repo.primary_language === "string") {
      repoLanguages.push({ name: repo.primary_language, percent: 100 });
    }

    if (normalizedPrefs.length > 0) {
      repoLanguages.forEach((repoLangObj) => {
        const repoName = String(repoLangObj.name || "").trim().toLowerCase();
        const userSkill = normalizedPrefs.find((u) => u.name === repoName);

        if (userSkill) {
          const multiplier = PROFICIENCY_LEVELS[userSkill.level] ?? 0.1;
          const percent = Number(repoLangObj.percent) || 100;
          stackMatch += (percent / 100) * multiplier;
        }
      });
    }

    // if stack barely matches, skip the issue
    if (stackMatch < 0.01) continue;

    const freshness = signal.freshness_score || 0;
    const crowd = signal.crowd_score || 0;
    const repoActivity = signal.repo_activity_score || 0;
    const labelIntent = signal.label_intent_score || 0;

    const score =
      freshness * 0.2 +
      crowd * 0.2 +
      repoActivity * 0.15 +
      labelIntent * 0.15 +
      stackMatch * 0.3;

    const noise = Math.random() * 0.02;
    const finalScore = score + noise;

    ranked.push({
      url: `https://www.github.com/${repo.full_name}/issues/${issue.number}`,
      title: issue.title,
      repo: repo.full_name,
      score: Number(finalScore.toFixed(4)),
      explanation: {
        freshness,
        crowd,
        repoActivity,
        labelIntent,
        stackMatch: Number(stackMatch.toFixed(4)),
      },
    });
  }

  //sort
  ranked.sort((a, b) => b.score - a.score);

  return ranked;
}

module.exports = { rankIssue };
