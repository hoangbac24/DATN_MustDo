# TaskFlow API Contract Standard

All TaskFlow API endpoints are specified using OpenAPI 3.0 standards and exposed via Swagger UI (`/swagger-ui.html`).

## Standard REST API Response Specification

### Success Payload Structure
```json
{
  "code": 200,
  "message": "Success",
  "data": {},
  "timestamp": 1772182900000
}
```

### Error Payload Structure
```json
{
  "code": 400,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must not be empty"
    }
  ],
  "timestamp": 1772182900000
}
```
