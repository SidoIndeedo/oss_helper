// reshapes raw GitHub data
//Converts ONE GitHub issue → { issue, repo }
//Pure function
//No side effects
//Calls githubClient
//Filters out PRs
//Calls normalizer
//Returns normalized data

const path = require("path");

function normaliseIssue(githubIssue) {
  // console.log("NORMALIZER CALLED");

  //using built in url class, will do heavy lifting automatically
  // console.log(githubIssue.html_url);
  const issueUrl = new URL(githubIssue.html_url);
  const pathParts = issueUrl.pathname.split("/").filter(Boolean);
  // pathParts example: ["dotnet(username)", "runtime(repo)", "issues", "122493(issue id)"]

  const owner = pathParts[0];
  const repoName = pathParts[1];
  const repoId = `${owner}/${repoName}`;

  const issue = {
    issue_id: githubIssue.id,
    number: githubIssue.number,
    title: githubIssue.title,
    body: githubIssue.body || "",
    labels: githubIssue.labels.map((e) => e.name),
    comment_count: githubIssue.comments,
    created_at: githubIssue.created_at,
    updated_at: githubIssue.updated_at,
    repo_id: repoId,
  };

  const repo = {
    repo_id: repoId,
    name: repoName,
    full_name: `${owner}/${repoName}`,
    primary_language: null, // not available in search response
    stars: null, // not available in search response
    last_activity_at: githubIssue.updated_at,
    url: `https://github.com/${owner}/${repoName}`,
  };

  //for stars and primary_language, we need to call another api GET /repos/{owner}/{repo} but this is seperate ingestion part, so for v1 we will
  //stick to this code only
  //Also it has rate limits

  return { issue, repo };
}

module.exports = { normaliseIssue };
