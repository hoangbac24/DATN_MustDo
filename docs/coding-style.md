# TaskFlow Engineering Standard: Coding Guidelines (`coding-style.md`)

This document defines the strict, production-ready coding standards for **TaskFlow** across both Frontend (TypeScript / Next.js) and Backend (Java 21 / Spring Boot) codebases.

---

## # General Principles

### 1. SOLID Principles
- **Single Responsibility Principle (SRP)**: Every class, module, function, or React component must have one, and only one, reason to change.
- **Open/Closed Principle (OCP)**: Code entities should be open for extension, but closed for modification. Use interfaces, abstract wrappers, and strategies.
- **Liskov Substitution Principle (LSP)**: Derived classes or implementations must be completely substitutable for their base types without altering program correctness.
- **Interface Segregation Principle (ISP)**: Clients must not be forced to depend on interfaces they do not use. Prefer small, focused interfaces.
- **Dependency Inversion Principle (DIP)**: High-level modules must not depend on low-level modules. Both must depend on abstractions.

### 2. DRY (Don't Repeat Yourself)
- Every piece of knowledge or logic must have a single, unambiguous representation within the system.
- Extract common logic into custom hooks, utility functions, or domain services. Never copy-paste business logic.

### 3. KISS (Keep It Simple, Stupid)
- Write code for human readability first. Avoid obscure language tricks, nested ternary operators, or over-engineered abstractions.
- Simple, explicit logic is easier to audit, test, and maintain.

### 4. YAGNI (You Aren't Gonna Need It)
- Implement features and abstractions strictly required by current specifications.
- Do not add speculative parameters, unused abstract classes, or premature customization hooks.

### 5. Clean Code
- Self-documenting identifier names that explain intent.
- Keep methods and functions short (< 20 lines target, maximum 50 lines).
- Single level of abstraction per method.
- Functions must have zero side-effects unless explicitly designated (e.g., state mutations or DB writes).

### 6. Clean Architecture
- Decouple domain core business logic from frameworks, UI libraries, database drivers, and third-party tools.
- Dependencies point inward toward the core domain.

---

## # Naming Conventions

| Artifact | Language / Ecosystem | Convention | Example |
| :--- | :--- | :--- | :--- |
| **Variables** | TS / Java | camelCase | `userStatus`, `activeWorkspaceId` |
| **Functions / Methods** | TS / Java | camelCase (verb prefix) | `findUserById()`, `calculateProgress()` |
| **Classes** | TS / Java | PascalCase | `WorkspaceService`, `TaskController` |
| **Interfaces (Backend)** | Java | PascalCase | `TaskService` (Impl: `TaskServiceImpl`) |
| **Interfaces (Frontend)**| TS | PascalCase | `UserProfileProps`, `TaskItem` |
| **Enums** | TS / Java | PascalCase (Type), UPPER_SNAKE (Value) | `TaskStatus.IN_PROGRESS` |
| **DTOs** | Java | `[Domain][Action]Request` / `Response` | `CreateTaskRequest`, `UserDto` |
| **Entities** | Java | `[Domain]Entity` | `WorkspaceEntity`, `TaskEntity` |
| **Repositories** | Java | `[Domain]Repository` | `ProjectRepository` |
| **Controllers** | Java | `[Domain]Controller` | `WorkspaceController` |
| **Services** | Java | `[Domain]Service` / `[Domain]ServiceImpl` | `TaskService`, `TaskServiceImpl` |
| **Mappers** | Java | `[Domain]Mapper` | `UserMapper` |
| **Validators** | Java | `[Domain]Validator` | `WorkspaceValidator` |
| **React Components** | TSX | PascalCase | `TaskKanbanBoard.tsx` |
| **React Hooks** | TS | camelCase starting with `use` | `useWorkspaceList.ts` |
| **Constants** | TS / Java | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS`, `JWT_SECRET_KEY` |
| **Environment Vars** | All | UPPER_SNAKE_CASE | `DATABASE_URL`, `NEXT_PUBLIC_API_URL` |
| **Java Packages** | Java | lowercase (dot-separated) | `com.taskflow.modules.workspace` |
| **Folders (Frontend)** | TS / React | kebab-case | `features/task-management` |
| **Files (Frontend)** | TS / TSX | kebab-case (PascalCase for components)| `workspace-card.tsx`, `use-task.ts` |
| **Files (Backend)** | Java | PascalCase matching class | `WorkspaceEntity.java` |

---

## # TypeScript Rules

1. **Strict Typing Enabled**: `tsconfig.json` must enforce `"strict": true`, `"noImplicitAny": true`, and `"strictNullChecks": true`.
2. **Forbidden `any`**: `any` is strictly prohibited. Use explicit types, generics, or `unknown` paired with type guards.
3. **Readonly Properties**: Mark props and state interfaces as `readonly` where values should not be mutated inline.
4. **Interfaces vs Types**:
   - Use `interface` for object structures, component props, and contract definitions (better performance & extension).
   - Use `type` for union types, intersection types, primitive aliases, or tuples.
5. **Runtime Validation with Zod**: All client-side inputs, form payloads, and API response schemas must be parsed and validated using Zod.
6. **No Duplicate Types**: Export shared types from `src/features/<feature>/types` or `@/types`. Do not redefine identical props in multiple components.

```typescript
// Good TypeScript Interface & Zod Schema Definition
import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export interface TaskItemProps {
  readonly task: {
    readonly id: string;
    readonly title: string;
    readonly priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  };
  readonly onStatusChange: (taskId: string, status: string) => void;
}
```

---

## # Java Rules

1. **Constructor Injection Only**:
   - Dependencies MUST be injected via constructor injection using Lombok `@RequiredArgsConstructor`.
   - ❌ `@Autowired` on private fields is **STRICTLY FORBIDDEN**.
2. **Proper Lombok Usage**:
   - Use `@Getter`, `@Setter` (only when necessary), `@Builder`, `@RequiredArgsConstructor`, and `@NoArgsConstructor(access = AccessLevel.PROTECTED)` for JPA entities.
   - Avoid `@Data` on JPA Entities to prevent infinite recursion in `equals`/`hashCode`/`toString` circular references.
3. **Never Expose JPA Entities**:
   - JPA Entities (`*Entity.java`) must **NEVER** be returned by REST Controllers or passed across public module boundaries.
   - Always map entities to DTOs using explicit mappers (e.g., MapStruct or dedicated mapper components).
4. **Request & Response DTOs**:
   - Use Java 21 `record` types or immutable classes with `@Value` / `@Builder` for DTOs.
5. **Input Validation**:
   - Use `jakarta.validation` annotations (`@NotBlank`, `@NotNull`, `@Size`, `@Email`, `@Min`, `@Max`) on all Request DTOs.
   - Controllers must annotate parameters with `@Valid`.
6. **Standard Response Wrapper**:
   - Every Controller endpoint must return `ApiResponse<T>`.
7. **Exception Handling**:
   - Throw specific domain exceptions (e.g., `ResourceNotFoundException`, `AccessDeniedException`, `BusinessRuleException`).
   - Exceptions are automatically caught and transformed by the `@RestControllerAdvice` (`GlobalExceptionHandler`).

```java
// Good Java Spring Boot Controller & Service Pattern
@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
@Tag(name = "Workspace Management", description = "Endpoints for managing user workspaces")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceDto>> createWorkspace(
            @Valid @RequestBody CreateWorkspaceRequest request) {
        WorkspaceDto created = workspaceService.createWorkspace(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Workspace created successfully", created));
    }
}
```

---

## # React Rules

1. **Functional Components Only**: Class components are prohibited.
2. **Server Components First (RSC)**:
   - Pages and container components in Next.js App Router must be Server Components by default.
   - Server Components handle server-side data fetching directly without client-side JS overhead.
3. **Client Components Only When Needed**:
   - Add `'use client'` strictly at the top of files requiring state hooks (`useState`, `useEffect`, `useReducer`), custom browser listeners, or interactivity.
4. **Single Responsibility**:
   - A single component file must render one atomic UI element or feature view.
5. **Strict Component File Limits**:
   - **Maximum File Length**: 200 lines of code. If a component exceeds 200 lines, extract logical sub-components or custom hooks.
   - **Maximum Function/Hook Length**: 50 lines of code.

---

## # Formatting & Tooling Rules

### Prettier & Code Style
- **Indent**: 2 spaces for TS/JSON/CSS; 4 spaces for Java.
- **Print Width**: 100 characters max line length.
- **Quotes**: Single quotes for TS/JS (`'string'`); double quotes for Java & HTML/JSX attributes (`"string"`).
- **Semicolons**: Mandatory in TypeScript and Java.

### Import Order Guidelines (TypeScript)
Imports must be grouped in the following order with blank lines between groups:
1. React / Next.js core packages (`react`, `next/*`)
2. Third-party external libraries (`lucide-react`, `@tanstack/react-query`, `zod`)
3. Internal alias path components (`@/components/ui`, `@/features/...`)
4. Relative imports (`./sub-component`, `../types`)
5. Styles / Assets (`import './styles.css'`)

```typescript
// Standard Import Order Example
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { CheckCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/features/workspace/hooks/use-workspace';
import type { WorkspaceDto } from '@/features/workspace/types';

import { WorkspaceHeader } from './workspace-header';
```
