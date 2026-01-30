# Better Auth - Integration Guide

## Overview

This guide explains how Better Auth is integrated into the Nizron Marketplace for authentication and authorization.

---

## Environment Setup

Add these to your `.env` file:

```bash
# Generate a 32+ character secret
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-characters

# Base URL of your app
BETTER_AUTH_URL=http://localhost:3000
```

---

## Auth Endpoints

Better Auth automatically mounts these endpoints at `/api/auth/*`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-up/email` | POST | Register with email/password |
| `/api/auth/sign-in/email` | POST | Login with email/password |
| `/api/auth/sign-out` | POST | Logout (invalidates session) |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/user` | GET | Get current user |

---

## Using in Controllers

### Public Endpoints

```typescript
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Get()
@AllowAnonymous()
findAll() { ... }
```

### Protected Endpoints (Default)

All routes are protected by default. No decorator needed.

```typescript
@Get('me')
getProfile(@Session() session: UserSession) {
  return session.user;
}
```

### Role-Based Access

```typescript
import { RolesGuard, Roles } from '../../common';

@Post()
@UseGuards(RolesGuard)
@Roles('Seller', 'Admin')
create(@Body() dto: CreateDto) { ... }
```

---

## User Roles

| Role | Access |
|------|--------|
| `Buyer` | Default role, can browse and purchase |
| `Seller` | Can create listings and manage orders |
| `Admin` | Full access to all resources |

---

## Database Tables

Better Auth uses these tables (auto-migrated):

| Table | Purpose |
|-------|---------|
| `session` | Active user sessions |
| `account` | OAuth accounts and passwords |
| `verification` | Email verification tokens |

---

## Client Integration

### JavaScript Example

```typescript
// Sign up
const response = await fetch('/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
    name: 'John Doe',
  }),
});

// Sign in
const response = await fetch('/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123',
  }),
});

// Get session
const session = await fetch('/api/auth/session', {
  credentials: 'include',
}).then(res => res.json());

// Sign out
await fetch('/api/auth/sign-out', {
  method: 'POST',
  credentials: 'include',
});
```

---

## Route Protection Summary

| Module | GET (List) | GET (One) | POST | PATCH | DELETE |
|--------|------------|-----------|------|-------|--------|
| Listings | Public | Public | Seller | Seller | Seller |
| Categories | Public | Public | Admin | Admin | Admin |
| Orders | Auth | Auth | Auth | Auth | Admin |
| Users | Admin | Auth | Public | Auth | Admin |
| Chat | Auth | Auth | Auth | Auth | Auth |

---

## Files Modified

| File | Changes |
|------|---------|
| `src/main.ts` | Disabled body parser for Better Auth |
| `src/app.module.ts` | Added AuthModule.forRoot() |
| `src/lib/auth.ts` | Better Auth instance with Drizzle |
| `src/common/*` | Roles decorator and guard |
| Controllers | Added @AllowAnonymous and @Roles |
