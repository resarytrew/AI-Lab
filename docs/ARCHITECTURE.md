# AI Lab architecture

## Goal

AI Lab is an interactive learning world in which a school student gradually understands artificial intelligence and builds increasingly capable computational systems. The product must separate **pedagogy**, **quest content**, **interaction mechanics**, **learner state**, **code execution**, and **assessment** so that the course can grow for years without turning into a collection of bespoke pages.

## Product modes

AI Lab now has two intentionally different interface modes.

### 1. Technopark / navigation mode

The learner sees the world of the course: laboratories, unlocked areas, research journal, MyAI project, progress and future missions.

### 2. Immersive mission mode

A mission occupies the screen and focuses on one thinking operation at a time. The permanent LMS/dashboard chrome is intentionally absent. A mission may move through story, prediction, experiment, puzzle, explanation, by-hand work, code, break/fix, transfer and unlock scenes.

The legacy `CourseShell` remains temporarily available for the original Foundations vertical slice, but new curriculum work should target the quest architecture rather than expanding the dashboard shell.

## Pedagogical contract

A strong AI Lab mission follows this learning grammar where appropriate:

```text
Question
  → Hypothesis
    → Conflict
      → Discovery
        → Explain
          → Visualize
            → By Hand
              → Math
                → Code
                  → Break
                    → Fix
                      → Transfer
                        → Build MyAI
```

Not every mission needs every scene type, but explanations should normally come **after** the learner has made a prediction or encountered the problem that creates the need for the concept.

## Current quest vertical slice

The first production quest is:

```text
Technopark Entry: What makes a machine intelligent?
  01 Enter the Technopark
  02 Which systems feel intelligent?
  03 Speed is not intelligence
  04 Intelligence as a set of abilities
  05 Narrow vs general capability
  06 Rule systems and their limits
  07 Discovering a pattern from examples
  08 Meaning depends on context
  09 Planning toward a goal
  10 Transfer: fixed schedule vs learning from experience
  11 Research journal hypothesis
  12 Research clearance + MyAI M-01 activation
```

This quest deliberately does **not** introduce neural-network formulas or Python. It establishes the conceptual need for later laboratories.

## Frontend

- Next.js App Router with locale as the first route segment.
- Russian is the default locale; English remains a first-class locale.
- Server Components own route composition; Client Components are used for interactive missions and local learner state.
- Quest visuals are original AI Lab assets/styles and must not copy a third-party learning product's illustrations, layout or branding.
- GitHub Pages receives a static export from `main`; mission persistence therefore currently uses a browser adapter.
- The interaction layer must remain portable to a future authenticated backend.

## Quest domain

Quest state is versioned. A persisted mission snapshot should include only stable learner decisions and progress, not ephemeral presentation state.

```ts
type QuestProgress = {
  version: number;
  scene: number;
  completed: boolean;
  // mission-specific learner artifacts
};
```

Mission content and mission UI should evolve toward reusable primitives rather than a giant universal page template. The reusable unit is a **scene mechanic**, not a fixed lesson layout.

Planned scene mechanics include:

- StoryScene
- ChoiceScene
- SortScene
- ExperimentScene
- ObservationScene
- ExplainScene
- ByHandScene
- CodeChallengeScene
- BreakFixScene
- TransferScene
- JournalScene
- UnlockScene

## Learner artifacts

Completion must produce evidence of learning, not only a percentage. Important artifacts include:

- hypotheses written before explanations;
- experiment decisions and attempts;
- transfer-task outcomes;
- code submissions and tests;
- research-journal entries;
- MyAI capability unlocks;
- later: model checkpoints and evaluation reports.

## MyAI

MyAI is a capability graph, not a decorative progress bar. A capability should unlock only when the learner has built or demonstrated the corresponding mechanism.

The first quest activates `Project M-01` as a research project only. Trainable model capabilities are intentionally unavailable until the learner reaches the Learning Lab.

## Code execution

Introductory missions should not show code before code is pedagogically necessary. When programming becomes the right representation, code challenges will use a sandbox boundary:

1. browser-safe Python for small introductory exercises;
2. worker isolation and execution limits;
3. deterministic tests supplied by the mission;
4. remote compute only for workloads that cannot reasonably run on-device.

No arbitrary learner code should execute inside the Next.js server process.

## Persistence roadmap

The current static deployment stores quest progress in `localStorage` behind a versioned schema. A future persistence adapter will own:

- learner identity;
- quest snapshots and attempts;
- journal entries;
- assessment evidence;
- code submissions;
- MyAI capabilities and model checkpoints;
- teacher analytics.

The learning domain must not depend on a specific database vendor.

## Quality gates

Every pull request must pass:

- TypeScript strict typecheck;
- unit tests;
- Biome lint;
- production Next.js build.

GitHub Pages additionally validates the static-export target.

## Near-term roadmap

1. Stabilize the first Technopark quest and scene-engine conventions.
2. Build the Technopark map and learner research journal.
3. Build the Data Archive and Rule Lab missions.
4. Build the Learning Lab sequence: examples → parameters → error → improvement → first trainable model.
5. Introduce code only after the learner has a mechanism worth expressing in code.
6. Continue toward Neural Lab → Language Lab → Attention Lab → Transformer Core → MyGPT Workshop.
