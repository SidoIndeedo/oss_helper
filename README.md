## Problem

Students and early-career developers often struggle to contribute to open source.

Although GitHub provides “good first issue” labels, many of these issues are overcrowded, poorly scoped, or already being actively worked on.

Finding a genuinely approachable issue that matches a contributor’s skills often requires scanning dozens of repositories, which wastes time and discourages participation.

## Target user

Students and junior developers who are comfortable with one or two tech stacks but lack confidence or experience in contributing to open source projects.

## What success will look like

A user can enter their skill set and receive a small, curated set of GitHub issues that are:

- Low in crowd competition
- Relevant to their tech stack
- Realistically approachable
- Transparent in why they were recommended

Each issue includes an explanation of the signals that influenced its ranking.

## System defintion

A backend service that analyzes GitHub issues across repositories, processes issue descriptions and discussion threads, and recommends low-crowd, beginner-appropriate issues.

The system evaluates issues based on skill alignment, repository activity, engagement signals, and AI-assisted difficulty estimation.

## Why AI is needed

AI helps assess:

- Issue clarity
- Estimated difficulty from descriptions and comments
- Signals of active work or overcrowding

These factors cannot be reliably captured using simple rule-based filtering alone.

## Fallback

If AI services fail, the system falls back to a signal-based scoring model using:

Issue Freshness

- Prefers issues created within the last 7–30 days.

Comment Count

- 0–5 comments increase score.
- High comment counts reduce score due to potential overcrowding.

Repository Activity

- Inactive repositories (30–60+ days without activity) are penalized.

Labels

- Issues labeled “beginner” or “good first issue” receive a moderate boost.

Tech Stack Match

- Issues in repositories matching the user’s tech stack receive higher weight.
- If no tech stack is provided, documentation-related issues are prioritized.

Issue Complexity Proxy

- Extremely long issues, heavy cross-referencing, or multiple linked PRs may reduce score as a proxy for difficulty.

## Transparency

The system highlights the primary signals influencing each issue’s ranking so users can understand trade-offs and make informed decisions.
