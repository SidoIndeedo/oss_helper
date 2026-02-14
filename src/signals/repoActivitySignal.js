function computeAndReturnRepoActivityScore(repo) {
  const now = Date.now();
  const updatedAt = new Date(repo.last_activity_at);

  const diffDays = (now - updatedAt) / (1000 * 60 * 60 * 24);

  if (diffDays <= 3) return 1;
  if (diffDays <= 7) return 0.8;
  if (diffDays <= 14) return 0.6;
  if (diffDays <= 30) return 0.4;
  return 0.2;
}

module.exports = { computeAndReturnRepoActivityScore };
