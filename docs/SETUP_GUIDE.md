# 🚀 Setup Guide - ForensicLab

Get your local environment up and running in minutes. Follow this guide to install dependencies, configure your database, and launch the lab.

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

-   [ ] **Node.js**: v18.0.0 or higher. [Download Here](https://nodejs.org/)
-   [ ] **Git**: For cloning the repository. [Download Here](https://git-scm.com/)
-   [ ] **MongoDB Atlas Account**: You'll need a connection string (URI) for the database. [Sign Up](https://www.mongodb.com/cloud/atlas)

---

## 📦 Installation Steps

### 1. Clone the Repository
Open your terminal (PowerShell or Bash) and run:

```bash
git clone https://github.com/MrRenntech/Cyber-Forensic-LAB.git
cd Cyber-Forensic-LAB-main
```

### 2. Install Dependencies
Install the required NPM packages defined in `package.json`:

```bash
npm install
```
> *This will install Express, Mongoose, Dotenv, and other utilities.*

### 3. Configure Environment Variables
The application needs to know how to connect to your database.

1.  Find the file named `.env.example` in the root directory.
2.  Rename it to `.env`:
    ```bash
    mv .env.example .env
    ```
    *(Or manually rename it in File Explorer)*
3.  Open `.env` and paste your MongoDB Connection String:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/forensiclab
    PORT=3000
    ```

---

## 🏃 Running the Application

You have two ways to start the server.

### Option A: The "One-Click" Way (Windows)
Simply double-click the **`Start_Lab.bat`** file in the project folder. This will open a terminal window and start the server automatically.

### Option B: The Manual Way
Run the following command in your terminal:

```bash
node server.js
```

You should see output similar to:
```text
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

---

## 🌐 Accessing the Lab

Open your favorite web browser (Chrome, Edge, Firefox) and navigate to:

**[http://localhost:3000](http://localhost:3000)**

---

## 🛑 Stopping the Server

To stop the server, go to the terminal window where it's running and press **`Ctrl + C`**.
