// talks to GitHub API
//Fetched raw github issues. zero filtering. zero shaping.
//what endpoint will i call?
// API GET /search/issues
//search for open recent issues

//what params will i pass?
// q → the search query string, sort=updated, order=desc(latest activity first), per_page=to controler payload size
//auth token in headers, not params

//what will the function return?
// An array of raw GitHub issue objects, untouched

const axios = require("axios");

const github_api_base = "https://api.github.com";

async function fetchOpenIssues() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("Github token not found in env variables");
  }

  const query = ["is:issue", "is:open", "updated:>=2026-01-01"].join(" ");

  try {
    const response = await axios.get(`${github_api_base}/search/issues`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },

      params: {
        q: query,
        sort: "updated",
        order: "desc",
        per_page: 10,
      },
    });

    const issues = response.data.items;
    console.log(`Fetched ${issues.length} issues from github`);

    return issues;
  } catch (error) {
    console.error("Error fetching GitHub issues:");
    console.error(error.response?.data || error.message);
    throw error;
  }
}

module.exports = { fetchOpenIssues };
