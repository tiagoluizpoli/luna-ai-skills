# AI Skills Ecosystem Overview

Welcome to the **Luna AI Skills Ecosystem**. This document serves as the central directory and governance guide for the 35+ specialized AI skills that power our autonomous engineering, design, and architecture workflows.

The ecosystem is built on the principle of **Specialized Collaboration**: no single agent knows everything, but a coordinated squad of specialists can build production-grade, high-fidelity systems with absolute precision.

---

## 1. The Speckit Workflow
*The engine of Spec-Driven Development (SDD). These skills manage the lifecycle of a feature from raw idea to validated implementation.*

| Skill | Purpose | Key Standards |
|:---|:---|:---|
| **[Specify](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-specify/SKILL.md)** | Transform ideas into specs | SDD methodology, user scenarios, measurable success criteria. |
| **[Clarify](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-clarify/SKILL.md)** | Resolve spec ambiguities | Structured questioning loop (max 5), taxonomy-based coverage scan. |
| **[Analyze](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-analyze/SKILL.md)** | Cross-artifact audit | Identification of gaps/duplications across Spec, Plan, and Tasks. |
| **[Plan](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-plan/SKILL.md)** | Architectural design | Tech stack selection, data modeling, testing strategy (Phase 0-2). |
| **[Tasks](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-tasks/SKILL.md)** | Breakdown implementation | Dependency-aware tasks, organized by user story, sequential/parallel marking. |
| **[Checklist](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-checklist/SKILL.md)** | Unit Tests for English | Validates requirement quality (Completeness, Clarity, Consistency). |
| **[Implement](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-implement/SKILL.md)** | Execute development | Phase-by-phase execution, UI Red Flag Protocol, TDD enforcement. |
| **[TaskToIssues](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-taskstoissues/SKILL.md)** | Sync with GitHub | Transforms local `tasks.md` into actionable GitHub issues. |
| **[Constitution](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/speckit-constitution/SKILL.md)** | Governing Principles | Management of non-negotiable project standards and governance dates. |

---

## 2. The GSTITCH Ecosystem
*The bridge between high-fidelity design and modular frontend code. Powered by Google Stitch and the Stitch MCP.*

| Skill | Purpose | Key Standards |
|:---|:---|:---|
| **[Architect](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-architect/SKILL.md)** | Coordinate Stitch builds | Bridges design specs with generated screens; manages project ID routing. |
| **[Design](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-design/SKILL.md)** | Unified entry point | Handles iterative generation and editing via text-to-UI prompts. |
| **[Components](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-components/SKILL.md)** | Design-to-React transformation | Modular Vite/React extraction, AST validation, metadata retrieval. |
| **[Design MD](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-design-md/SKILL.md)** | Synthesize tokens | Extracts semantic design tokens into a centralized `DESIGN.md`. |
| **[Enhance](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-enhance/SKILL.md)** | Prompt optimization | Injects UI/UX keywords and atmosphere context into raw design requests. |
| **[Loop](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-loop/SKILL.md)** | Autonomous iteration | Uses the "Baton" system (`.stitch/next-prompt.md`) for continuous builds. |
| **[Remotion](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/gstitch-remotion/SKILL.md)** | Walkthrough generation | Creates programmatic videos of Stitch projects with zooms and overlays. |

---

## 3. Core Engineering & Architecture
*The "Senior Leadership" skills that enforce structural integrity and best practices across the entire stack.*

- **[React Architect](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/react-architect/SKILL.md)**: Enforces composition, colocation, and the 300-line component limit. Expert in Compound, Composite, and Polymorphic patterns.
- **[TanStack Master](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/tanstack-master/SKILL.md)**: Governs type-safe routing, server functions, and hydration safety. Zero tolerance for query key collisions.
- **[Tailwind Architect](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/tailwind-architect/SKILL.md)**: Modern v4+ discipline. mandates CSS-first configuration (`@theme`) and zero legacy v3 class tolerance.
- **[Prompt Enhancer](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/prompt-enhancer/SKILL.md)**: The universal preprocessing layer. Transforms vague requests into high-fidelity engineering briefs with governance injection.
- **[Find Skills](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/find-skills/SKILL.md)**: The autonomous router. Dynamically discovers and assembles specialist squads at runtime.
- **[Code Review](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/code-review/SKILL.md)**: Principal Engineer protocol. Audits across 8 dimensions including Spec alignment, Performance, and Security.

---

## 4. Specialist Squads
*Domain-specific experts who bring deep technical knowledge to their respective partitions.*

- **[Backend Specialist](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/backend-specialist/SKILL.md)**: Principal Architect. Enforces transactional integrity, typed robustness, and Clean Architecture for multi-service backends.
- **[Frontend Specialist](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/frontend-specialist/SKILL.md)**: High-density UI engineering. Mathematical typography scales (1.250), HSL color calibration, and spring physics (no linear motion).
- **[Design Curator](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/design-curator/SKILL.md)**: Aesthetic DNA management. Defines the "Atmosphere Spectrum" (Density, Variance, Motion, Creativity, Warmth).
- **[Appwrite Specialist](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/appwrite/SKILL.md)**: Backend infrastructure. Strict separation of session vs. admin clients, Zod-validated schemas, and non-destructive data patterns.
- **[Shadcn Specialist](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/shadcn-specialist/SKILL.md)**: Component composition authority. Enforces Radix accessibility standards and "asChild" trigger patterns.

---

## 5. Quality & Testing
*The safety net. Ensures that every feature is resilient, testable, and stable.*

- **[Test Master](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/test-master/SKILL.md)**: Unified testing authority. Demands exhaustive scenario coverage across 8 classes (Happy Path, Edge, System Failure, Race Conditions, etc.).
- **[Git Commit](file:///home/tiago/01-dev-env/personal-repos/luna-ai-skills/.agent/skills/git-commit/SKILL.md)**: Semantic discipline. Enforces atomic commits, conventional messages, and mandatory safety stashing.
- **Coverage & Layer Testing**: Specialized redirections for **Backend**, **Frontend**, and **E2E** testing patterns, all governed by the Test Master protocol.

---

> [!IMPORTANT]
> This ecosystem is dynamic. Use `/find-skills` periodically to discover new specialists or updated protocols as the repository evolves.
