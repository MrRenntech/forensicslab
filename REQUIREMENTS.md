# ForensicLab - System Requirements & Setup

## Prerequisites

To run the ForensicLab environment, you need the following installed:

1.  **Node.js** (v18 or higher)
    *   Download: [nodejs.org](https://nodejs.org/)
2.  **MongoDB Atlas Account** (or local MongoDB)
    *   Connection string required in `.env` file.

## Dependencies

The project relies on the following npm packages (see `package.json` for details):

*   **Runtime**:
    *   `express`: Web server framework.
    *   `mongoose`: MongoDB object modeling.
    *   `dotenv`: Environment variable management.
    *   `cors`: Cross-Origin Resource Sharing (optional, handled by Express).

## Installation

1.  Clone the repository:
    ```bash
    git clone <repo-url>
    cd forensiclab
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    *   Rename `.env.example` to `.env`.
    *   Update `MONGODB_URI` with your connection string.

## Running the Application

Double-click **`Start_Lab.bat`** (Windows) or run:

```bash
node server.js
```

Access the lab at: `http://localhost:3000`
