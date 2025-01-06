# Requirements

## General Requirements

- Develop a web application using Next.js 14 and Prisma ORM.
- Use PostgreSQL hosted on Neon.tech as the database.
- Implement dark and light mode themes with a toggle using a moon and sun icon.
- Ensure a sleek, professional, corporate-style UI.
- Role-Based Access Control (RBAC) for user management and permissions.

## Functional Features

### User Management

- Users can:
  - Create accounts with email, name, and password.
  - Log in using local authentication.
  - Access dashboard functionality based on assigned roles.

### Dashboard Management

- Dashboards should:
  - Allow users to enter data for specific metrics.
  - Enable other users with appropriate roles to manage dashboard metrics.

### Tabulation and Reports

- Include:
  - Daily tabulation for tracking metrics.
  - Weekly tabulation for longer-term analysis.
  - Summary reports page with options to view, export, or print reports.

### Graphs and Charts

- Support:
  - Designing dashboards to display metrics visually.
  - Displaying intuitive and customizable graphs and charts.

## User Roles and Permissions

- **Admin**: Full access to user management, dashboard creation, and metric configuration.
- **Manager**: Access to manage dashboards and review metrics.
- **User**: Limited access to input data and view dashboards.

## UI/UX Requirements

- Intuitive interface for both daily and weekly tracking.
- Consistent design with a corporate feel.
- Responsive layout for mobile and desktop devices.

### Theming

- Implement a toggle for dark and light modes.
- Use Tailwind CSS with theme-aware classes for consistent styling (e.g., `bg-background`, `text-foreground`).

## Backend Requirements

- Prisma ORM for database interactions.
- Schema:
  - Users table with fields for authentication and roles.
  - Dashboards table to store configuration and assigned users.
  - Metrics table to track input data.
  - Tabulations table for daily and weekly summaries.

## Deployment

- Deploy the application on a suitable hosting platform (e.g., Vercel or a similar service compatible with Next.js and Prisma).
- Use Neon.tech for database hosting.

## Documentation

- Include detailed markdown documentation for:
  - Database schema.
  - API endpoints.
  - Frontend and backend workflows.
  - User guides for administrators and end users.

## Milestones

### 1. Setup and Authentication

- [ ] Initialize Next.js 14 project with Tailwind CSS.
- [ ] Configure Prisma with Neon.tech PostgreSQL database.
- [ ] Set up NextAuth for authentication with email/password login.
- [ ] Create `Users` table in Prisma schema and set up migrations.
- [ ] Implement user registration and login functionality.

### 2. Theming and UI/UX

- [ ] Design and implement dark/light mode toggle with moon/sun icon.
- [ ] Create a sleek and professional corporate-style theme.
- [ ] Build responsive layouts for mobile and desktop.

### 3. Dashboard and Metrics

- [ ] Create `Dashboards` and `Metrics` tables in Prisma schema.
- [ ] Develop dashboard creation and management interface.
- [ ] Implement metric input and management functionality.

### 4. Tabulation and Reporting

- [ ] Create `Tabulations` table in Prisma schema for daily and weekly summaries.
- [ ] Design daily and weekly tabulation interfaces.
- [ ] Build a summary reports page with export and print options.

### 5. Graphs and Charts

- [ ] Integrate a library for graphs and charts (e.g., Chart.js, D3.js).
- [ ] Enable visualization of metrics on dashboards.

### 6. RBAC and Permissions

- [ ] Define roles and permissions in Prisma schema.
- [ ] Implement RBAC logic in the backend.
- [ ] Restrict features based on user roles (Admin, Manager, User).

### 7. Deployment and Testing

- [ ] Deploy the application to a suitable hosting platform.
- [ ] Perform thorough testing for functionality, responsiveness, and security.

### 8. Documentation

- [ ] Write detailed markdown documentation for the project.
- [ ] Include database schema, API endpoints, workflows, and user guides.
