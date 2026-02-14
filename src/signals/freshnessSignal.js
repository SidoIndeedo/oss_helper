// derive issue freshness and return score based on the newest issue

function computeAndReturnFreshnessScore(issue) {
  const dateNow = Date.now();
  const repoUpdatedAt = new Date(issue.updated_at);

  const diffDays = (dateNow - repoUpdatedAt) / (1000 * 60 * 60 * 24);

  // Freshness decay logic
  if (diffDays <= 7) return 1;
  if (diffDays <= 24) return 0.8;
  if (diffDays <= 38) return 0.6;
  if (diffDays <= 60) return 0.4;
  return 0.2;
}

module.exports = { computeAndReturnFreshnessScore };
