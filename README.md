# 📋 TaskFlow - Nền Tảng Quản Lý Công Việc & Workspace Doanh Nghiệp (Enterprise Productivity Platform)

TaskFlow là hệ thống quản lý công việc và không gian làm việc nhóm (Workspace Collaboration) hiện đại chuẩn Jira / Confluence. Hệ thống được xây dựng theo kiến trúc **Domain-Driven Design (DDD) Feature-First**, cung cấp giao diện hiện đại (Next.js 15 App Router + React 19), hỗ trợ Đa ngôn ngữ (VI/EN) và hệ thống Backend RESTful API vững chắc (Spring Boot 3.4 + Java 21 + PostgreSQL).

---

## 🚀 1. Các Tính Năng Nổi Bật (Key Features)

- 🌐 **Không gian làm việc (Jira/Confluence Spaces)**: Hỗ trợ đầy đủ các tab **Summary** (Tổng quan báo cáo, biểu đồ Donut), **Backlog** (Sprint 0, Sprint 1...), **Board** (Bảng Kanban kéo thả), **Timeline** (Sơ đồ Gantt tiến độ), **Docs** (Wiki kho tri thức), **Forms** (Biểu mẫu thu thập yêu cầu) và **Code** (Tích hợp Repository).
- 👥 **Quản lý Thành viên & Phân quyền (RBAC)**: Phân quyền vai trò `OWNER`, `ADMIN`, `MEMBER`, hỗ trợ gửi lời mời qua Email hoặc Sao chép Link tham gia.
- ⚡ **Tài khoản Admin Khởi Tạo Tự Động (Auto-Seeded Admin)**: Tự động khởi tạo tài khoản quản trị hệ thống ngay khi mở máy.
- 🌍 **Đa ngôn ngữ (i18n UItext)**: Hỗ trợ chuyển đổi mượt mà giữa Tiếng Việt và Tiếng Anh.
- 🔐 **Bảo mật JWT & OAuth2**: Stateless Authentication với Refresh Token tự động.

---

## 🛠️ 2. Yêu Cầu Môi Trường & Tài Nguyên Cần Cài Đặt (Prerequisites)

Trước khi khởi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

### 📥 Các công cụ bắt buộc:
1. **Node.js (v20.x trở lên)**:
   - Tải về từ: [https://nodejs.org](https://nodejs.org)
   - Kiểm tra cài đặt: `node -v` và `npm -v`

2. **Java Development Kit (JDK 21)**:
   - Khuyên dùng: Eclipse Temurin JDK 21 hoặc Oracle JDK 21
   - Tải về từ: [https://adoptium.net](https://adoptium.net)
   - Kiểm tra cài đặt: `java -version` và `javac -version`

3. **Apache Maven (v3.9.x trở lên)**:
   - Tải về từ: [https://maven.apache.org](https://maven.apache.org)
   - Kiểm tra cài đặt: `mvn -v`

4. **Cơ sở dữ liệu PostgreSQL (Local hoặc Cloud)**:
   - **Cách 1 (Local PostgreSQL)**: Cài đặt PostgreSQL (phiên bản 14+) tải từ [postgresql.org](https://www.postgresql.org/download/), tạo CSDL tên `taskflow_db` (Port: 5432).
   - **Cách 2 (Cloud Neon PostgreSQL - Khuyên dùng)**: Đăng ký miễn phí tại [Neon.tech](https://neon.tech), tạo Database và lấy Connection String `jdbc:postgresql://...`.

---

## ⚙️ 3. Cấu Hình Biến Môi Trường (Environment Variables)

### 3.1 File `.env` tại thư mục gốc (dùng chung cho Monorepo & Backend)

Tạo file `.env` ở thư mục gốc `HVB_DATN/`:

```env
# Database Credentials (PostgreSQL Local hoặc Neon Cloud)
DATABASE_URL=jdbc:postgresql://localhost:5432/taskflow_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# Security & JWT Credentials
JWT_SECRET=c2VjdXJlX2p3dF9zZWNyZXRfa2V5X2Zvcl90YXNrZmxvd19lbnRlcnByaXNlX2FwcGxpY2F0aW9uXzIwMjY=
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Backend Server Port
PORT=8080

# CORS Allowed Origins
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 3.2 Cấu hình Frontend (`code/frontend/.env.local`)

Tạo file `.env.local` trong thư mục `code/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 🚦 4. Hướng Dẫn Khởi Chạy Chi Tiết (Step-by-Step Guide)

### 🔴 Bước 1: Cài đặt Thư viện Frontend
Mở Terminal tại thư mục gốc dự án và chạy:

```bash
npm --prefix code/frontend install
```

### 🟢 Bước 2: Khởi chạy Backend Server (Spring Boot 3.4)
Hệ thống sử dụng Flyway để **tự động tạo Bảng & Seeding Dữ Liệu Ban Đầu** khi khởi chạy.

Mở Terminal và thực hiện:
```bash
cd code/backend
mvn clean compile
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

> **Sau khi Backend khởi chạy thành công:**
> - Server lắng nghe tại: `http://localhost:8080`
> - **Tài khoản Admin mặc định** tự động khởi tạo:
>   - **Email**: `admin@gmail.com`
>   - **Mật khẩu**: `12345678`
>   - **Quyền hạn**: `ROLE_ADMIN`, `ROLE_USER`
> - **Tài liệu Swagger UI API**: `http://localhost:8080/swagger-ui.html`

### 🔵 Bước 3: Khởi chạy Frontend Dev Server (Next.js 15)
Mở một cửa sổ Terminal mới và thực hiện:

```bash
cd code/frontend
npm run dev
```

> **Sau khi Frontend khởi chạy thành công:**
> - Ứng dụng Web truy cập tại: `http://localhost:3000`
> - Đăng nhập bằng tài khoản `admin@gmail.com` / `12345678` để sử dụng đầy đủ các tính năng.

---

## ⚡ 5. Bảng Lệnh Tắt Rút Gọn (Monorepo Commands)

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Khởi chạy đồng thời cả Frontend và Backend song song |
| `npm run frontend` | Khởi chạy riêng ứng dụng Frontend Next.js (`code/frontend`) |
| `npm run backend` | Khởi chạy riêng dịch vụ Backend Spring Boot (`code/backend`) |
| `npm run build` | Build bản sản phẩm Production cho Frontend |
| `npm run lint` | Kiểm tra cú pháp và chất lượng mã nguồn Frontend |

---

## 📁 6. Cấu Trúc Thư Mục Dự Án (Repository Structure)

```
├── code/
│   ├── frontend/        # Next.js 15 App Router (TypeScript, Tailwind CSS, Zustand, TanStack Query)
│   │   ├── src/app/     # App Router Pages & Layouts
│   │   ├── src/features/# Modular UI Components (workspace, task, team, auth...)
│   │   └── src/locales/ # i18n JSON translations (vi, en)
│   └── backend/         # Spring Boot 3.4 (Java 21, Spring Data JPA, Flyway, JWT)
│       └── src/main/java/com/taskflow/modules/ # DDD Domain Modules
├── docs/                # SRS, API Specifications, ERD Diagram & Guidelines
├── scripts/             # Startup & Development Helper Scripts
└── README.md
```

---

## ☁️ 7. Hướng Dẫn Deployment

- **Frontend**: Deploy lên **Vercel** (`Root Directory: code/frontend`, đặt `NEXT_PUBLIC_API_URL` trỏ tới Backend URL).
- **Backend**: Deploy lên **Railway.app** (`Root Directory: code/backend`, thêm PostgreSQL plugin và đặt các biến `DATABASE_URL`, `SPRING_PROFILES_ACTIVE=prod`, `JWT_SECRET`).
