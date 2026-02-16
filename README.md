# Enterprise QMS MVP

A MERN stack Enterprise Quality Management System (QMS) MVP.

## Modules

- **Authentication**: JWT-based auth with Roles (Admin, Quality Manager, Employee).
- **Dashboard**: High-level KPIs and Charts.
- **Documents**: Upload and Manage Version-controlled documents (PDF).
- **CAPA**: Corrective and Preventive Actions management.
- **Risk**: FMEA Risk Assessment with RPN calculation.
- **Activity Log**: Audit trails for compliance.

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB (Running locally on `mongodb://localhost:27017` or update `.env`)

### Installation

1.  **Clone/Open Project**

    ```bash
    cd Qmics
    ```

2.  **Server Setup**

    ```bash
    cd server
    npm install
    # Create uploads folder if not exists
    mkdir uploads
    # Seed Data (Optional)
    node seed.js
    # Start Server
    npm run dev
    ```

3.  **Client Setup**

    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access App**
    Open `http://localhost:5173`

### Default Users

- **Admin**: `admin@qmics.com` / `password123`
- **Manager**: `manager@qmics.com` / `password123`
- **Employee**: `employee@qmics.com` / `password123`

## Tech Stack

- MongoDB, Express, React, Node.js
- Tailwind CSS, Recharts, Lucide React
- Multer, JWT, Bcrypt
