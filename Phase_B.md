## System Boundary

- The system periodically fetches a limited, recent subset of public GitHub issues from selected repositories and stores the processed results to support efficient recommendation for multiple users.

## HLD

1. API Layer

- Handles incoming requests from users, accepts user preferences (tech stack, experience level), and returns recommended GitHub issues.

2. Issue and Thread Ingestion Service

- Fetches a limited, recent set of public GitHub issues and their thread from repositories using the GitHub API. Responsible for updating issue data periodically.

3. Scoring Engine

- Applies heuristic-based scoring to issues using signals like freshness, comment count, repository activity, labels, and tech stack match.

4. AI Assessment Service

- AI service will be used first
- Analyzes issue descriptions and discussion threads to estimate clarity, difficulty, and likelihood that the issue is approachable for beginners.

5. Data Store

- Stores fetched issue metadata, derived scores, and lightweight user preference data to avoid repeated processing and API calls.

## Data Flow

1. The system periodically fetches recent GitHub issues from public repositories.
1. Fetched issue data is stored along with basic metadata such as timestamps, labels, and repository information.
1. The scoring engine computes heuristic scores for each issue based on predefined signals.
1. The AI assessment will run first. This service analyzes issue text and comments to produce an approachability confidence score.
1. Heuristic and AI scores are combined into a final ranking.
1. A user submits their preferences (tech stack, experience level).
1. The system returns a ranked list of recommended issues along with explanations for why each issue was suggested.

## External Dependencies

- GitHub REST API for fetching repository and issue data
- AI/LLM API for text analysis of issue descriptions and comments
- Environment variables for managing API keys and secrets

## Constraints & Assumptions

- The system operates on a limited subset of public GitHub repositories and does not attempt to index all of GitHub.
- GitHub API rate limits must be respected, so data is fetched and refreshed periodically rather than in real time.
- The system assumes low to moderate traffic and is not designed for large-scale production usage.
- Recommendations are advisory and probabilistic, not guarantees of issue difficulty or success.
- AI-based analysis may be unavailable or rate-limited, in which case heuristic scoring is used.
