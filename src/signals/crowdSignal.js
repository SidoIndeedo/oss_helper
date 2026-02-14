function computeAndReturnCrowdScore(issue) {
  const comments = issue.comment_count;

  if (comments === 0) return 1;
  if (comments <= 3) return 0.8;
  if (comments <= 10) return 0.6;
  if (comments <= 25) return 0.4;

  return 0.2;
}

module.exports = { computeAndReturnCrowdScore };
