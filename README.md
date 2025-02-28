# DashMetric - Check-In Dashboard Web Application

DashMetric is a Next.js 14 application designed to analyze and visualize check-in data from uploaded files. It allows users to generate actionable insights, customize dashboards, and share reports.

## Features

- **File Upload & Processing**: Upload CSV, Excel, or JSON files with drag-and-drop support
- **Dynamic Dashboards**: Create customizable dashboards with multiple visualization types
- **Data Visualization**: Bar charts, line charts, pie charts, area charts, scatter plots, and tables
- **User Roles & Permissions**: Admin, Manager, and User roles with appropriate access controls
- **Dashboard Sharing**: Share dashboards with other users
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, ShadCN UI, Recharts
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth

## Project Status

This project is currently at **Tollgate 1: Core Infrastructure and File Upload**. See the [documentation](docs/docs.md) for detailed implementation status.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dashmetric.git
   cd dashmetric
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database connection string and other environment variables.

5. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

The application uses Prisma ORM with PostgreSQL. To set up the database:

1. Make sure you have PostgreSQL installed and running.
2. Update the `DATABASE_URL` in your `.env` file.
3. Run migrations to create the database schema:
   ```bash
   npx prisma migrate dev
   ```

## Usage

### File Upload

1. Navigate to the dashboard page.
2. Click on "Upload File" button.
3. Drag and drop your CSV, Excel, or JSON file, or click to select a file.
4. After upload, configure the data mapping on the configuration page.
5. Create a dashboard with the uploaded data.

### Dashboard Creation

1. After configuring your dataset, select the visualizations you want to include.
2. Choose the chart types and data fields for each visualization.
3. Save your dashboard configuration.
4. View and interact with your dashboard.

### Sharing Dashboards

1. Open a dashboard you want to share.
2. Click on the "Share" button.
3. Enter the email address of the user you want to share with.
4. The user will be able to access the shared dashboard.

## Development

### Project Structure

```
dashmetric/
├── docs/                  # Documentation
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── dataset/       # Dataset pages
│   │   └── ...            # Other pages
│   ├── components/        # React components
│   ├── lib/               # Utility functions and libraries
│   └── ...
├── uploads/               # Uploaded files (not tracked in git)
└── ...
```

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth](https://next-auth.js.org/)
