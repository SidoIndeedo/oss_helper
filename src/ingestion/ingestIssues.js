// orchestrates fetching
const { fetchOpenIssues } = require("./githubClient");
const { normaliseIssue } = require("./issueNormalizer");
const issueModel = require("../models/issue");
const repoModel = require("../models/repository");

async function ingestIssuse() {
  const rawIssues = await fetchOpenIssues();

  //filter out issues with pr because they are most probably solved
  const issuesWithNoPr = rawIssues.filter((e) => !e.pull_request);

  //now normalise these issues
  const normalisedIssuesPairedWithRepo = issuesWithNoPr.map(normaliseIssue);
  let count = 0;

  for (const pair of normalisedIssuesPairedWithRepo) {
    //push that issue

    const { issue, repo } = pair;

    //now we will upsert repo so no same repo with different issue gets new entry in db again
    await repoModel.updateOne(
      { repo_id: repo.repo_id },
      { $set: repo },
      { upsert: true },
    );

    //same for issue, we upsert, so no duplicate issue when re running the fetcher
    await issueModel.updateOne(
      { issue_id: issue.issue_id },
      { $set: issue },
      { upsert: true },
    );

    count++;
  }
  console.log(`Ingestion completed to DB ${count} times`);
}

module.exports = { ingestIssuse };
