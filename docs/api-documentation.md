# API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this structure:

Success:
```json
{ "success": true, "data": {...} }
```

Error:
```json
{ "success": false, "message": "Error description" }
```

---

## Tickets

### GET /tickets
List tickets with pagination, search, filtering, and sorting.

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| search | string | No | Searches subject and customer name |
| status | string | No | OPEN, IN_PROGRESS, WAITING_FOR_CUSTOMER, RESOLVED, CLOSED |
| priority | string | No | LOW, MEDIUM, HIGH, URGENT |
| category | number | No | Category ID |
| agent | number | No | Agent (user) ID |
| sortBy | string | No | createdAt, dueDate, priority |
| sortOrder | string | No | asc, desc (default: desc) |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "subject": "Unable to login",
      "priority": "HIGH",
      "status": "OPEN",
      "due_date": "2026-08-14T10:00:00.000Z",
      "created_at": "2026-08-13T10:00:00.000Z",
      "customer_name": "Mohamed Rusdi",
      "agent_name": "Mohamed Rizwan",
      "category_name": "Technical"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 30, "totalPages": 3 }
}
```

---

### GET /tickets/:id
Get full details of a single ticket.

**Path Parameters:** `id` - Ticket ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1001,
    "subject": "Unable to login",
    "description": "Customer cannot access account after password reset",
    "customer_id": 1,
    "agent_id": 1,
    "category_id": 1,
    "priority": "HIGH",
    "status": "OPEN",
    "due_date": "2026-08-14T10:00:00.000Z",
    "created_at": "2026-08-13T10:00:00.000Z",
    "updated_at": "2026-08-13T10:00:00.000Z",
    "customer_name": "Mohamed Rusdi",
    "agent_name": "Mohamed Rizwan",
    "category_name": "Technical"
  }
}
```

**Error Response (404):**
```json
{ "success": false, "message": "Ticket not found" }
```

---

### POST /tickets
Create a new ticket. Due date is calculated automatically based on priority.

**Request Body:**
```json
{
  "subject": "Unable to login",
  "description": "Customer cannot access account",
  "customerId": 1,
  "categoryId": 1,
  "priority": "HIGH"
}
```

**Response (201):** Same shape as GET /tickets/:id

**Error Response (400):**
```json
{ "success": false, "message": "Subject is required" }
```

---

### PUT /tickets/:id
Update ticket details (subject, description, customer, category, priority).

**Path Parameters:** `id` - Ticket ID

**Request Body:** Same as POST /tickets

**Response (200):** Same shape as GET /tickets/:id

**Error Responses:**
- `400` - Validation failed
- `404` - Ticket not found
- `409` - Cannot edit a closed ticket

---

### DELETE /tickets/:id
Delete a ticket.

**Path Parameters:** `id` - Ticket ID

**Response (200):**
```json
{ "success": true, "message": "Ticket deleted successfully" }
```

**Error Response (404):**
```json
{ "success": false, "message": "Ticket not found" }
```

---

### PUT /tickets/:id/status
Update ticket status. Validates against allowed status transitions.

**Path Parameters:** `id` - Ticket ID

**Request Body:**
```json
{ "status": "IN_PROGRESS" }
```

**Response (200):** Updated ticket object

**Error Responses:**
- `400` - Status is required
- `404` - Ticket not found
- `409` - Invalid status transition (e.g. "Cannot change status from OPEN to CLOSED")

---

### PUT /tickets/:id/assignment
Assign, change, or unassign an agent.

**Path Parameters:** `id` - Ticket ID

**Request Body:**
```json
{ "agentId": 2 }
```
Pass `agentId: null` to unassign.

**Response (200):** Updated ticket object

**Error Response (409):**
```json
{ "success": false, "message": "Cannot change assignment on a closed ticket" }
```

---

### GET /tickets/:id/history
Get the status change history for a ticket.

**Path Parameters:** `id` - Ticket ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "old_status": "OPEN",
      "new_status": "IN_PROGRESS",
      "changed_at": "2026-08-13T11:00:00.000Z",
      "changed_by_name": null
    }
  ]
}
```

---

## Comments

### GET /tickets/:id/comments
Get all comments for a ticket, in chronological order.

**Path Parameters:** `id` - Ticket ID

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "comment": "Checking the account settings now",
      "created_at": "2026-08-13T11:00:00.000Z",
      "user_name": "Mohamed Rizwan"
    }
  ]
}
```

---

### POST /tickets/:id/comments
Add a comment to a ticket.

**Path Parameters:** `id` - Ticket ID

**Request Body:**
```json
{ "userId": 1, "comment": "Working on this now" }
```

**Response (201):**
```json
{ "success": true, "data": { "id": 6 } }
```

**Error Response (400):**
```json
{ "success": false, "message": "Comment is required" }
```

---

## Customers, Users, Categories

### GET /customers
Returns all customers.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Mohamed Rusdi", "email": "mohamed.rusdi@gmail.com", "phone": "+94771234567" }
  ]
}
```

### GET /users
Returns all support agents.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Mohamed Rizwan", "email": "mohamed.rizwan@gmail.com", "role": "agent" }
  ]
}
```

### GET /categories
Returns all ticket categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Technical" }
  ]
}
```

---

## Dashboard

### GET /dashboard
Returns overall ticket statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 30,
    "overdue": 3,
    "byStatus": [
      { "status": "OPEN", "count": 15 }
    ],
    "byPriority": [
      { "priority": "LOW", "count": 10 }
    ],
    "byCategory": [
      { "category": "Technical", "count": 12 }
    ]
  }
}
```

---

## Common Error Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Invalid request / validation failed |
| 404 | Resource not found |
| 409 | Conflict (e.g. invalid status transition, editing a closed ticket) |
| 500 | Internal server error |