# API Documentation

Base URL: `http://localhost:3001`

## Configuration

### Default Admin Account

On startup, the server automatically creates an admin account if no user with the configured email exists. Set the following environment variables before the first launch:

| Variable         | Description                       | Default             |
| ---------------- | --------------------------------- | ------------------- |
| `ADMIN_EMAIL`    | Admin account email               | `admin@example.com` |
| `ADMIN_USERNAME` | Admin account display name        | `admin`             |
| `ADMIN_PASSWORD` | Admin account plain-text password | `changeme`          |

If any of these variables are not set, the seeding step is skipped. The seed is **idempotent** — restarting the server will not create a duplicate account.

> **Note:** Change `ADMIN_PASSWORD` to a strong password before the first launch.

---

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Roles:

- `user` — default role, assigned on registration
- `admin` — required for creating/updating/deleting articles and tags

---

## Auth

### POST /api/auth/register

Register a new user.

**Request body**

| Field      | Type   | Required | Description         |
| ---------- | ------ | -------- | ------------------- |
| `email`    | string | yes      | Unique email        |
| `username` | string | yes      | Display name        |
| `password` | string | yes      | Plain-text password |

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "secret123"
}
```

**Response `201 Created`**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "role": "user"
}
```

**Errors**

| Status | Message                                     |
| ------ | ------------------------------------------- |
| 400    | `Email, username and password are required` |
| 409    | `Email already in use`                      |
| 500    | `Internal server error`                     |

---

### POST /api/auth/login

Authenticate and receive a JWT token.

**Request body**

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | yes      |
| `password` | string | yes      |

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response `200 OK`**

```json
{
  "token": "<jwt_token>"
}
```

The token expires after **24 hours**.

**Errors**

| Status | Message                           |
| ------ | --------------------------------- |
| 400    | `Email and password are required` |
| 401    | `Invalid credentials`             |
| 500    | `Internal server error`           |

---

## Articles

### GET /api/articles

List articles with pagination and filtering. Public.

**Query parameters**

| Param   | Type   | Default | Description                                             |
| ------- | ------ | ------- | ------------------------------------------------------- |
| `page`  | number | `1`     | Page number (min: 1)                                    |
| `limit` | number | `10`    | Items per page (min: 1, max: 100)                       |
| `sort`  | string | `DESC`  | Sort by `createdAt`: `ASC` or `DESC`                    |
| `title` | string | —       | Filter by title (case-insensitive partial match)        |
| `tags`  | string | —       | Filter by tag names, comma-separated (e.g. `tech,news`) |

**Response `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Hello World",
      "content": "Article content...",
      "createdAt": "2026-03-24T10:00:00.000Z",
      "updatedAt": "2026-03-24T10:00:00.000Z",
      "author": {
        "id": 1,
        "email": "admin@example.com",
        "username": "admin",
        "role": "admin",
        "createdAt": "2026-03-20T08:00:00.000Z"
      },
      "tags": [{ "id": 1, "name": "tech" }]
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

### GET /api/articles/:id

Get a single article with its comments. Public.

**Path parameters**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| `id`  | number | Article ID  |

**Response `200 OK`**

```json
{
  "id": 1,
  "title": "Hello World",
  "content": "Article content...",
  "createdAt": "2026-03-24T10:00:00.000Z",
  "updatedAt": "2026-03-24T10:00:00.000Z",
  "author": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "role": "admin",
    "createdAt": "2026-03-20T08:00:00.000Z"
  },
  "tags": [{ "id": 1, "name": "tech" }],
  "comments": [
    {
      "id": 3,
      "content": "Great article!",
      "createdAt": "2026-03-24T11:00:00.000Z",
      "user": {
        "id": 2,
        "email": "user@example.com",
        "username": "johndoe",
        "role": "user",
        "createdAt": "2026-03-21T09:00:00.000Z"
      }
    }
  ]
}
```

**Errors**

| Status | Message                 |
| ------ | ----------------------- |
| 404    | `Article not found`     |
| 500    | `Internal server error` |

---

### POST /api/articles

Create a new article. Requires **admin** role.

**Headers:** `Authorization: Bearer <token>`

**Request body**

| Field     | Type     | Required | Description                         |
| --------- | -------- | -------- | ----------------------------------- |
| `title`   | string   | yes      | Article title                       |
| `content` | string   | yes      | Article body                        |
| `tagIds`  | number[] | no       | Array of existing tag IDs to attach |

```json
{
  "title": "My New Article",
  "content": "Article body goes here...",
  "tagIds": [1, 2]
}
```

**Response `201 Created`**

Returns the created article object (same shape as `GET /api/articles/:id` minus comments).

**Errors**

| Status | Message                           |
| ------ | --------------------------------- |
| 400    | `Title and content are required`  |
| 401    | `Unauthorized` / `User not found` |
| 403    | `Forbidden`                       |
| 500    | `Internal server error`           |

---

### PUT /api/articles/:id

Update an existing article. Requires **admin** role.

**Headers:** `Authorization: Bearer <token>`

**Path parameters**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| `id`  | number | Article ID  |

**Request body** (all fields optional)

| Field     | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `title`   | string   | New title                                       |
| `content` | string   | New content                                     |
| `tagIds`  | number[] | Replaces all tags; pass `[]` to remove all tags |

```json
{
  "title": "Updated Title",
  "tagIds": [3]
}
```

**Response `200 OK`**

Returns the updated article object.

**Errors**

| Status | Message                 |
| ------ | ----------------------- |
| 401    | `Unauthorized`          |
| 403    | `Forbidden`             |
| 404    | `Article not found`     |
| 500    | `Internal server error` |

---

### DELETE /api/articles/:id

Delete an article. Requires **admin** role.

**Headers:** `Authorization: Bearer <token>`

**Path parameters**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| `id`  | number | Article ID  |

**Response `200 OK`**

```json
{
  "message": "Article deleted"
}
```

**Errors**

| Status | Message                 |
| ------ | ----------------------- |
| 401    | `Unauthorized`          |
| 403    | `Forbidden`             |
| 404    | `Article not found`     |
| 500    | `Internal server error` |

---

## Comments

### GET /api/articles/:id/comments

Get all comments for an article, sorted newest first. Public.

**Path parameters**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| `id`  | number | Article ID  |

**Response `200 OK`**

```json
[
  {
    "id": 3,
    "content": "Great article!",
    "createdAt": "2026-03-24T11:00:00.000Z",
    "user": {
      "id": 2,
      "email": "user@example.com",
      "username": "johndoe",
      "role": "user",
      "createdAt": "2026-03-21T09:00:00.000Z"
    }
  }
]
```

**Errors**

| Status | Message                 |
| ------ | ----------------------- |
| 404    | `Article not found`     |
| 500    | `Internal server error` |

---

### POST /api/articles/:id/comments

Add a comment to an article. Requires authentication (any role).

**Headers:** `Authorization: Bearer <token>`

**Path parameters**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| `id`  | number | Article ID  |

**Request body**

| Field     | Type   | Required |
| --------- | ------ | -------- |
| `content` | string | yes      |

```json
{
  "content": "Really enjoyed this read!"
}
```

**Response `201 Created`**

```json
{
  "id": 5,
  "content": "Really enjoyed this read!",
  "createdAt": "2026-03-24T12:00:00.000Z",
  "article": { "id": 1, "title": "Hello World", "...": "..." },
  "user": { "id": 2, "username": "johndoe", "...": "..." }
}
```

**Errors**

| Status | Message                           |
| ------ | --------------------------------- |
| 400    | `Content is required`             |
| 401    | `Unauthorized` / `User not found` |
| 404    | `Article not found`               |
| 500    | `Internal server error`           |

---

## Tags

### GET /api/tags

List all tags. Public.

**Response `200 OK`**

```json
[
  { "id": 1, "name": "tech" },
  { "id": 2, "name": "news" }
]
```

---

### POST /api/tags

Create a new tag. Requires **admin** role.

**Headers:** `Authorization: Bearer <token>`

**Request body**

| Field  | Type   | Required |
| ------ | ------ | -------- |
| `name` | string | yes      |

```json
{
  "name": "science"
}
```

**Response `201 Created`**

```json
{
  "id": 3,
  "name": "science"
}
```

**Errors**

| Status | Message                 |
| ------ | ----------------------- |
| 400    | `Tag name is required`  |
| 401    | `Unauthorized`          |
| 403    | `Forbidden`             |
| 409    | `Tag already exists`    |
| 500    | `Internal server error` |

---

## Users

### PATCH /api/users/:id/role

Change another user's role. Requires **admin** role. An admin cannot change their own role.

**Headers:** `Authorization: Bearer <token>`

**Path parameters**

| Param | Type   | Description |
| ----- | ------ | ----------- |
| `id`  | number | User ID     |

**Request body**

| Field  | Type   | Required | Description                    |
| ------ | ------ | -------- | ------------------------------ |
| `role` | string | yes      | Target role: `user` or `admin` |

```json
{
  "role": "admin"
}
```

**Response `200 OK`**

```json
{
  "id": 2,
  "email": "user@example.com",
  "username": "johndoe",
  "role": "admin",
  "createdAt": "2026-03-24T09:00:00.000Z"
}
```

**Errors**

| Status | Message                                     |
| ------ | ------------------------------------------- |
| 400    | `Role is required`                          |
| 400    | `Invalid role. Allowed values: user, admin` |
| 400    | `Cannot change your own role`               |
| 401    | `Unauthorized`                              |
| 403    | `Forbidden`                                 |
| 404    | `User not found`                            |
| 500    | `Internal server error`                     |
