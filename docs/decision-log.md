# TaskFlow Architecture Decision Records (`decision-log.md`)

This log documents key technical decisions made during the architectural design of **TaskFlow**. Each Architecture Decision Record (ADR) outlines the context, rationale, trade-offs, and consequences of chosen technologies and architectural patterns.

---

## ADR-001: Selection of Monorepo Repository Structure

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: TaskFlow requires tight coordination between its Next.js frontend web client, Spring Boot backend API, database migration scripts, and architecture documentation. Multi-repository setups introduce repository drift and complex multi-repo CI/CD overhead.
- **Decision**: Adopt a single unified Monorepo structure (`code/frontend`, `code/backend`, `docs/`, `scripts/`).
- **Consequences**:
  - **Positive**: Single source of truth, atomic commits across frontend and backend, simplified development setup, unified documentation.
  - **Negative**: Git repository size grows faster over time; requires discipline around directory-scoped builds.
- **Alternatives Considered**: Polyrepo (separate `taskflow-web` and `taskflow-backend` repositories).

---

## ADR-002: Next.js 16 (App Router) for Frontend Framework

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: The frontend requires rapid initial page renders, SEO optimization, efficient routing, and modern UI capabilities for complex productivity dashboards.
- **Decision**: Select **Next.js 16** featuring React 19 and the App Router architecture.
- **Consequences**:
  - **Positive**: React Server Components (RSC) drastically reduce client bundle sizes; built-in layouts, nested routes, and automatic image/font optimization.
  - **Negative**: Strict boundary separation required between Server Components and Client Components (`'use client'`).
- **Alternatives Considered**: Vite + React SPA, Remix / React Router v7.

---

## ADR-003: Spring Boot 3.4+ & Java 21 for Backend Framework

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: The core backend system must process high-concurrency API requests, enforce enterprise-grade security rules, and support complex domain logic with long-term ecosystem stability.
- **Decision**: Select **Spring Boot 3.4+** running on **Java 21 LTS**.
- **Consequences**:
  - **Positive**: Java 21 Virtual Threads (Project Loom) provide high concurrency with low memory footprint; Spring Boot ecosystem offers robust security (Spring Security), persistence (Spring Data JPA), and OpenAPI integration out of the box.
  - **Negative**: Higher initial cold-start memory consumption compared to lightweight Go or Node.js microservices.
- **Alternatives Considered**: Node.js (NestJS), Go (Gin/Fiber), Python (FastAPI).

---

## ADR-004: PostgreSQL (Neon Serverless) for Primary Relational Database

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: TaskFlow requires strict ACID compliance for workspaces, task assignments, and permission roles, alongside support for flexible JSON metadata storage.
- **Decision**: Standardize on **PostgreSQL** deployed on **Neon Serverless** for cloud staging/production and local PostgreSQL for offline dev.
- **Consequences**:
  - **Positive**: Industry-standard reliability, native `UUID` support, `JSONB` for dynamic metadata, instant branching in Neon serverless DB environments.
  - **Negative**: Requires strict index management and connection pool tuning for serverless scale.
- **Alternatives Considered**: MySQL / MariaDB, MongoDB, DynamoDB.

---

## ADR-005: Domain-Driven Design (DDD) Architecture

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: As TaskFlow scales from personal task management to enterprise workspace collaboration and AI capabilities, business logic complexity will increase. Monolithic unstructured code leads to tight coupling.
- **Decision**: Structure backend and business domains around **Domain-Driven Design (DDD)** principles and Bounded Contexts.
- **Consequences**:
  - **Positive**: High cohesion within modules, clear domain boundaries, zero inter-module repository leakage, easy future microservices extraction.
  - **Negative**: Requires writing explicit mappers and DTO abstractions between modules.
- **Alternatives Considered**: Monolithic Layer-First Architecture (`controllers/`, `services/`, `repositories/` at root).

---

## ADR-006: Feature-First Folder Organization

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: Navigating files in large projects becomes tedious when related components, hooks, entities, and controllers are scattered across global layer folders.
- **Decision**: Enforce **Feature-First** packaging (`com.taskflow.modules.<module>` in backend; `src/features/<feature>` in frontend).
- **Consequences**:
  - **Positive**: Co-locates all assets belonging to a feature context, simplifying code reviews, feature deletion, and refactoring.
  - **Negative**: Developers must maintain module discipline and avoid creating arbitrary top-level utility folders.
- **Alternatives Considered**: Layer-First Organization.

---

## ADR-007: Stateless JWT Authentication with Refresh Tokens

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: TaskFlow must support web dashboards today and cross-platform mobile clients (React Native) in future roadmap phases without maintaining stateful server sessions.
- **Decision**: Implement **Stateless JWT Authentication** with short-lived Access Tokens (15 mins) and HttpOnly Refresh Tokens (7 days).
- **Consequences**:
  - **Positive**: Scalable, stateless server architecture; no server session storage required; seamlessly reusable for mobile apps.
  - **Negative**: Access tokens cannot be revoked instantly without maintaining a token blacklist.
- **Alternatives Considered**: Server-side Stateful Sessions (Redis-backed JSESSIONID).

---

## ADR-008: Flyway for Versioned Database Migrations

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: Database schemas must be version-controlled, repeatable across environments, and safely applied during CI/CD deployments.
- **Decision**: Adopt **Flyway** for automated SQL version migration management.
- **Consequences**:
  - **Positive**: Explicit SQL control, deterministic schema evolution, automatic execution on application startup.
  - **Negative**: Migration scripts are immutable; mistakes require generating new incremental migration files.
- **Alternatives Considered**: Liquibase, Hibernate `hbm2ddl.auto=update` (strictly forbidden in production).

---

## ADR-009: TanStack Query (v5) for Server State Management

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: Client components require data fetching, background polling, automatic cache invalidation, and optimistic UI updates without manual `useEffect` boilerplates.
- **Decision**: Standardize on **TanStack Query (v5)** for all client-side async server state management.
- **Consequences**:
  - **Positive**: Eliminates manual loading/error state management, built-in caching, automatic background refetching, seamless optimistic UI updates.
  - **Negative**: Developers must learn TanStack Query query key management strategies.
- **Alternatives Considered**: Raw `useEffect` + `fetch`/`axios`, Redux Toolkit RTK Query, SWR.

---

## ADR-010: Zustand for Client-Side UI State Management

- **Status**: Accepted
- **Date**: 2026-07-30
- **Context**: Transient client UI state (sidebar open/closed, active modal ID, current visual layout filters) requires a lightweight state container independent of server data.
- **Decision**: Use **Zustand** for client-side global UI state management.
- **Consequences**:
  - **Positive**: Tiny bundle size (~1KB), simple boilerplate-free API, no Context Provider wrapping required.
  - **Negative**: Must ensure Zustand is used strictly for client UI state, NOT server data caching (which belongs to TanStack Query).
- **Alternatives Considered**: Redux Toolkit, MobX, React Context API.
