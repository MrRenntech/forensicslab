# 🔧 Troubleshooting Guide

Encountering issues? Check the common errors and solutions below before opening an issue.

---

## 🛑 Common Startup Errors

### 1. `SyntaxError: The requested module ... does not provide an export named 'default'`
**Error Message:**
```text
SyntaxError: The requested module './api/login.js' does not provide an export named 'default'
```
**Cause:**
This usually happens when there is a mismatch between how a module is exported and how it is imported. This project uses ES6 Modules (`import`/`export`).
**Solution:**
- Ensure your `package.json` includes `"type": "module"`.
- Check if you are using `export default function...` vs `export const function...`.
- If you see this, check `server.js` imports to match the exports in `api/*.js`.

### 2. `EADDRINUSE: address already in use :::3000`
**Cause:**
Another instance of the server (or another app) is already running on port 3000.
**Solution:**
1.  Close any open terminal windows that might be running the server.
2.  **Windows:** Run `taskkill /F /IM node.exe` to kill all Node processes.
3.  **Linux/Mac:** Run `lsof -i :3000` to find the PID, then `kill -9 <PID>`.

### 3. `MongoNetworkError: connection timed out`
**Cause:**
The server cannot connect to MongoDB Atlas. This is often due to IP Whitelisting.
**Solution:**
1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Go to **Network Access** in the sidebar.
3.  Click **Add IP Address** and select **Allow Access from Anywhere** (0.0.0.0/0) for development purposes.

---

## 🐛 Application Issues

### Terminal says "Command not found"
**Cause:**
You typed a command that the specialized forensic terminal doesn't recognize.
**Solution:**
- Type `help` to see the list of valid commands.
- Ensure you are in the correct mode (e.g., inside an active lab analysis).

### "Login Failed" even with correct credentials
**Cause:**
Database connection might be dropped or seeding failed.
**Solution:**
- Check your server terminal logs for connection errors.
- Re-run the database seeder (if available) to reset user accounts.
