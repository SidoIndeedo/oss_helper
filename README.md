# Open Source Issue Recommender

## Project Information

| Field | Details |
|---|---|
| Project Title | Open Source Issue Recommender |
| Type | Copyright |
| Student 1 | 2210992378 - Sidharth |
| Student 2 | 2210992369 - Shubham Sharma |
| Student 3 | 2210992367 - Shubham Mittal |
| Current Status | 80% Done |

---

# Overview

The **Open Source Issue Recommender** is a backend-based recommendation system designed to help students and early-career developers find approachable and meaningful open-source issues on GitHub.

The system analyzes GitHub repositories and issues, then recommends issues that are:

- Beginner friendly
- Relevant to the user’s skills
- Low in contributor competition
- Actively maintainable
- Transparent in recommendation reasoning

The goal is to reduce the frustration beginners face while searching for suitable open-source contributions.

---

# Problem Statement

Students and early-career developers often struggle to contribute to open source.

Although GitHub provides “good first issue” labels, many of these issues are overcrowded, poorly scoped, or already being actively worked on.

Finding a genuinely approachable issue that matches a contributor’s skills often requires scanning dozens of repositories, which wastes time and discourages participation.

---

# Target Users

This project is designed for:

- Students
- Junior developers
- Beginner open-source contributors

Especially users who are comfortable with one or two tech stacks but lack confidence or experience in contributing to open-source projects.

---

# Objectives

The system aims to:

- Recommend beginner-appropriate GitHub issues
- Reduce competition overload on issues
- Match issues with the user’s tech stack
- Explain why each issue was recommended
- Encourage open-source participation

---

# Expected Success Criteria

A successful recommendation should provide issues that are:

- Low in crowd competition
- Relevant to the user’s tech stack
- Realistically approachable
- Transparent in ranking explanation

Each recommendation includes the primary signals and reasoning used in scoring.

---

# System Definition

The project is a backend recommendation service that:

- Collects and analyzes GitHub issues
- Processes issue descriptions and discussions
- Evaluates repository activity
- Uses AI-assisted scoring and filtering
- Recommends suitable beginner issues

The recommendation engine evaluates:

- Skill alignment
- Repository activity
- Engagement signals
- AI-estimated issue difficulty
- Contributor competition

---

# Why AI is Needed

AI is used to analyze factors that cannot be reliably handled using traditional rule-based filtering.

The AI system helps estimate:

- Issue clarity
- Difficulty level
- Signals of active work
- Overcrowding probability
- Beginner friendliness

This enables smarter and more context-aware recommendations.

---

# Fallback Mechanism

If AI services are unavailable, the system falls back to a signal-based scoring model.

## Signal-Based Scoring Factors

### 1. Issue Freshness
- Prefers issues created within the last **7–30 days**

### 2. Comment Count
- Issues with **0–5 comments** receive a higher score
- High comment counts reduce ranking due to possible overcrowding

### 3. Repository Activity
- Inactive repositories (**30–60+ days without activity**) are penalized

### 4. Labels
- Issues labeled:
  - `beginner`
  - `good first issue`
  
  receive a moderate ranking boost

### 5. Tech Stack Match
- Issues matching the user’s tech stack receive higher priority
- If no tech stack is provided, documentation-related issues are prioritized

### 6. Issue Complexity Proxy
The following may reduce ranking:
- Extremely long issue descriptions
- Heavy cross-referencing
- Multiple linked pull requests

These act as proxies for issue complexity.

---

# Transparency

The system explains the major signals that influenced each recommendation.

This allows users to:

- Understand why an issue was selected
- Compare trade-offs
- Make informed contribution decisions

Transparency improves trust and usability for beginner contributors.

---

# Core Features

- GitHub issue analysis
- AI-assisted issue recommendation
- Beginner-friendly filtering
- Tech stack matching
- Low competition detection
- Repository activity evaluation
- Transparent recommendation explanations
- Signal-based fallback scoring

---

# Technologies Used

Possible technologies involved in the project include:

- Python / Node.js
- GitHub API
- AI/LLM APIs
- Backend recommendation engine
- NLP-based issue analysis
- REST APIs

---

# Future Improvements

Potential future enhancements:

- Personalized contributor profiles
- Repository quality scoring
- Contributor learning roadmap
- Open-source mentor matching
- Browser extension integration
- Real-time issue tracking

---

# Current Progress

Project completion status: **80%**

Currently implemented/planned modules include:

- GitHub issue collection
- Signal-based filtering
- AI-assisted recommendation logic
- Tech stack matching
- Ranking transparency system

---

# Conclusion

The Open Source Issue Recommender aims to simplify the onboarding experience for new contributors by intelligently recommending approachable GitHub issues.

By combining AI-assisted analysis with transparent scoring signals, the system reduces search effort, lowers entry barriers, and encourages more participation in open-source communities.