# Customer Support Ticket Management System

This project is a Customer Support Ticket Management System developed as part of a 5-day technical assignment.

It allows support agents to create, assign, update, and manage customer support tickets. The system also includes a dashboard to monitor ticket status and overdue tickets.

## Tech Stack

- React.js
- React Router
- Tailwind CSS
- Node.js
- Express.js
- MySQL

## Requirements

- Node.js 18+
- MySQL
- MySQL Workbench

## Setup

### 1. Clone the project

```bash
git clone <repo-url>
cd ticket-management-system
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ticket_management
PORT=5000
```

### 3. Frontend

```bash
cd frontend
npm install
```

## Database Setup

Open MySQL Workbench and run:

```text
database/schema.sql
```

Then run:

```text
database/seed.sql
```

The seed file contains the sample data required to run the application.

## Run the Project

### Backend

From the `backend` folder:

```bash
npm run dev
```

Backend:

`http://localhost:5000`

### Frontend

From the `frontend` folder:

```bash
npm run dev
```

Frontend:

`http://localhost:5173`

## Features

- Create support tickets
- View ticket details
- Update ticket details
- Search tickets
- Filter tickets
- Sort tickets
- Assign tickets to agents
- Change ticket status
- Add comments
- View ticket history
- Dashboard with ticket statistics
- Overdue ticket tracking
- Server-side pagination

## Ticket Priority and SLA

Each ticket has an SLA based on its priority.

| Priority | SLA      |
| -------- | -------- |
| LOW      | 72 hours |
| MEDIUM   | 48 hours |
| HIGH     | 24 hours |
| URGENT   | 8 hours  |

The SLA due date is calculated on the backend when a ticket is created.

Tickets that pass their due date are shown as overdue on the dashboard.

## Ticket Status

The ticket status follows this workflow:

`OPEN` → `IN_PROGRESS` → `WAITING_FOR_CUSTOMER` → `RESOLVED` → `CLOSED`

The backend validates status changes and prevents invalid transitions.

Once a ticket is closed, it cannot be edited, reassigned, or moved to another status.

## API Endpoints

### Tickets

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/tickets`                | Get tickets              |
| GET    | `/api/tickets/:id`            | Get ticket by ID         |
| POST   | `/api/tickets`                | Create ticket            |
| PUT    | `/api/tickets/:id`            | Update ticket            |
| PUT    | `/api/tickets/:id/status`     | Update ticket status     |
| PUT    | `/api/tickets/:id/assignment` | Assign or unassign agent |
| GET    | `/api/tickets/:id/comments`   | Get comments             |
| POST   | `/api/tickets/:id/comments`   | Add comment              |
| GET    | `/api/tickets/:id/history`    | Get ticket history       |

### Other

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/customers`  | Get customers      |
| GET    | `/api/users`      | Get agents         |
| GET    | `/api/categories` | Get categories     |
| GET    | `/api/dashboard`  | Get dashboard data |

## Project Structure

```text
ticket-management-system
│
├── backend
├── frontend
├── database
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

## Extra Features

- **SLA closing soon warning** - tickets due within the next 2 hours show a "SLA closing soon" indicator, in addition to the required overdue indicator. This gives agents a heads-up before a ticket actually breaches its SLA.
- **Closed ticket protection** - once a ticket is CLOSED, editing, reassignment, and status changes are blocked on both the frontend and the backend, not just hidden in the UI.
- **Overdue indicator on the tickets list** - not just the details page, so overdue tickets are visible at a glance while browsing the full list.

## Notes

- Authentication is not included because it was not part of the assignment requirements.
- Customers and agents are added through the seed data.
- Since there is no login system, the comment form has a `Post as` option.
- SQL queries use parameters to help prevent SQL injection.
- Ticket pagination is handled on the backend.
- Closed tickets are locked from further changes.

## Known Limitations

- No automated tests
- No authentication or authorization
- Concurrent ticket updates are not handled
