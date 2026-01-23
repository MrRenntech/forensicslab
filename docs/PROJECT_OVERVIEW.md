# 🕵️‍♂️ Project Overview & Architecture

**Cyber Forensic LAB** is a full-stack educational simulation platform. It is designed to be **lightweight**, **portable**, and **cloud-ready**.

---

## 🏗️ Technical Architecture

The application uses a **Serverless-First** architecture. This means there is no monolithic backend server code that runs 24/7 in production. Instead, API endpoints are standalone functions.

### 🔄 The "Hybrid" Runtime Approach

One of the unique features of this project is how it handles different environments:

| Environment | Strategy | How it works |
| :--- | :--- | :--- |
| **Production (Vercel)** | **Serverless** | Vercel takes files in `/api` and deploys them as Lambda functions. `index.html` is served via CDN. |
| **Development (Local)** | **Express.js** | We use `server.js` to create a standard Node.js server. It manually "wires up" the files in `/api` to Express routes (e.g., `app.get('/api/login', loginHandler)`). |

**Why do this?**
*   It allows us to develop locally without internet or Vercel CLI tools.
*   It keeps the production deployment cost near zero (Serverless).
*   It ensures the code is modular and decoupled.

---

## 🧩 Component Deep Dive

### 1. The Frontend (`index.html` + `script.js`)
*   **SPA (Single Page Application)**: The page never reloads. We use JavaScript to hide/show `<div>` containers based on the current "Route" (Login vs Dashboard).
*   **Terminal Emulator**: The black box in the center of the screen isn't just a text box. It captures `keydown` events, parses the `Input String`, matches it against a `Command Registry` (in `script.js`), and renders HTML responses.
    *   *Example*: Typing `analyze file.enc` triggers a visual loading bar and then calls the backend if needed.

### 2. The Data Layer
*   **MongoDB Atlas**: We use a cloud-hosted MongoDB instance.
*   **Mongoose**: We use Mongoose for schema validation. This ensures a Student cannot be saved without a `universityId`, and a Submission must link to a valid `User`.

---

## 🚀 Workflow Lifecycle

1.  **Boot**: User opens the app. `script.js` checks for a stored Session Token.
2.  **Login**: User enters credentials.
    *   Frontend sends `GET /api/login?email=...`
    *   Backend verifies user in DB.
3.  **Simulation**: User enters the "Lab".
    *   `script.js` listens for commands.
    *   User types `submit flag{123}`.
4.  **Submission**:
    *   Frontend sends `POST /api/submissions`.
    *   Backend creates a `Submission` document.
    *   Socket/Polling updates the Faculty Dashboard instantly.

---

## 🛠️ Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Server-side execution environment. |
| **Framework** | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) | Web server framework (Local Dev). |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | NoSQL database for flexible data storage. |
| **ODM** | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) | Object Data Modeling library for MongoDB. |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Pure web technologies for the user interface. |
