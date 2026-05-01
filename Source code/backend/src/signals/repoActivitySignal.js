/**
 * Calculates a repository activity score between 0 and 1.
 * @param {Object} repo - The activity object returned by fetchRepoActivity
 * @returns {number} - A normalized score (0 to 1)
 */
function computeAndReturnRepoActivityScore(repo) {
  if (!repo || repo.totalCommits === 0) return 0;

  // 1. Consistency Score (0 to 1)
  // Already normalized as a ratio (activeWeeks / effectiveWeeks)
  const consistencyScore = repo.consistency;

  // 2. Recency Score (0 to 1)
  // We use 1 - (weeks / 52). 0 weeks ago = 1.0, 52 weeks ago = 0.0
  const recencyScore = Math.max(0, 1 - (repo.staleness / 52));

  // 3. Volume Score (0 to 1)
  // We normalize this. Let's say 100 commits/year is a "perfect" volume score.
  const volumeScore = Math.min(1, repo.totalCommits / 100);

  // 4. Momentum Multiplier
  // Momentum > 1 is good, < 1 is slowing down. 
  // We cap its influence so it doesn't break the 0-1 scale too much.
  const momentumFactor = Math.min(1.2, Math.max(0.5, repo.momentum));

  // 5. Calculate Weighted Average
  const rawScore = (
    (consistencyScore * 0.40) + 
    (recencyScore * 0.30) + 
    (volumeScore * 0.20)
  );

  // Apply Momentum and Bonus for Activity
  let finalScore = rawScore * momentumFactor;

  // 6. Optional: Weekend Focus Adjustment
  // If you prefer "Professional" looking repos, you could slightly penalize 
  // extremely high weekendFocus, but for now, we'll keep it neutral.

  // Final Clamp: Ensure result is between 0 and 1
  return parseFloat(Math.min(1, Math.max(0, finalScore)).toFixed(2));
}

module.exports = { computeAndReturnRepoActivityScore };