# TaskFlow - Enterprise Personal Productivity Platform

TaskFlow is a modern, modular, production-ready productivity platform engineered to scale seamlessly from personal task management to full enterprise workspace collaboration.

---

## 🚀 Overview

TaskFlow is designed with a domain-driven, feature-first architecture, maintaining complete decoupling between system modules and providing clean REST APIs for both web and future mobile applications.

### Product Roadmap

- **Phase 1**: Personal Task Management (Tasks, Workspaces, Projects, Reminders)
- **Phase 2**: Team Workspace (Roles, Permissions, Team Collaboration)
- **Phase 3**: Kanban, Calendar, Notes, Habit Tracker
- **Phase 4**: AI Assistant Integration
- **Phase 5**: Mobile App (React Native using identical backend REST APIs)

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, shadcn/ui foundation
- **State & Data**: Zustand, TanStack Query (v5), React Hook Form + Zod
- **HTTP Client**: Axios with global JWT refresh interceptors
- **Icons**: Lucide Icons

### Backend
- **Framework**: Spring Boot 3.4+ / Java 21
- **Security**: Spring Security, Stateless JWT Authentication
- **Database Access**: Spring Data JPA, PostgreSQL (Neon Serverless)
- **Migrations**: Flyway Versioned Migrations
- **API Documentation**: OpenAPI 3.0 / Swagger UI
- **Utilities**: Lombok, Jakarta Validation

---

## 📁 Repository Structure

```
├── code/
│   ├── frontend/        # Next.js App Router project
│   └── backend/         # Spring Boot DDD Feature-First Maven project
├── docs/                # Architecture, SRS, API contracts, ERDs, UI guidelines
│   ├── srs.md
│   ├── convention.md
│   ├── api-contract/
│   ├── DB-erd/
│   └── UI-UX style guideline/
├── scripts/             # Local development and startup scripts
│   ├── run-dev.js
│   ├── run-backend-neon.js
│   └── run-backend-neon.ps1
├── .env.example         # Environment template
├── package.json         # Root monorepo scripts
└── README.md
```

---

## 🚦 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.x` or later
- **Java JDK**: `Java 21`
- **Apache Maven**: `v3.9.x` or later
- **PostgreSQL**: Neon DB connection string or local PostgreSQL instance

### Setup & Run

1. **Clone & Install Dependencies**
   ```bash
   cp .env.example .env
   npm --prefix code/frontend install
   ```

2. **Run All Systems Concurrently**
   ```bash
   npm run dev
   ```

3. **Run Backend with Neon Postgres**
   ```bash
   npm run backend:neon
   ```

---

## 📐 Architecture Guidelines

### Backend Architecture
- **Feature-First Organization**: Source code is structured by functional business domains under `com.taskflow.modules.*`.
- **Module Decoupling**: Each module (`auth`, `user`, `workspace`, `project`, `task`, `calendar`, `notification`, `reminder`, `attachment`, `activity`, `ai`) operates independently.
- **Unified Standard Envelope**: All API responses inherit from `com.taskflow.common.ApiResponse<T>`.

### Frontend Architecture
- **Feature-Based Structure**: Component trees and logic live inside `src/features/<domain>`.
- **Type-Safe Forms & API**: React Hook Form validated with Zod schemas.

---

## 📜 Development Workflow & Commit Conventions

- **Branch Strategy**: `main` (Production), `develop` (Staging), `feature/<feature-name>` (Features).
- **Commit Messages**: Follow Conventional Commits format (`feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).
