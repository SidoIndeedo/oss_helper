// orchestrates fetching
const { fetchOpenIssues } = require("./githubClient");
const { normaliseIssue } = require("./issueNormalizer");

async function ingestIssuse() {
  const rawIssues = await fetchOpenIssues();

  //filter out issues with pr because they are most probably solved
  const issuesWithNoPr = rawIssues.filter((e) => !e.pull_request);

  //now normalise these issues
  const normalisedIssuesPairedWithRepo = issuesWithNoPr.map(normaliseIssue);

  //seperate issues and their repo so we avoid dublication with same repo and multiple issues in it in db
  const issues = [];
  const repoMap = new Map();

  for (const pair of normalisedIssuesPairedWithRepo) {
    //push that issue
    issues.push(pair.issue);

    //if the repo with respective issue is not in the map, then we add it in
    if (!repoMap.has(pair.repo.repo_id)) {
      repoMap.set(pair.repo.repo_id, pair.repo);
    }
  }

  const repositories = Array.from(repoMap.values());

  console.log(`Final issues count: ${issues.length}`);
  console.log(`Unique repositories count: ${repositories.length}`);

  return {
    issues,
    repositories,
  };
}

module.exports = { ingestIssuse };
