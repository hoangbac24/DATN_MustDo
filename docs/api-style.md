# TaskFlow Engineering Standard: REST API Guidelines (`api-style.md`)

This document specifies the REST API design standards, contract specifications, status code usage, authentication mechanisms, and response formatting for **TaskFlow**.

---

## # REST Principles & URL Structure

### 1. Architectural Style
TaskFlow REST APIs adhere to HTTP/1.1 and HTTP/2 standards, producing and consuming `application/json` content types exclusively.

### 2. URL Versioning Strategy
All endpoints must include explicit API versioning within the URI path prefix:
```http
/api/v1/{resource-name}
```

### 3. Resource Naming Rules
- **Plural Nouns**: Resource endpoints MUST use plural nouns (e.g., `/api/v1/workspaces`, `/api/v1/tasks`, `/api/v1/projects`).
- **Kebab-Case**: Multi-word endpoints must use lowercase kebab-case (e.g., `/api/v1/task-categories`, `/api/v1/user-profiles`).
- **Hierarchical Nesting**: Nest resources to represent ownership, capped at a maximum depth of two levels:
  - ✅ `/api/v1/workspaces/{workspaceId}/projects`
  - ✅ `/api/v1/projects/{projectId}/tasks`
  - ❌ `/api/v1/workspaces/{wId}/projects/{pId}/tasks/{tId}/comments` (Too deep! Use top-level endpoint `/api/v1/tasks/{taskId}/comments` instead).

---

## # HTTP Methods & Status Codes

### HTTP Method Usage

| Method | Purpose | Idempotent | Safe |
| :--- | :--- | :--- | :--- |
| **GET** | Retrieve a single resource or collection | Yes | Yes |
| **POST** | Create a new resource or trigger an action | No | No |
| **PUT** | Replace a resource completely | Yes | No |
| **PATCH** | Partially update an existing resource | No | No |
| **DELETE** | Remove a resource | Yes | No |

### Standard HTTP Status Codes

| Code | Status | Usage Scenario |
| :--- | :--- | :--- |
| **200** | `OK` | Successful read, update, or general non-creation action. |
| **201** | `Created` | Resource successfully created. Returns `Location` header & payload. |
| **204** | `No Content` | Action completed successfully with no body (e.g., DELETE). |
| **400** | `Bad Request` | Malformed request body, syntax error, or field validation failure. |
| **401** | `Unauthorized` | Missing, expired, or invalid JWT authentication token. |
| **403** | `Forbidden` | Authenticated user lacks RBAC permissions for the target resource. |
| **404** | `Not Found` | The requested resource or endpoint URI does not exist. |
| **409** | `Conflict` | Business rule constraint violation (e.g., duplicate unique title). |
| **422** | `Unprocessable Entity` | Business logic validation failure despite valid JSON syntax. |
| **429** | `Too Many Requests` | Rate limit quota exceeded. |
| **500** | `Internal Server Error` | Unhandled server exception. Logged automatically for monitoring. |

---

## # Standard Response Envelope (`ApiResponse<T>`)

Every endpoint response MUST be wrapped inside the universal `ApiResponse<T>` envelope.

### Successful Response Format
```json
{
  "code": 200,
  "message": "Workspace retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Engineering Workspace",
    "slug": "engineering-workspace",
    "createdAt": "2026-07-30T10:00:00Z"
  },
  "timestamp": 1770000000000
}
```

### Standard Error Response Format
```json
{
  "code": 400,
  "message": "Validation failed for request parameters",
  "data": null,
  "errors": [
    {
      "field": "name",
      "message": "Workspace name must not be blank"
    },
    {
      "field": "maxMembers",
      "message": "Max members must be at least 1"
    }
  ],
  "timestamp": 1770000000000
}
```

---

## # Pagination, Filtering, Sorting & Searching

### Request Query Parameters
Collection endpoints (`GET /api/v1/tasks`) MUST support standardized pagination, sorting, and filtering parameters:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `Integer` | `0` | Zero-indexed page number |
| `size` | `Integer` | `20` | Page size limit (maximum `100`) |
| `sort` | `String` | `createdAt,desc` | Sort parameter in format `field,direction` |
| `q` | `String` | `null` | Full-text query string search term |
| `status` | `String` | `null` | Exact filter parameter (e.g., `status=IN_PROGRESS`) |

### Paginated Response Payload (`PageResponse<T>`)
```json
{
  "code": 200,
  "message": "Tasks retrieved successfully",
  "data": {
    "content": [
      {
        "id": "987e6543-e89b-12d3-a456-426614174111",
        "title": "Implement JWT Interceptor",
        "status": "IN_PROGRESS",
        "priority": "HIGH"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  },
  "timestamp": 1770000000000
}
```

---

## # Authentication & Authorization

### JWT Bearer Token Flow
1. **Login Request**: Client POSTs credentials to `/api/v1/auth/login`.
2. **Token Returns**: Server returns short-lived Access Token (JWT, 15 min expiration) in body and long-lived Refresh Token (HttpOnly Cookie, 7 days expiration).
3. **Authorized Requests**: Client attaches Access Token to all protected endpoint requests:
   ```http
   Authorization: Bearer <access_token>
   ```
4. **Automatic Token Refresh**: Frontend Axios interceptor intercepts `401 Unauthorized` responses and automatically invokes `POST /api/v1/auth/refresh` to obtain a new Access Token.

---

## # Rate Limiting & Idempotency Key

### Rate Limiting Headers
Protected APIs enforce rate limits per IP / User ID. All responses include rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 1770003600
```

### Idempotency Key
For critical non-idempotent operations (such as payment processing or workspace creation under poor network conditions), clients MAY supply a unique UUID in the header:
```http
X-Idempotency-Key: 7b9e4567-e89b-12d3-a456-426614174999
```
If a request with an identical `X-Idempotency-Key` is retried within 24 hours, the server returns the cached initial response without executing the business operation again.

---

## # OpenAPI / Swagger Annotations

Every REST Controller and method MUST include Swagger OpenAPI annotations:

```java
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "Operations for creating, searching, and managing tasks")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Create a new task", description = "Creates a new task within a workspace project.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Task created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request payload"),
        @ApiResponse(responseCode = "401", description = "Authentication token missing or invalid"),
        @ApiResponse(responseCode = "404", description = "Target project or workspace not found")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody CreateTaskRequest request) {
        TaskDto created = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", created));
    }
}
```
