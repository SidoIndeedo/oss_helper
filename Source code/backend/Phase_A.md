## Problem

Students and early-career developers struggle to contribute to open source because “good first issues” on GitHub are overcrowded, poorly scoped, or already being worked on.
Finding a genuinely approachable issue that matches their skills requires scanning many repositories and guessing, which wastes time and kills motivation.

## Target user

A student or junior developer who understands one or two tech stacks but lacks confidence and experience in open source contribution.

## What success will look like

The user can enter their skill set and receive a small number of GitHub issues that are low-crowd, relevant, and realistically approachable, with a clear reason for why each issue was suggested.

## System defintion

A backend service that analyzes GitHub issues across repositories, read whole issue description and whole discussion thread and recommends low-crowd, beginner-appropriate issues to students and junior developers based on their skills, activity signals, and AI-assessed approachability.

## Why AI is needed

AI is used to assess issue clarity, estimate difficulty from descriptions and comments, and detect signals of active work or overcrowding that cannot be reliably captured with simple rules or labels.

## Fallback

If AI service fails, the system will fallback to scoring based model using the following signals:

- Issue Freshness -> meaning how relatively new the issue is. Preferring issues created in last 7-30 days

- Comment Count -> 0 comment means no points up and 10 comments means the score is reduced and 1 to 5 comments for more points

- Recent activity of repo -> is repo not active for more than 30-60 days, then some points will be done else add points

- Labels -> slightly boosts the score if label is named as "beginner" or "good first issue" or many like it

- Tech stack -> we will add more points if the repo in question is of the same tech stack or atleast somewhat similar tech stack as the user preferred. If user does not know any tech stack, then we will stick to issues like documentations only, maybe 1-2 more issue labels but I can't recall any.

- Issue size -> If the issue is very long, we may deduct some points as it suggests that issue might be hard but we will exlude code part in this filter as errors thrown by code are always messy. If there are many linked files or pr's then the issue is heavily downgraded

## The system highlights the main signals influencing an issue’s ranking so users can understand the trade-offs and make an informed decision.
