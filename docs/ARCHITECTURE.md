# AI Lab architecture

## Goal

AI Lab is not a collection of static pages. It is an interactive learning system where a learner progressively constructs a language model. The architecture therefore separates **content**, **interactive labs**, **code execution**, **assessment**, and **learner state**.

## Current boundary

The first vertical slice deliberately keeps infrastructure small while preserving the seams needed for scale:

```text
localized route
  └─ lesson shell
      ├─ course navigation
      ├─ interactive lab
      ├─ by-hand derivation
      ├─ assessment
      ├─ code panel
      └─ MyAI milestone
```

## Frontend

- Next.js App Router with locale as the first route segment.
- React client components only where interaction requires state.
- Server Components remain the default for future content and data loading.
- `next-intl` owns locale routing and messages.
- Russian is the default locale; English is a first-class locale, not a machine-translated afterthought.
- CSS design tokens define the Editorial visual language; no UI framework is allowed to become the product architecture.

## Learning-domain model

Future lessons should be represented as data rather than duplicated page implementations:

```ts
type Lesson = {
  id: string;
  moduleId: string;
  prerequisites: string[];
  stages: ('predict' | 'explore' | 'by-hand' | 'code' | 'experiment')[];
  concepts: string[];
  milestone?: string;
};
```

Interactive labs remain typed components referenced by lesson definitions.

## Code execution

The current first-neuron screen demonstrates the code workflow without shipping a Python VM into the initial bundle. The target architecture is a lazy-loaded sandbox boundary:

1. browser-safe Python runtime for introductory exercises;
2. worker isolation and execution timeouts;
3. deterministic test cases supplied by the lesson definition;
4. remote compute only for training workloads that cannot reasonably run on-device.

No arbitrary user code should execute in the Next.js server process.

## Persistence

The UI currently derives progress locally from the vertical slice. A persistence adapter will later own:

- learner identity;
- lesson attempts and checkpoints;
- code submissions;
- MyAI milestones;
- teacher-facing progress analytics.

The domain layer must not depend directly on a specific database vendor.

## Quality gates

Every pull request should pass:

- TypeScript strict typecheck;
- unit tests;
- Biome lint/format rules;
- production Next.js build.

The first GitHub Actions workflow establishes those gates immediately.

## Near-term roadmap

1. Stabilize the course shell and Editorial design system.
2. Extract lesson metadata and progress into a typed content registry.
3. Build lessons: model → variables/functions → neuron → loss → gradient → backprop.
4. Add sandboxed Python execution.
5. Add learner persistence and authentication.
6. Continue the vertical curriculum through tokenization, bigram LM, embeddings, attention and TinyGPT.
