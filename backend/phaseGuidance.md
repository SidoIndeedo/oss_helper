## Phase A — Problem & intent (you just did this)

**Purpose: Why does this exist?**

Contains:

- Problem / complaint

- Target user

- What success looks like

- System definition

- Why AI is needed

- Fallback & trust thinking

**Output:**

PHASE_A.md

Clarity + confidence

Zero code

If Phase A is weak, everything downstream is chaos. Yours is strong.

## Phase B — System boundaries & data flow

**Purpose: What exactly am I building (and not building)?**

Contains:

- System boundaries (what’s inside vs outside)

- High-level components (API, ingestion, scoring, AI)

- Data flow (GitHub → backend → user)

- External dependencies (GitHub API, AI API)

- Constraints (rate limits, latency, scale assumptions)

**Output:**

PHASE_B.md

Boxes and arrows (conceptual, not diagrams yet)

Key question answered:

“If someone asked you to build this with a team, could you explain the system in 10 minutes?”

## Phase C — Architecture & core design

**Purpose: How will this work internally?**

Contains:

- Backend architecture (services/modules)

- Data models (Issue, Repo, UserPreference, Score)

- Scoring pipeline (heuristics first, AI layered on top)

- Failure handling paths

- API contracts (rough shape, not OpenAPI yet)

**Output:**

PHASE_C.md

You can now start coding without thrashing

Key signal:

“This person thinks before typing.”

## Phase D — Implementation & execution

**Purpose: Can I actually build this cleanly?**

Contains:

- Repo structure (src/, modules)

- Core flows implemented

- Heuristic scoring working end-to-end

- AI integration added carefully

- Logging, error handling, config

**Output:**

Working backend

Commits with intent

This is where interviews care most

## Phase E — Proof, reflection & polish

**Purpose: Can I explain and defend this like an engineer?**-

Contains:

- README (problem → design → tradeoffs)

- Example API usage

- Architecture diagram (simple)

- “What I’d improve next” section

- Limitations acknowledged

**Output:**

Portfolio-ready project

Strong interview talking points

One critical thing to remember

You do not rush phases.

Phase A prevents bad ideas

Phase B prevents scope creep

Phase C prevents rewrites

Phase D proves competence

Phase E turns work into signal

##

Most people jump straight to D.
That’s why their projects feel fragile.
