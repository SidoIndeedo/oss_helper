const { fetchOpenIssues } = require("./githubClient");
const { normaliseIssue } = require("./issueNormalizer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function run() {
  const issues = await fetchOpenIssues();
  const ingestedIssuse = issues.map(normaliseIssue);
  console.log(ingestedIssuse);
  // console.log("Sample issue:");
  // console.log({
  //   title: issues[0].title,
  //   comments: issues[0].comments,
  //   repo: issues[0].repository_url,
  //   updated_at: issues[0].updated_at,
  // });
}

run();
