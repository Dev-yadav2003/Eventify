# Auth Module

This backend uses JWT-based authentication with PostgreSQL-backed users.

## Files

- `src/controllers/authController.js`: register, login, current-user handlers
- `src/middleware/authMiddleware.js`: bearer-token protection and role checks
- `src/routes/authRoutes.js`: auth endpoints
- `src/models/User.js`: user queries and password hashing
- `src/utils/generateToken.js`: JWT creation

## Endpoints

### `POST /api/auth/register`

Creates a new user.

Request body:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "attendee"
}
```

Behavior:

- rejects duplicate emails
- hashes password before saving
- returns created user plus JWT token

### `POST /api/auth/login`

Logs in an existing user.

Request body:

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

Behavior:

- validates email/password
- returns user plus JWT token

### `GET /api/auth/me`

Returns the authenticated user.

Headers:

```http
Authorization: Bearer <token>
```

## Error responses

- `400`: user already exists
- `401`: invalid email/password or invalid token
- `403`: forbidden by role

## Notes

- Registration no longer auto-logs the user in on the frontend.
- After register, the frontend redirects to login and can prefill the new credentials once.
- Tokens are signed with `JWT_SECRET` from [`.env`](d:/Dashboard/backend/.env).
