// orchestrates fetching
const {
  fetchOpenIssues,
  fetchRepoOfIssue,
  fetchLangOfRepo,
  fetchRepoActivity
} = require("./githubClient");
const { normaliseIssue } = require("./issueNormalizer");
const issueModel = require("../models/issue");
const repoModel = require("../models/repository");

async function ingestIssue(pageNumber = 1) {
  const rawIssues = await fetchOpenIssues(pageNumber);

  //filter out issues with pr because they are most probably solved
  const issuesWithNoPr = rawIssues.filter((e) => !e.pull_request);

  //now normalise these issues
  const normalisedIssuesPairedWithRepo = issuesWithNoPr.map(normaliseIssue);
  let count = 0;

  for (const pair of normalisedIssuesPairedWithRepo) {
    const { issue, repo } = pair;

    // 1. Identify owner and name for API calls
    // Ensure your normalizer provides 'full_name' (e.g., "facebook/react")
    const [userName, repoName] = repo.full_name.split("/");

    if (!userName || !repoName) {
      console.error(`Invalid repo name format: ${repo.full_name}`);
      continue;
    }

    const repoQuery = repo.repo_id ? { repo_id: repo.repo_id } : { full_name: repo.full_name };
    const existingRepo = await repoModel.findOne(repoQuery);

    // 2. Data Enrichment: Always fetch activity stats for debugging
    let repoStarData = null;
    let repoLanguage = null;
    let repoActivity = null;

    const hasActivityStats = existingRepo && existingRepo.activity_stats && Object.keys(existingRepo.activity_stats).length > 0 && existingRepo.activity_stats.totalCommits !== undefined;
    const needsRepoActivity = !existingRepo || !hasActivityStats;
    const needsLanguage = !existingRepo || !existingRepo.primary_language || existingRepo.primary_language.length === 0;
    const needsRepoId = !repo.repo_id;

    console.log(`Repo ${repo.full_name}: existing=${!!existingRepo}, hasActivityStats=${hasActivityStats}, needsActivity=${needsRepoActivity}, needsLanguage=${needsLanguage}, needsRepoId=${needsRepoId}`);

    if (needsLanguage || needsRepoId || needsRepoActivity) {
      console.log(`Fetching data for ${repo.full_name}...`);
      try {
        [repoStarData, repoLanguage, repoActivity] = await Promise.all([
          fetchRepoOfIssue(userName, repoName),
          fetchLangOfRepo(userName, repoName),
          fetchRepoActivity(userName, repoName),
        ]);
        console.log(`Fetched data for ${repo.full_name}: activity=${!!repoActivity}`);
      } catch (err) {
        console.error(`Failed to enrich repo ${repo.full_name}:`, err.message);
      }
    }

    if (repoStarData) {
      repo.repo_id = repoStarData.repo_id || repo.repo_id;
      repo.stars = repoStarData.stars ?? repo.stars;
      repo.full_name = repoStarData.full_name || repo.full_name;
      repo.last_activity_at = repoStarData.updated_at || repo.last_activity_at;

      if (!repo.primary_language || repo.primary_language.length === 0) {
        if (Array.isArray(repoLanguage) && repoLanguage.length > 0) {
          repo.primary_language = repoLanguage;
        } else if (repoStarData.primary_language) {
          repo.primary_language = [{ name: repoStarData.primary_language, percent: 100 }];
        }
      }
    }

    if (repoLanguage && Array.isArray(repoLanguage) && repoLanguage.length > 0) {
      repo.primary_language = repoLanguage;
    }

    if (repoActivity) {
      repo.activity_stats = repoActivity; // Save the raw stats here
      console.log(`  Saved activity_stats for ${repo.full_name}: totalCommits=${repoActivity.totalCommits}`);
    } else {
      console.log(`  WARNING: No activity_stats for ${repo.full_name} (repoActivity=${repoActivity})`);
    }

    if (!repo.repo_id && existingRepo) {
      repo.repo_id = existingRepo.repo_id;
    }

    if (!issue.repo_id && repo.repo_id) {
      issue.repo_id = repo.repo_id;
    }

    if (!repo.repo_id) {
      console.error(`Skipping ingestion for ${repo.full_name}: missing repo_id after enrichment`);
      continue;
    }

    if (!issue.repo_id) {
      console.error(`Skipping issue ${issue.issue_id}: missing repo_id`);
      continue;
    }

    if (existingRepo) {
      repo.primary_language = repo.primary_language || existingRepo.primary_language;
      repo.stars = repo.stars || existingRepo.stars;
      repo.activity_stats = repo.activity_stats || existingRepo.activity_stats;
    }

    // 3. Upsert Repo
    await repoModel.updateOne(
      { repo_id: repo.repo_id }, // numeric ID
      { $set: repo },
      { upsert: true }
    );

    // 4. Upsert Issue
    await issueModel.updateOne(
      { issue_id: issue.issue_id }, // numeric ID
      { $set: issue },
      { upsert: true }
    );

    count++;
  }
  console.log(`Ingestion completed to DB ${count} times`);
}

module.exports = { ingestIssue };
