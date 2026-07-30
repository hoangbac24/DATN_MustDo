# TaskFlow Engineering Standard: Database Guidelines (`database-style.md`)

This document defines the database design standards, schema conventions, migration practices, and performance guidelines for **TaskFlow** using **PostgreSQL** and **Flyway**.

---

## # Naming Conventions

All database identifiers (tables, columns, indexes, constraints) MUST use **lowercase `snake_case`**.

| Artifact | Convention | Example |
| :--- | :--- | :--- |
| **Database Name** | `snake_case` | `taskflow_dev`, `taskflow_prod` |
| **Table Name** | Plural `snake_case` | `workspaces`, `tasks`, `users` |
| **Column Name** | Singular `snake_case` | `first_name`, `created_at`, `is_active` |
| **Primary Key Constraint** | `pk_<table_name>` | `pk_workspaces`, `pk_tasks` |
| **Foreign Key Constraint** | `fk_<source_table>_<target_table>` | `fk_projects_workspaces` |
| **Unique Constraint** | `uk_<table_name>_<column_names>` | `uk_users_email` |
| **Check Constraint** | `ck_<table_name>_<condition>` | `ck_tasks_priority` |
| **Index Name** | `idx_<table_name>_<column_names>` | `idx_tasks_workspace_status` |

---

## # Primary Key & UUID Strategy

1. **UUIDv4 Primary Keys**:
   - All primary key identifiers MUST use PostgreSQL `UUID` types generated via `gen_random_uuid()` or Java `UUID.randomUUID()`.
   - Never use auto-incrementing sequential integers (`BIGSERIAL`) for entity primary keys to prevent enumeration attacks and simplify distributed data merging.

```sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    -- ...
);
```

---

## # Audit Fields & BaseEntity

Every business domain table MUST incorporate standard audit columns:

| Column | Data Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | Timestamp of record creation in UTC |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | Timestamp of last record update in UTC |
| `created_by` | `UUID` | `NULLABLE` | User ID who created the record |
| `updated_by` | `UUID` | `NULLABLE` | User ID who last updated the record |

```java
// Standard BaseEntity in Java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private UUID createdBy;

    @LastModifiedBy
    @Column(name = "updated_by")
    private UUID updatedBy;
}
```

---

## # Timestamp & Soft Delete Strategy

1. **UTC Timestamp (`TIMESTAMPTZ`)**:
   - All temporal columns MUST use `TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`).
   - Timestamps stored in PostgreSQL must strictly be in **UTC**. Conversion to user local time occurs exclusively on client frontend presentation layers.
2. **Soft Delete Policy**:
   - Entities marked for soft delete MUST include `is_deleted BOOLEAN DEFAULT FALSE NOT NULL` and `deleted_at TIMESTAMPTZ NULL`.
   - Spring Data JPA repositories handling soft-deletable entities must use `@SQLDelete` and `@Where(clause = "is_deleted = false")` or explicit Specification filters.

---

## # Flyway Migration Rules

1. **Location**: All migration scripts MUST reside in `code/backend/src/main/resources/db/migration/`.
2. **Naming Pattern**: `V<Version>__<Description>.sql` (Note: two underscores `__`).
   - Example: `V1__init_schema.sql`
   - Example: `V2__create_workspaces_table.sql`
   - Example: `V3__add_task_priority_index.sql`
3. **Strict Immutability**:
   - Once a migration script is committed or executed in any environment, it MUST NEVER be edited.
   - Any schema modification or index addition MUST be added as a brand-new incremental versioned migration script (`V4__...sql`).
4. **Idempotent DDL Rules**:
   - Always include explicit constraints, NOT NULL specifications, and default values.

```sql
-- Migration Example: V2__create_workspaces_table.sql
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT uk_workspaces_slug UNIQUE (slug),
    CONSTRAINT fk_workspaces_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
```

---

## # Entity Relationships & JPA Guidelines

1. **Mandatory Lazy Fetching (`FetchType.LAZY`)**:
   - ALL JPA relationships (`@ManyToOne`, `@OneToMany`, `@OneToOne`, `@ManyToMany`) MUST explicitly configure `fetch = FetchType.LAZY`.
   - ❌ `FetchType.EAGER` is **STRICTLY FORBIDDEN** to prevent unexpected N+1 query cascades.
2. **Many-to-Many Relationships**:
   - Many-to-many relationships must be mapped via explicit intermediate join entities (e.g., `WorkspaceMemberEntity` representing the `workspace_members` join table).
3. **JSONB Columns**:
   - Use PostgreSQL `JSONB` columns strictly for dynamic attributes, user preference flags, or audit snapshot payloads. Do not use JSONB to bypass relational normalization.

```java
// Good JPA Entity Relationship
@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectEntity extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false, foreignKey = @ForeignKey(name = "fk_projects_workspaces"))
    private WorkspaceEntity workspace;
}
```

---

## # Performance & Indexing Guidelines

1. **Foreign Key Indexing**: Every Foreign Key column MUST have a corresponding index to optimize join query performance.
2. **Composite Indexes**: Query paths filtering by multi-column combinations (e.g., `workspace_id` + `status` + `due_date`) must be supported by composite indexes matching column filter order.
3. **Preventing N+1 Queries**:
   - Use `FETCH JOIN` in JPQL or Spring Data JPA `@EntityGraph` when loading parent entities alongside child relationships for display.
4. **Query Performance Verification**:
   - Execute `EXPLAIN ANALYZE` on complex queries to ensure index scans are utilized rather than full table scans.
