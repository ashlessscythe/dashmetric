# Check-In Dashboard Web Application

## Overview

The Check-In Dashboard Web Application is a **Next.js 14** application designed to analyze and visualize check-in data from uploaded files. It allows users to generate actionable insights, customize dashboards, and share reports.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, ShadCN UI, Recharts
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL hosted on Neon.tech
- **Deployment**: Vercel or a similar service
- **Authentication**: NextAuth for user authentication and role management

## Implementation Status

### 🚩 TOLLGATE 1: Core Infrastructure and File Upload (CURRENT) 🚩

The following components have been implemented:

- **Database Schema**:

  - Updated Prisma schema with models for User, Dashboard, Visualization, UploadedFile, Dataset, and DataEntry
  - Added relationships between models
  - Created migration for the updated schema

- **File Upload System**:

  - Created file upload component with drag-and-drop functionality
  - Implemented API route for file uploads
  - Added file parsing for CSV, Excel, and JSON formats
  - Automatic data structure detection and schema generation

- **Dataset Configuration**:

  - Created dataset configuration page
  - Implemented field mapping interface
  - Added visualization type selection

- **Dashboard Visualization**:

  - Implemented dashboard view component
  - Added support for multiple visualization types (Bar, Line, Pie, Area, Scatter, Table)
  - Created responsive layout for visualizations

- **API Routes**:
  - `/api/upload` - Handles file uploads and parsing
  - `/api/dashboards` - Manages dashboard CRUD operations

### 🚩 TOLLGATE 2: Dashboard Management and User Experience (NEXT) 🚩

The following components are planned for the next phase:

- **Dashboard Management**:

  - Dashboard listing page
  - Dashboard editing interface
  - Dashboard sharing functionality

- **User Experience Enhancements**:

  - Improved error handling
  - Loading states and animations
  - Tooltips and help text

- **Advanced Visualization Features**:

  - Date range filtering
  - Dynamic data sorting
  - Custom color schemes
  - Saved view presets

- **User Management**:
  - User role management
  - Permission-based access control
  - User profile settings

## Features

### 1. File Upload & Data Processing

- **File Input**: Users can upload CSV, Excel, or JSON files.
- **Drag & Drop**: Supports drag-and-drop file uploads.
- **Data Parsing**: Extracts relevant data fields and structures them for visualization.
- **Configuration Interface**:
  - After upload, users can select which data points to visualize
  - Users can choose which columns map to which metrics
  - Users can select the type of graphs to generate

### 2. Dashboard Generation

- **Dynamic Dashboards**:
  - Users can create multiple dashboards
  - Each dashboard is configurable based on selected data points
- **Graph & Chart Options**:
  - Bar Chart, Line Chart, Pie Chart, Area Chart, Scatter Plot, and Table views
  - Users can adjust the visualization type per dataset
- **Filtering & Sorting**:
  - Filter by date range, categories, or custom attributes
  - Sort data dynamically in tables
- **Saving & Sharing Dashboards**:
  - Users can save dashboards to view later
  - Dashboards can be shared with other users

### 3. User Roles & Permissions

- **Admin**:
  - Full access to dashboard creation and user management
- **Manager**:
  - Can create and edit dashboards
  - Can review and approve data insights
- **User**:
  - Can upload files and generate personal dashboards
  - Can view shared dashboards

### 4. Theming & UI/UX

- **Corporate-style UI** with dark and light mode toggle
- **Responsive Design** for mobile and desktop
- **Tab-based Navigation** within dashboards:
  - Daily Check-Ins
  - Carrier Analysis
  - Hourly Trends
  - Weekly Reports
  - Month-to-Month Comparisons

## Database Schema

The application uses the following database schema:

```prisma
// User model for authentication and roles
model User {
  id            String      @id @default(cuid())
  name          String
  email         String      @unique
  password      String
  role          UserRole    @default(PENDING)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  dashboards    Dashboard[]
  uploadedFiles UploadedFile[]
  sharedDashboards DashboardShare[] @relation("SharedWith")

  @@map("users")
}

// Dashboard model for storing visualization configurations
model Dashboard {
  id          String    @id @default(cuid())
  name        String
  description String?
  isPublic    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  visualizations Visualization[]
  datasetId   String?
  dataset     Dataset?  @relation(fields: [datasetId], references: [id], onDelete: SetNull)
  shares      DashboardShare[]

  @@map("dashboards")
}

// Visualization model for storing chart configurations
model Visualization {
  id          String    @id @default(cuid())
  name        String
  description String?
  type        ChartType
  config      Json      // Stores chart configuration (axes, colors, etc.)
  dataConfig  Json      // Stores data mapping configuration
  position    Int       // Position in the dashboard layout
  size        String    @default("md") // Size of the visualization (sm, md, lg, xl)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  dashboardId String
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id], onDelete: Cascade)

  @@map("visualizations")
}

// UploadedFile model for storing file metadata
model UploadedFile {
  id          String    @id @default(cuid())
  filename    String
  originalName String
  mimeType    String
  size        Int
  createdAt   DateTime  @default(now())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  datasets    Dataset[]

  @@map("uploaded_files")
}

// Dataset model for storing processed data
model Dataset {
  id          String    @id @default(cuid())
  name        String
  description String?
  data        Json      // Stores the processed data
  schema      Json      // Stores the schema of the data
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  fileId      String
  file        UploadedFile @relation(fields: [fileId], references: [id], onDelete: Cascade)
  dashboards  Dashboard[]
  dataEntries DataEntry[]

  @@map("datasets")
}

// DataEntry model for storing individual data points
model DataEntry {
  id          String    @id @default(cuid())
  date        DateTime
  carrier     String?
  dispatcher  String?
  hour        Int?
  data        Json      // Stores the raw data entry
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  datasetId   String
  dataset     Dataset   @relation(fields: [datasetId], references: [id], onDelete: Cascade)

  @@map("data_entries")
}
```

## API Routes

The application provides the following API routes:

- **Authentication**:

  - `/api/auth/[...nextauth]` - NextAuth authentication endpoints
  - `/api/auth/signup` - User registration

- **File Upload**:

  - `/api/upload` - Handles file uploads and data processing

- **Dashboard Management**:
  - `/api/dashboards` - CRUD operations for dashboards
  - `/api/dashboards/[id]` - Operations on a specific dashboard
  - `/api/dashboards/[id]/share` - Sharing dashboards with other users

## Next Steps

- Complete the dashboard listing page
- Implement dashboard editing functionality
- Add dashboard sharing interface
- Enhance visualization options with more chart types
- Implement advanced filtering and sorting
- Add user management interface for admins

---
