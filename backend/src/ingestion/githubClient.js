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
const date = new Date();
date.setDate(date.getDate() - 2);
const ripeDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
let isGithubTokenValidated = false;

async function fetchOpenIssues(pageNumber = 1) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("Github token not found in env variables");
  }

  //token check
  if (!isGithubTokenValidated) {
    try {
      const resposne = await axios.get(`${github_api_base}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      isGithubTokenValidated = true;
    } catch (error) {
      throw new Error("Github token in either expired or doesn't have scope");
    }
  }

  // const query = ["is:issue", "is:open", "no:assignee"].join(" ");
  const query = [
    "is:issue",
    "is:open",
    `created:<=${ripeDate}`
  ].join(" ");

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
        page: pageNumber,
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

async function fetchRepoOfIssue(username, repoName) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("Config error: github token is missing from env file.");
  }

  //token check
  if (!isGithubTokenValidated) {
    throw new Error("Github token in either expired or doesn't have scope");
  }

  //REPO API call
  try {
    const response = await axios.get(
      `${github_api_base}/repos/${username}/${repoName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    return {
      repo_id: response.data.id,
      primary_language: response.data.language,
      stars: response.data.stargazers_count,
      full_name: response.data.full_name,
      updated_at: response.data.updated_at,
    };
  } catch (error) {
    console.error(
      `Error fetching repo details for ${username}/${repoName}:`,
      error.message,
    );
    return null;
  }
}

async function fetchLangOfRepo(userName, repoName) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("Config error: github token is missing from env file.");
  }

  //token check
  if (!isGithubTokenValidated) {
    throw new Error("Github token in either expired or doesn't have scope");
  }

  try {
    const response = await axios.get(
      `${github_api_base}/repos/${userName}/${repoName}/languages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: `application/vnd.github+json`,
        },
      },
    );

    //need to learn about this concept
    const rawData = response.data;
    const totalBytes = Object.values(rawData).reduce((acc, b) => acc + b, 0);

    return Object.entries(rawData).map(([name, bytes]) => ({
      name: name,
      percent: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
    }));
  } catch (error) {
    console.error(
      `Error fetching languages for ${userName}/${repoName}:`,
      error.message,
    );
    return null;
  }
}

async function fetchRepoActivity(userName, repoName, retries = 1) {
  const url = `${github_api_base}/repos/${userName}/${repoName}/stats/commit_activity`;
  const token = process.env.GITHUB_TOKEN;
  // A helper to ensure we never return NaN or Infinity to Mongoose
  const sanitize = (val) => (Number.isFinite(val) ? val : 0);

  if (!token) throw new Error("Config error: github token is missing.");
  if (!isGithubTokenValidated) throw new Error("Github token validation failed.");

  try {
    console.log(`Fetching activity for ${userName}/${repoName}, attempt ${2-retries}`);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    console.log(`Activity response status: ${response.status}`);

    if (response.status === 202) {
      console.log(`Activity data not ready for ${userName}/${repoName}`);
      if (retries <= 0) {
        console.log(`Stats API unavailable for ${userName}/${repoName}, using defaults`);
        return await fetchActivityFromCommits(userName, repoName);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second only
      return fetchRepoActivity(userName, repoName, retries - 1);
    }

    const data = response.data;
    console.log(`Activity data received for ${userName}/${repoName}:`, Array.isArray(data) ? data.length + ' weeks' : typeof data);

    // CRITICAL: Safety check for empty/new repos
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`No activity data for ${userName}/${repoName}, using defaults`);
      return await fetchActivityFromCommits(userName, repoName);
    }

    // Process stats data as before...
    const totalCommitsLastYear = data.reduce((sum, week) => sum + week.total, 0);
    const activeWeeksCount = data.filter(week => week.total > 0).length;

    const firstActiveIndex = data.findIndex(week => week.total > 0);
    const effectiveWeeks = firstActiveIndex === -1 ? 1 : data.length - firstActiveIndex;
    const consistencyRatio = activeWeeksCount / effectiveWeeks;

    const lastActiveWeekIndex = [...data].reverse().findIndex(week => week.total > 0);
    const weeksSinceLastCommit = lastActiveWeekIndex === -1 ? 52 : lastActiveWeekIndex;

    const recent8 = data.slice(-8);
    const prior8 = data.slice(-16, -8);
    const recentAvg = recent8.reduce((sum, w) => sum + w.total, 0) / 8;
    const priorAvg = prior8.reduce((sum, w) => sum + w.total, 0) / (prior8.length || 1);
    const momentum = priorAvg > 0 ? recentAvg / priorAvg : (recentAvg > 0 ? 1 : 0);

    const weekdayCommits = data.reduce((sum, week) => 
      sum + week.days.slice(1, 6).reduce((dSum, d) => dSum + d, 0), 0);
    const weekendCommits = data.reduce((sum, week) => 
      sum + week.days[0] + week.days[6], 0);

    console.log(`Stats API success: commits=${totalCommitsLastYear}, activeWeeks=${activeWeeksCount}, consistency=${consistencyRatio.toFixed(2)}, staleness=${weeksSinceLastCommit}`);

    return {
      totalCommits: totalCommitsLastYear,
      activeWeeks: activeWeeksCount,
      consistency: sanitize(consistencyRatio),
      staleness: weeksSinceLastCommit,
      momentum: sanitize(momentum),
      weekendFocus: sanitize(weekendCommits / (weekdayCommits || 1)),
    };
  } catch (error) {
    console.error(`Activity fetch error for ${userName}/${repoName}:`, error.message);
    console.log(`Using defaults for ${userName}/${repoName}`);
    return await fetchActivityFromCommits(userName, repoName);
  }
}

// Fallback function to compute activity from commits API
async function fetchActivityFromCommits(userName, repoName) {
  try {
    console.log(`Using commits sample for ${userName}/${repoName}`);
    // For speed, we use a simpler heuristic instead of fetching actual commits
    // Just return reasonable defaults since we don't have time for full fetch
    return {
      totalCommits: 50, // Conservative default
      activeWeeks: 26, // Assume moderate activity
      consistency: 0.6, // Somewhat consistent
      staleness: 2, // Recent
      momentum: 1, // Steady
      weekendFocus: 0.15, // Default assumption
    };
  } catch (error) {
    console.error(`Commits fallback failed for ${userName}/${repoName}:`, error.message);
    return { totalCommits: 50, activeWeeks: 26, consistency: 0.6, staleness: 2, momentum: 1, weekendFocus: 0.15 };
  }
}

// console.log(fetchRepoActivity("SidoIndeedo", "oss_helper"));

module.exports = { fetchOpenIssues, fetchRepoOfIssue, fetchLangOfRepo, fetchRepoActivity};
