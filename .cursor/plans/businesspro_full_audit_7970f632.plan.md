---
name: BusinessPro Full Audit
overview: A complete analysis of the BusinessPro monorepo (Next.js 16 frontend + NestJS 11 API + shared packages) identifying security vulnerabilities, missing functionality, broken tests, infrastructure gaps, and improvement opportunities across the full stack.
todos:
  - id: security-helmet
    content: Add Helmet middleware to NestJS API for HTTP security headers
    status: completed
  - id: security-oauth-tokens
    content: Fix Google OAuth flow to not expose tokens in URL query params
    status: completed
  - id: security-scheduler
    content: Add authentication guard to scheduler endpoints
    status: completed
  - id: security-middleware
    content: Fix frontend middleware to protect all dashboard group routes, not just /dashboard
    status: completed
  - id: security-rate-limit
    content: Add stricter rate limiting on auth endpoints (login, register, OTP)
    status: completed
  - id: fix-e2e-test
    content: Fix broken e2e test that expects wrong response from GET /
    status: completed
  - id: add-unit-tests
    content: Add unit tests for critical services (Auth, Users, Content, AI)
    status: completed
  - id: email-service
    content: Integrate email service (Resend/SendGrid) for OTP and notifications
    status: completed
  - id: file-upload
    content: Integrate cloud storage (Cloudinary/S3) for avatar and media uploads
    status: completed
  - id: organizations-module
    content: Complete or remove the Organizations module (currently dead entity)
    status: completed
  - id: ci-cd-pipeline
    content: Create GitHub Actions workflows for lint, test, build, and deploy
    status: completed
  - id: env-example
    content: Create .env.example files with documented required variables
    status: cancelled
  - id: docker-compose
    content: Add docker-compose.yml for local dev with PostgreSQL
    status: completed
  - id: structured-logging
    content: Replace NestJS Logger with Pino/Winston structured JSON logging
    status: completed
  - id: error-boundaries
    content: Add React error boundaries to frontend layouts and pages
    status: completed
  - id: input-sanitization
    content: Add XSS sanitization pipe for user-generated content
    status: completed
  - id: pagination
    content: Add pagination to all list endpoints (content, models, memories)
    status: completed
  - id: caching-layer
    content: Add Redis/in-memory caching for frequently accessed data
    status: completed
isProject: false
---

# BusinessPro -- Full Project Audit & Recommendations

## Project Summary

BusinessPro is an AI-driven social media automation platform for local businesses in India. It's a **Bun monorepo** with:

- **Frontend:** Next.js 16 + React 19 (`our-app/`) -- Mantine + Tailwind, Zustand, React Query
- **Backend:** NestJS 11 (`api/`) -- TypeORM, PostgreSQL, Passport JWT/OAuth
- **Shared:** `@businesspro/ai`, `@businesspro/api-client` (Orval-generated), `@businesspro/auth-ui`, `@businesspro/shared-utils`
- **Mobile:** Capacitor 8 configured but not initialized
- **Deploy:** Railway (API) + Vercel (Frontend), Docker

---

## PRIORITY 1: Security Vulnerabilities (Must Fix)

### 1.1 Missing Helmet middleware

- [api/src/main.ts](api/src/main.ts) has no `helmet()` middleware
- This leaves the API exposed without critical HTTP security headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.)
- **Fix:** Install `helmet` and add `app.use(helmet())` in `main.ts`

### 1.2 Google OAuth tokens exposed in URL

- The Google OAuth callback redirects to the frontend with `accessToken` and `refreshToken` as **query parameters**
- These tokens appear in browser history, server access logs, referrer headers, and analytics tools
- **Fix:** Use a short-lived authorization code flow -- backend issues a one-time code, frontend exchanges it for tokens via POST

### 1.3 Scheduler endpoints are completely public

- `POST /scheduler/sync-models` and `GET /scheduler/sync-stats` have no authentication
- Anyone can trigger model syncs or view internal stats
- **Fix:** Add an API key guard or admin-only JWT guard to these endpoints

### 1.4 Frontend middleware route protection gaps

- [our-app/middleware.ts](our-app/middleware.ts) only protects paths starting with `/dashboard`
- Routes like `/create`, `/content`, `/calendar`, `/analytics`, `/settings`, `/profile`, `/pricing`, `/checkout` are **not middleware-protected**
- Users can access these pages without auth; they only fail when API calls return 401
- **Fix:** Update middleware matcher to cover all `(dashboard)` group routes

### 1.5 No rate limiting on auth endpoints

- The global rate limit is 100 req/min, which is too permissive for login/register/OTP endpoints
- **Fix:** Add stricter per-route throttling on `/auth/login`, `/auth/register`, `/auth/password/`*

---

## PRIORITY 2: Broken / Missing Functionality

### 2.1 E2E test is broken

- [api/test/app.e2e-spec.ts](api/test/app.e2e-spec.ts) expects `GET /` to return `"Hello World!"`
- The actual `AppController` returns a health status JSON object
- **Fix:** Update the e2e test to match the real response

### 2.2 No unit tests anywhere

- Zero `*.spec.ts` files in `api/src/`
- Critical services (auth, AI, content) have no test coverage
- **Fix:** Add unit tests for at least AuthService, UsersService, ContentService, AIService

### 2.3 No email/OTP delivery service

- Password reset flow has `send-otp` endpoint but there is no email provider (Nodemailer, SendGrid, Resend, etc.) configured
- OTP likely only logs to console or throws
- **Fix:** Integrate an email service (Resend or SendGrid) and implement OTP email templates

### 2.4 No file upload/storage service

- `POST /users/avatar` endpoint exists but there is no cloud storage (S3, Cloudinary, etc.) configured
- **Fix:** Integrate Cloudinary or AWS S3 for avatar and content media uploads

### 2.5 Organizations module is incomplete

- `Organization` entity exists in [api/src/organizations/](api/src/organizations/) but there is no controller, service, or module exposing it
- No multi-tenancy or team features are functional
- **Fix:** Either implement the organizations module or remove the dead entity

### 2.6 Social media posting is not implemented

- Platform connections can be created/stored in DB, but there is no actual integration with Instagram, Facebook, WhatsApp, or Google Business APIs
- Content "publish" endpoint likely just changes status without real posting
- **Fix:** This is a major feature gap -- implement at minimum one platform (e.g., Instagram Graph API via Meta Business SDK)

---

## PRIORITY 3: Infrastructure & DevOps

### 3.1 No CI/CD pipeline

- No `.github/workflows/` or any automated pipeline
- No automated testing, linting, or deployment on PR/push
- **Fix:** Create GitHub Actions workflows for: lint + typecheck, test, build, deploy

### 3.2 No `.env.example` file

- New developers have no reference for required environment variables
- 80+ env vars in `api/.env` with no documentation of which are required vs optional
- **Fix:** Create `.env.example` files for both root and `api/` with all required vars and comments

### 3.3 No docker-compose for local development

- Local dev requires manual PostgreSQL setup
- **Fix:** Add `docker-compose.yml` with PostgreSQL + optional pgAdmin services

### 3.4 No caching layer

- No Redis or in-memory cache for frequently accessed data (user profiles, AI model lists, etc.)
- **Fix:** Add `@nestjs/cache-manager` with Redis for production, in-memory for dev

---

## PRIORITY 4: Code Quality & Reliability

### 4.1 No structured logging

- Using basic `NestJS Logger` (console output only)
- No log levels, no JSON format, no log aggregation support
- **Fix:** Integrate Pino or Winston with structured JSON logging, request correlation IDs

### 4.2 No React error boundaries

- Frontend has no error boundaries; unhandled component errors crash the entire app
- **Fix:** Add error boundaries at the layout level and per-page level

### 4.3 DB_SYNCHRONIZE may be enabled in production

- TypeORM `synchronize: true` can cause data loss in production
- Need to verify [api/src/config/database.config.ts](api/src/config/database.config.ts) ensures `synchronize` is always `false` in production
- **Fix:** Ensure `synchronize` is explicitly `false` when `NODE_ENV=production`

### 4.4 Dual token storage adds complexity

- Tokens are stored in both `localStorage` (for API calls) and cookies (for middleware)
- This creates sync issues and a larger attack surface
- **Fix:** Consider consolidating to HttpOnly cookies for both, which also improves XSS protection

### 4.5 No input sanitization beyond validation

- `class-validator` validates shape/type but does not sanitize against stored XSS
- User-generated content (captions, business names) could contain malicious scripts
- **Fix:** Add `class-transformer` sanitization or a global sanitization pipe

---

## PRIORITY 5: Feature Enhancements

### 5.1 Add pagination to list endpoints

- `GET /content`, `GET /ai/models`, `GET /context/memories` etc. likely return all records
- **Fix:** Implement cursor-based or offset pagination with standardized response format

### 5.2 Add API response caching headers

- No `Cache-Control` or `ETag` headers on any responses
- **Fix:** Add appropriate cache headers for read-only endpoints

### 5.3 Add request logging middleware

- No request/response logging for debugging and monitoring
- **Fix:** Add Morgan or a custom NestJS interceptor for request logging with correlation IDs

### 5.4 Add Swagger API tags and descriptions

- Swagger docs exist but could be enhanced with better descriptions, examples, and response schemas
- **Fix:** Add `@ApiResponse`, `@ApiOperation`, `@ApiExample` decorators to all controllers

### 5.5 Add health check for AI gateway

- Health endpoint checks DB but not the AI gateway connectivity
- **Fix:** Add AI gateway health check to the health module

### 5.6 Mobile app initialization

- Capacitor is configured but `android/` and `ios/` directories don't exist
- **Fix:** Run `mobile:add:android` and `mobile:add:ios` when ready to test mobile builds

### 5.7 Add webhook support for platform events

- No webhook endpoints for receiving events from connected social media platforms
- Needed for real-time engagement tracking, comment notifications, etc.

### 5.8 Add data export functionality

- No way for users to export their content, analytics, or profile data
- Important for GDPR/data portability compliance

---

## Summary Scorecard


| Area           | Rating     | Key Issue                                         |
| -------------- | ---------- | ------------------------------------------------- |
| Security       | Needs Work | No Helmet, tokens in URL, public scheduler        |
| Testing        | Critical   | Zero unit tests, broken e2e                       |
| CI/CD          | Missing    | No pipelines at all                               |
| Auth           | Good       | JWT + OAuth works, but token handling can improve |
| API Design     | Good       | RESTful, Swagger docs, proper DTOs                |
| Frontend       | Good       | Clean architecture, mobile-first                  |
| Database       | Good       | Proper migrations, multi-env support              |
| AI Integration | Good       | Gateway pattern, model selection, feedback loop   |
| DevOps         | Needs Work | No compose, no env example, no caching            |
| Logging        | Needs Work | No structured logging                             |


