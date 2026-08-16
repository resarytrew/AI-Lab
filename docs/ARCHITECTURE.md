# AI Lab architecture

## Goal

AI Lab is not a collection of static pages. It is an interactive learning system where a learner progressively constructs a language model. The architecture separates **course content**, **interactive labs**, **code execution**, **assessment**, and **learner state**.

## Current boundary

The Foundations vertical slice now uses a shared course shell and a typed course registry:

```text
localized route
  └─ typed lesson id
      └─ CourseShell
          ├─ course navigation + progress
          ├─ interactive lesson lab
          ├─ by-hand derivation
          ├─ assessment
          ├─ reusable code panel
          └─ MyAI milestones
```

The first learning path is deliberately continuous:

```text
What is a Model
  → Variables & Functions
    → First Neuron
      → Loss
        → Gradient Descent
          → Backpropagation
```

## Frontend

- Next.js App Router with locale as the first route segment.
- React client components only where interaction requires state.
- Server Components remain the default for route composition and future data loading.
- `next-intl` owns locale routing and messages.
- Russian is the default locale; English is a first-class locale.
- CSS design tokens define the Editorial visual language; the project does not depend on a UI kit for its product identity.
- GitHub Pages receives a static export from `main`; the application architecture remains compatible with a future server-backed deployment.

## Learning-domain model

Course sequencing is defined in `src/content/course.ts`. Routes and navigation consume that registry rather than duplicating lesson order in components.

A lesson definition owns stable domain metadata such as:

```ts
type Lesson = {
  id: string;
  slug: string;
  prerequisites: string[];
  implemented: boolean;
};
```

As the curriculum grows, the registry will expand with concepts, stages, assessments, code tests and MyAI milestones. Interactive labs remain typed components rather than serialized arbitrary UI.

## Shared shell

`CourseShell` is responsible for concerns that must stay consistent across all lessons:

- locale switching;
- global navigation;
- course progress;
- module/lesson navigation;
- locked/implemented lesson states;
- MyAI milestone progression.

Individual lesson components own only their pedagogy and interactive state.

## Code execution

The current screens demonstrate the code workflow without executing arbitrary Python. The target architecture is a lazy-loaded sandbox boundary:

1. browser-safe Python runtime for introductory exercises;
2. worker isolation and execution timeouts;
3. deterministic test cases supplied by lesson definitions;
4. remote compute only for training workloads that cannot reasonably run on-device.

No arbitrary user code should execute in the Next.js server process.

## Persistence

Progress is currently derived from the active lesson. A persistence adapter will later own:

- learner identity;
- lesson attempts and checkpoints;
- code submissions;
- MyAI milestones;
- teacher-facing progress analytics.

The domain layer must not depend directly on a specific database vendor.

## Quality gates

Every pull request must pass:

- TypeScript strict typecheck;
- unit tests;
- Biome lint;
- production Next.js build.

GitHub Pages additionally validates the static-export deployment target.

## Near-term roadmap

1. Complete Foundations: model → variables/functions → neuron → loss → gradient → backprop.
2. Add real stage progression: Predict → Explore → By Hand → Code → Experiment.
3. Add sandboxed Python execution and deterministic code tests.
4. Add learner persistence and authentication.
5. Continue through tokenization, bigram LM, embeddings, attention and TinyGPT.
