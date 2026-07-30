# AGENTS.md - TaskFlow AI Constitution & Engineering Standards

> **Notice to AI Coding Assistants**:  
> This document is the supreme law and engineering constitution for **TaskFlow**. Every AI assistant (Antigravity, Cursor AI, Claude Code, GitHub Copilot, ChatGPT, etc.) operating in this repository **MUST** strictly adhere to the rules, architectural patterns, coding principles, and guidelines specified herein.

---

## # Project Overview

### What is TaskFlow?
**TaskFlow** is a modern, modular, enterprise-grade personal and team productivity platform engineered to scale seamlessly from personal task execution to enterprise workspace collaboration. It delivers an intuitive, high-performance web dashboard alongside a robust REST API backend designed to support future cross-platform clients.

### Long-Term Vision
To build an all-in-one intelligent productivity ecosystem that unifies task execution, project management, calendar scheduling, habit tracking, and team collaboration into a seamless workflow powered by context-aware AI automation assistants.

### Current Phase
- **Phase 1 & 2 Active Implementation**:
  - Core Infrastructure & Monorepo Setup
  - Authentication & Authorization (Stateless JWT, RBAC)
  - User & Profile Management
  - Workspaces, Projects, and Task Management
  - Reminders, Calendar Integration, and Notifications System

### Future Roadmap
- **Phase 1**: Personal Task Management (Tasks, Workspaces, Projects, Reminders)
- **Phase 2**: Team Workspace Collaboration (Roles, Granular Permissions, Activity Auditing)
- **Phase 3**: Advanced Productivity Views (Kanban Boards, Interactive Calendar, Notes, Habit Tracker)
- **Phase 4**: AI Assistant Integration (Smart task prioritization, automated summaries, natural language scheduling)
- **Phase 5**: Cross-Platform Mobile Application (React Native client leveraging identical REST backend APIs)

---

## # Architecture

### Architectural Overview
TaskFlow is structured as a modular Monorepo separating the frontend user interface (`code/frontend`) and backend services (`code/backend`), enforced with strict encapsulation and domain boundaries.

```
code/
├── frontend/          # Next.js 16 App Router (TypeScript, React 19, Tailwind CSS)
└── backend/           # Spring Boot 3.4+ / Java 21 (Modular DDD Maven Architecture)
docs/                  # Architecture specs, SRS, OpenAPI contracts, ERDs
scripts/               # Development and operational scripts
```

### Frontend Architecture
- **Framework**: Next.js App Router with Server Components by default.
- **Organization**: Feature-first module structure (`src/features/<domain>`).
- **State Separation**: TanStack Query (v5) for asynchronous server state; Zustand for UI state.
- **UI Components**: Atomic design using `shadcn/ui` primitives located in `@/components/ui`.

### Backend Architecture
- **Framework**: Java 21 / Spring Boot 3.4+ structured using Domain-Driven Design (DDD).
- **Package Hierarchy**: Feature-First domain packaging under `com.taskflow.modules.<module>`.
- **Domain Decoupling**: Each module operates as an independent bounded context with isolated controllers, services, repositories, and domain models.
- **Layer-First Architecture Forbidden**: ❌ **DO NOT** organize the application using global layer folders (e.g., `controllers/`, `services/`, `repositories/` at the application root). All code MUST live inside its specific feature module.

### Core Modular Boundaries

```
com.taskflow.
├── common/            # Cross-cutting infrastructure (BaseEntity, ApiResponse, GlobalExceptionHandler)
├── shared/            # Cross-domain utilities, shared constants, and generic helpers
└── modules/           # Bounded Context Feature Modules
    ├── auth/          # Authentication & Token Management
    ├── user/          # User Profiles & Settings
    ├── workspace/     # Workspace Boundaries & Membership
    ├── project/       # Project Boards & Task Collections
    ├── task/          # Task Management & Execution
    ├── calendar/      # Events & Time Grid
    ├── reminder/      # Scheduled Alerts & Reminders
    ├── notification/  # In-App & Multi-Channel Notifications
    ├── attachment/    # File & Media Management
    ├── activity/      # Audit Logging & Activity Feeds
    └── ai/            # AI Workflow Interoperability
```

---

## # Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript (Strict Mode Enabled)
- **Styling**: Tailwind CSS, `shadcn/ui` foundation
- **State & Data**: Zustand (UI State), TanStack Query v5 (Server State), React Hook Form + Zod (Form Validation)
- **HTTP Client**: Axios with global JWT refresh interceptors
- **Icons**: Lucide Icons

### Backend
- **Framework**: Spring Boot 3.4+ / Java 21
- **Security**: Spring Security with stateless JWT Authentication
- **Persistence**: Spring Data JPA, Hibernate, PostgreSQL
- **Database Migrations**: Flyway Versioned Migrations
- **API Documentation**: OpenAPI 3.0 / Swagger UI
- **Utilities**: Lombok, Jakarta Validation

### Database
- **Engine**: PostgreSQL (Neon Serverless for production/staging, local PostgreSQL for offline dev)
- **Migration Engine**: Flyway SQL scripts stored in `src/main/resources/db/migration/`

### Deployment
- **Frontend**: Vercel / Docker Container
- **Backend**: AWS / Railway / Cloud Docker Container runtime
- **Database**: Neon DB Cloud Instance

---

## # Coding Principles

Every line of code submitted must strictly implement industry-standard software engineering principles:

- **SOLID**:
  - **S**ingle Responsibility Principle: Each class, component, or module has one and only one reason to change.
  - **O**pen/Closed Principle: Software entities are open for extension, closed for modification.
  - **L**iskov Substitution Principle: Derived types must be completely substitutable for base types.
  - **I**nterface Segregation Principle: Clients should not be forced to depend upon interfaces they do not use.
  - **D**ependency Inversion Principle: Depend upon abstractions, not concrete implementations.
- **DRY (Don't Repeat Yourself)**: Eliminate duplicate logic. Extract shared patterns into generic utility functions, custom hooks, or shared domain services.
- **KISS (Keep It Simple, Stupid)**: Write clear, straightforward implementations. Avoid over-engineering and premature abstraction.
- **YAGNI (You Aren't Gonna Need It)**: Do not write unused speculative features or unused abstract wrappers.
- **Clean Code**: Self-documenting identifier names, small focused functions (< 20 lines ideal), single level of abstraction per method.
- **Clean Architecture**: Decouple domain core logic from external web frameworks, UI components, and database drivers.
- **Composition over Inheritance**: Favor object composition and interfaces over complex class inheritance hierarchies.
- **Reusable Components**: React components must be atomic, modular, and configurable via strict TypeScript interfaces.
- **Reusable Services**: Backend business logic must be exposed through clean Java interfaces implemented by concrete service classes.
- **Reusable Hooks**: Encapsulate complex client-side state and async side effects inside custom React hooks (`use*`).
- **Strict TypeScript**: `noImplicitAny: true`, `strictNullChecks: true`. Never use `any`. Use `unknown` with explicit type guards when dealing with dynamic input.
- **Strict Java**: Strong explicit typing, final parameters, immutable DTOs (Java Records or Lombok `@Value`/`@Builder`), no raw types.

---

## # Folder Rules

### Organization Guidelines
1. **Feature-First Organization**: Code must be grouped strictly by functional business domain.
   - Frontend: `code/frontend/src/features/<feature-name>/...`
   - Backend: `code/backend/src/main/java/com/taskflow/modules/<module-name>/...`
2. **Forbidden Folder Creation**:
   - ❌ **NEVER** create files outside established module structures.
   - ❌ **NEVER** create top-level or random utility directories (e.g., `utils/helpers/`, `misc/`, `common2/`, `temp/`).
   - ❌ **NEVER** create global layer folders like `src/controllers` or `src/services` at the application root level.
3. **Module Files Standard**:
   - Backend module structure:
     ```
     com.taskflow.modules.<module>/
     ├── controller/        # REST Controllers
     ├── service/           # Business Service Interfaces
     │   └── impl/          # Concrete Service Implementations
     ├── repository/        # Spring Data JPA Repositories
     ├── entity/            # JPA Entities
     ├── dto/               # Request & Response DTOs
     ├── mapper/            # Entity <-> DTO Mappers
     ├── validator/         # Domain Validation Logic
     └── specification/     # JPA Dynamic Search Criteria
     ```
   - Frontend feature structure:
     ```
     src/features/<feature-name>/
     ├── components/        # Feature-specific UI Components
     ├── hooks/             # Feature-specific React Hooks
     ├── services/          # Feature API Clients & Endpoints
     ├── types/             # Feature Type Definitions & Schemas
     └── utils/             # Feature-specific helper logic
     ```

---

## # Naming Convention

| Artifact | Language / Context | Convention | Example |
| :--- | :--- | :--- | :--- |
| **Variables** | TS / Java | camelCase | `userStatus`, `totalTaskCount` |
| **Functions / Methods**| TS / Java | camelCase (verb prefix) | `calculateProgress()`, `findUserById()` |
| **Classes** | TS / Java | PascalCase | `WorkspaceService`, `TaskController` |
| **Interfaces** | TS / Java | PascalCase | `WorkspaceService`, `UserPreferences` |
| **Enums** | TS / Java | PascalCase (Name), UPPER_SNAKE_CASE (Values) | `TaskPriority.HIGH_LEVEL` |
| **Constants** | TS / Java | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS`, `API_BASE_URL` |
| **Files (Frontend)** | TS / React | kebab-case (or PascalCase for components) | `workspace-card.tsx`, `use-tasks.ts` |
| **Files (Backend)** | Java | PascalCase matching class name | `WorkspaceEntity.java`, `TaskDto.java` |
| **Folders** | TS / Java | kebab-case (Frontend), lowercase (Java pkg) | `features/task-management`, `modules/workspace` |
| **DTOs** | Java | `[Domain][Action]Request` / `[Domain][Action]Response` | `CreateTaskRequest.java`, `UserDto.java` |
| **Entities** | Java | `[Domain]Entity` | `WorkspaceEntity.java`, `TaskEntity.java` |
| **Repositories** | Java | `[Domain]Repository` | `ProjectRepository.java` |
| **Services** | Java | `[Domain]Service` (Interface) / `[Domain]ServiceImpl` (Class) | `TaskService.java`, `TaskServiceImpl.java` |
| **Controllers** | Java | `[Domain]Controller` | `WorkspaceController.java` |
| **Mappers** | Java | `[Domain]Mapper` | `UserMapper.java` |
| **Validators** | Java | `[Domain]Validator` | `WorkspaceValidator.java` |
| **React Hooks** | TS / React | camelCase starting with `use` | `useWorkspaceDetails.ts` |
| **React Components** | TS / React | PascalCase | `TaskKanbanBoard.tsx` |

---

## # Frontend Rules

1. **Next.js App Router Framework**: Leverage Next.js 16 App Router standard patterns.
2. **Server Components First**: Render components as React Server Components (`RSC`) by default to optimize load times and bundle sizes.
3. **Client Components Only When Needed**: Explicitly declare `'use client'` ONLY at the top of files that utilize interactive event listeners, React state/effect hooks, or browser-only APIs.
4. **React Query for Server State**: Manage all async server data fetching, mutations, background updates, and cache invalidations exclusively with TanStack Query v5.
5. **Zustand for UI State**: Use Zustand stores strictly for global client-side UI states (e.g., sidebar collapse state, theme toggle, active modal state).
6. **Axios HTTP Client Only**: All API requests MUST use the centralized Axios instance configured with JWT auto-refresh interceptors. ❌ **DO NOT** use raw `fetch` for internal APIs.
7. **Tailwind CSS for Styling**: Style components using utility-first Tailwind CSS classes. Follow design system spacing and color tokens.
8. **shadcn/ui Design System**: Use standard `shadcn/ui` components inside `@/components/ui`. Extend styles cleanly via Tailwind.
9. **Never Inline Large JSX**: Complex inline render logic MUST be broken down into sub-components to preserve readability.
10. **Never Duplicate Components**: Always search `@/components/ui` and existing feature components before creating a new UI element.
11. **Component Line Limit (< 200 Lines)**: Every React component file MUST remain under **200 lines**. Refactor large components into smaller composition sub-components or delegate state logic to custom hooks.

---

## # Backend Rules

1. **Domain-Driven Design (DDD)**: Code must strictly adhere to bounded context domain separation.
2. **Module Independence**: Business logic, data models, and persistence layers inside one module MUST NOT directly depend on internal details of another module.
3. **Never Access Another Module's Repository Directly**: ❌ A service or controller in `Module A` must **NEVER** inject or call a `Repository` belonging to `Module B`.
4. **Always Access Other Modules via Services**: Inter-module communication MUST occur exclusively through the target module's public `Service` interface.
5. **Strict Use of DTOs**: Transfer data across API borders using DTOs.
6. **Never Expose JPA Entities**: ❌ Database Entities (`*Entity.java`) must **NEVER** be returned by Controllers or exposed in public API contracts.
7. **Use Constructor Injection**: Inject dependencies strictly via constructor injection. Use Lombok `@RequiredArgsConstructor`.
8. **No Field Injection**: ❌ `@Autowired` on private fields is **STRICTLY FORBIDDEN**.
9. **Standard API Response Wrapper**: Every controller method MUST return `com.taskflow.common.ApiResponse<T>`.
10. **Strict Jakarta Validation**: Request DTOs MUST be annotated with Jakarta validation constraints (`@NotBlank`, `@NotNull`, `@Size`, `@Email`, etc.) and validated using `@Valid` in Controller parameters.
11. **Global Exception Handling**: Centralize application error handling via `@RestControllerAdvice` (`GlobalExceptionHandler`), transforming domain exceptions into standard error responses.

---

## # API Rules

1. **RESTful Architecture**: Follow standard REST architectural principles.
2. **API Versioning**: All API endpoints MUST be prefixed with versioning path: `/api/v1/`.
3. **Plural Resource Names**: Nouns in URIs must be pluralized (e.g., `/api/v1/workspaces`, `/api/v1/projects`, `/api/v1/tasks`).
4. **Consistent HTTP Status Codes**:
   - `200 OK`: Successful read or update operation.
   - `201 Created`: Resource successfully created.
   - `204 No Content`: Successful request with no return payload (e.g., delete).
   - `400 Bad Request`: Validation failure or client malformed request.
   - `401 Unauthorized`: Authentication token missing or invalid.
   - `403 Forbidden`: Authenticated user lacks permission.
   - `404 Not Found`: Target resource does not exist.
   - `409 Conflict`: Business rule violation (e.g., duplicate unique constraint).
   - `500 Internal Server Error`: Unhandled server exception.
5. **Standardized Response Format**: All endpoints return `ApiResponse<T>`:
   ```json
   {
     "code": 200,
     "message": "Operation completed successfully",
     "data": { ... },
     "timestamp": 1770000000000
   }
   ```

---

## # Git Rules

1. **Commit Message Format**: Follow the Conventional Commits Specification:
   - `feat: <description>` (New feature for the user)
   - `fix: <description>` (Bug fix for the user)
   - `docs: <description>` (Changes to documentation)
   - `style: <description>` (Formatting, missing semi-colons, no code change)
   - `refactor: <description>` (Refactoring production code)
   - `test: <description>` (Adding or updating tests)
   - `chore: <description>` (Updating build tasks, package configs)
2. **Branch Naming Strategy**:
   - Production branch: `main`
   - Staging branch: `develop`
   - Feature branches: `feature/<short-description>`
   - Bugfix branches: `bugfix/<short-description>`
   - Hotfix branches: `hotfix/<short-description>`
3. **Pull Request (PR) Requirements**:
   - Descriptive title adhering to conventional commits.
   - Summary of key changes and linked task/issue numbers.
   - Pre-submission checklist: passage of clean build, zero linter warnings, unit test verification.

---

## # Documentation Rules

1. **Service Layer Documentation**: Every public service interface and method MUST include Javadoc / TSDoc documenting input params, business rules, return values, and thrown domain exceptions.
2. **Controller & API Endpoint Documentation**: Every REST Controller and endpoint method MUST be annotated with OpenAPI 3.0 / Swagger annotations (`@Tag`, `@Operation`, `@ApiResponse`).
3. **Module Documentation**: Every feature module must include clear inline package documentation or a `README.md` defining its domain boundary and responsibilities.

---

## # AI Rules

To ensure AI coding assistants act as high-velocity, reliable pair programmers without destroying existing codebase integrity, every AI tool MUST follow these explicit rules:

1. **Never Rewrite Working Code Without Reason**: Do not refactor or alter existing functional code unless explicitly instructed by the user or required for the immediate task.
2. **Never Rename Files Unless Necessary**: Preserve file names and file paths to prevent breaking import links across the application.
3. **Never Generate Duplicate Code**: Always inspect existing modules and shared utilities before introducing new functions or classes.
4. **Always Reuse Existing Components**: Re-use UI primitives (`@/components/ui`), hooks, and domain services.
5. **Always Search Before Creating**: Execute workspace searches (`grep_search` / `list_dir`) to check for pre-existing utility functions, DTOs, or components before writing new ones.
6. **Always Ask Before Making Breaking Changes**: Request user approval before changing public API contracts, database schemas, or core configuration files.
7. **Always Prefer Extension over Modification**: Extend behavior using interfaces, sub-components, or options rather than modifying established core contracts.

---

## # Output Quality

All generated code, architectures, and documentation MUST adhere to **Enterprise Level** quality standards:

- **Readable**: Clean formatting, intuitive variable names, clear separation of concerns.
- **Maintainable**: Decoupled modules, strict typing, complete testability.
- **Scalable**: Stateless APIs, efficient database indexes, domain boundaries ready for microservices extraction if needed.
- **No Placeholders**: ❌ **NEVER** output placeholder code such as `// TODO: implement later`, `// add logic here`, or incomplete stub functions in final outputs.
- **No Fake Implementations**: ❌ **NEVER** return hardcoded fake data in production controllers or dummy service returns. Build complete, working, production-grade implementations.

---
