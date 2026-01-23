# 🕵️‍♂️ Project Overview - Cyber Forensic LAB

Welcome to the **Cyber Forensic LAB**, an interactive educational platform designed to simulate digital forensic scenarios. This project combines a robust backend with a sleek, terminal-style frontend to provide students and faculty with a realistic environment for learning and grading.

---

## 🏗️ Architecture

The application follows a classic **Client-Server-Database** architecture, optimized for simplicity and real-time interaction.

```mermaid
graph TD
    Client[🖥️ Client (Browser)]
    Server[⚙️ Server (Node.js/Express)]
    DB[(🗄️ Database (MongoDB Atlas))]

    Client -- "HTTP/REST API\n(Fetch)" --> Server
    Server -- "Mongoose" --> DB
    DB -- "JSON Data" --> Server
    Server -- "JSON Responses" --> Client

    subgraph Frontend [Frontend Layer]
    Client
    end

    subgraph Backend [Backend Layer]
    Server
    end

    subgraph Data [Data Layer]
    DB
    end
```

### 🧩 Core Components

1.  **Frontend (Vanilla JS + CSS)**
    *   **No Frameworks:** Built with pure HTML5, CSS3, and JavaScript (ES6 modules) for maximum performance and understanding of fundamentals.
    *   **Interactive Terminal:** A custom-built CLI interface running in the browser that mimics real Linux terminals.
    *   **Dynamic UI:** Uses simple DOM manipulation to switch views (Login, Dashboard, Labs).

2.  **Backend (Node.js + Express)**
    *   **API Layer:** RESTful endpoints for authentication, scenario fetching, and submission handling.
    *   **Environment:** Runs on a custom Express server (`server.js`) for local stability.

3.  **Database (MongoDB Atlas)**
    *   **Data Models:** Mongoose schemas for `Users`, `Scenarios`, and `Submissions`.
    *   **Cloud Native:** Hosted on MongoDB Atlas for accessibility from anywhere.

---

## 🛠️ Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Runtime** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | Server-side execution environment. |
| **Framework** | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) | Web server framework for handling API routes. |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | NoSQL database for flexible data storage. |
| **ODM** | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) | Object Data Modeling library for MongoDB. |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Pure web technologies for the user interface. |

---

## ✨ Key Features

*   **🔐 Role-Based Access Control:** Distinct portals for Students (Lab execution) and Faculty (Grading & Scenario Management).
*   **💻 In-Browser Terminal:** Execute forensic commands like `analyze`, `decrypt`, and `submit` directly in the web interface.
*   **📊 Real-Time Grading:** Instant feedback loop between student submissions and faculty grading.
*   **🌓 Dark Mode UI:** "Audi-inspired" aesthetic with deep blacks and vibrant accents for reduced eye strain during long coding sessions.
