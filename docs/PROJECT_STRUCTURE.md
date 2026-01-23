# 📂 Project Structure Map

This document provides a detailed breakdown of the **Cyber Forensic LAB** codebase. It helps developers locate logic and understand how different parts of the application interact.

---

## 🌲 Root Directory

| File / Folder | Type | Description |
| :--- | :--- | :--- |
| **`api/`** | 📁 Dir | Contains Serverless Functions (API Endpoints). |
| **`assets/`** | 📁 Dir | Static assets like images, icons, and fonts. |
| **`docs/`** | 📁 Dir | Project documentation (Guides, Overview, Troubleshooting). |
| **`lib/`** | 📁 Dir | Shared utility libraries (e.g., Database connection). |
| **`models/`** | 📁 Dir | Mongoose Data Models (Schemas). |
| **`scripts/`** | 📁 Dir | Utility scripts (e.g., Database seeding). |
| **`index.html`** | 📄 File | **Entry Point**. The main single-page application (SPA) shell. |
| **`script.js`** | 📄 File | **Core Logic**. Handles UI state, event listeners, and DOM manipulation. |
| **`style.css`** | 📄 File | **Global Styles**. CSS variables, dark theme tokens, and component styles. |
| **`server.js`** | 📄 File | **Local Server**. Custom Express server simulating Vercel's environment. |
| **`api.service.js`**| 📄 File | **API Client**. specialized fetch wrapper for communicating with the backend. |

---

## 🔌 API Layer (`/api`)

These files act as "Serverless Functions". When deployed to Vercel, each file becomes a route. Locally, `server.js` routes requests to them.

*   **`login.js`**: Handles user authentication. Checks credentials against the `User` collection.
*   **`scenarios.js`**: GETs available lab scenarios and POSTs new ones (Faculty only).
*   **`submissions.js`**:
    *   `POST`: Student submits a flag/report.
    *   `PUT`: Faculty grades a submission.
*   **`activity.js`**: Logs user actions for audit trails.
*   **`stats.js`**: Aggregates data for the dashboard charts (completion rates, etc.).
*   **`students.js`**: Fetches list of enrolled students (Faculty view).

---

## 🗄️ Database Models (`/models`)

We use **Mongoose** schemas to define the shape of our data in MongoDB.

*   **`User.js`**:
    *   Stores: `name`, `email`, `role` ("student" | "faculty"), `universityId`.
    *   Purpose: Authentication and profile management.
*   **`Scenario.js`**:
    *   Stores: `title`, `difficulty`, `description`, `objectives` (array).
    *   Purpose: Defines the forensic challenges available to students.
*   **`Submission.js`**:
    *   Stores: `studentId`, `scenarioId`, `submittedAt`, `status` ("Pending" | "Graded"), `grade`.
    *   Purpose: Tracks student progress and faculty grading.

---

## 🛠️ Key Utilities

### `lib/dbConnect.js`
A specialized database connection handler.
*   **Optimization**: Caches the MongoDB connection to prevent creating new connections on every API hot-reload (crucial for Serverless environments).

### `scripts/seed.js`
A "Reset Button" for your database.
*   **Usage**: Run `node scripts/seed.js` to wipe the database and repopulate it with default users (Alex Johnson, Sarah Connor) and demo scenarios.

### `Start_Lab.bat`
A Windows Batch script for convenience.
*   **Action**: Opens a specific URL and runs `npm start` in a new window.
