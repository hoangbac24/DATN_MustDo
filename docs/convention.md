# TaskFlow Engineering & Coding Standards

This document specifies mandatory coding conventions and architectural patterns for TaskFlow.

---

## 1. General Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
- **Clean Code**: Self-documenting variable names, small functions, no magic numbers.
- **DRY & KISS**: Do not duplicate business rules or over-engineer abstractions.

---

## 2. Backend Conventions (Java 21 / Spring Boot)

### 2.1 Package Organization
```
com.taskflow.modules.<module_name>/
├── controller/
├── service/
│   └── impl/
├── repository/
├── entity/
├── dto/
├── mapper/
├── validator/
└── specification/
```

### 2.2 Entity & Database Rules
- Every database table MUST include standard auditing fields via `BaseEntity` (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
- Primary keys MUST use `UUID` or `BIGINT` auto-generated identifiers.
- Entity mappings MUST use lazy fetching (`FetchType.LAZY`) for relationships.

### 2.3 API Response Standards
All REST controllers MUST return the standard envelope `ApiResponse<T>`:
```json
{
  "code": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": 1770000000000
}
```

---

## 3. Frontend Conventions (Next.js / TypeScript / React 19)

### 3.1 Directory Structure
- Feature logic strictly placed inside `src/features/<feature-name>`.
- Global reusable UI primitives placed in `src/components/ui`.

### 3.2 Component Guidelines
- Use TypeScript interfaces/types for props.
- No `any` type allowed.
- Forms must use `react-hook-form` paired with `zod` schema validation.
