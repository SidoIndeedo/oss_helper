## 1. Core Data Model

**Issue**
Represents a github issue the system knows about. Conceptually it contains:

- Issue id (github id)
- Title
- Description/body
- Comments
- Labels
- Repo Id
- Created at/Updated at

Difficulty is derived, not stored

**Repositry**
Represents a github repo. Will contain:

- Repo id
- Name
- Primary Language
- Last Activity
- Stars

This exists so you don’t repeat repo info on every issue.

**DerivedSignals**

Computed signals used to estimate how approachable an issue is such as:

- Freshness score
- Comment density score
- Activity score
- Label signal
- Stack match score
- AI confidence

These are **computed**, not user input

**User preference**

This will be light weight. No auth yet. Will contain:

- Preferred language
- Secondary language
- Experience level

## Scoring Pipeline

- Issue enters system (from GitHub)
- Raw metadata is extracted
- Heuristic signals are computed
- AI (if available) analyzes text
- Heuristic and AI signals are combined into a final score.
- Final score is produced
- Issue is ranked

**Why heuristics come first**

- Are fast to compute
- Are explainable
- Are always available
- AI is slow, can fail and cost money

- Heuristics define and AI refines, never replaces.

**Example (no math yet, just logic)**

Issue A: low comments, active repo, matching language
Issue B: “good first issue” label but 25 comments

Even before AI:
A scores higher than B

AI then:
confirms A is clear
downgrades B due to complexity in discussion

This feels intuitive because it is.

## AI Integration

AI is a consultant, not the brain
We won't waste AI on obviously bad candidates

Heuristics answer questions like:

- Is this issue already crowded?
- Is the repo dead?
- Does this issue even match the user’s tech stack?

If an issue fails badly here, asking AI about it is pointless.

**Example:**

- Issue has 40 comments
- Repo inactive for 1 year
- Language doesn’t match user

**We won't really want to:**

- send its entire discussion to AI
- pay for tokens
- wait for response
- just for AI to say “yeah, this looks messy” ?

No. That’s wasted work.

If an issue passes heuristics threshold, meaning that issue is not obviously terrible
or
If an issue is not obviously unsuitable based on heuristics:

- then we can use ai

**If issue's text length < minimum**

- Then AI cannot analyze meaning if there is nothing to analyze

**Example**

- Issue body: "bug in login" with 0 comments
- Calling AI here is like calling your dad after he went to buy some milk, worthless

## Failure Paths

**What if github API fails?**

- Serve cached data
- Return fewer results
- Show that data maybe stale

**What if AI API fails?**

- Use heuristics only
- Lower confidence indicator

**What if scoring is uncertain?**

- Still rank issues
- Explain uncertainty
- Let user decide

The system will never crash, it will degrade respectly
