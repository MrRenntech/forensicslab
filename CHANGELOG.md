# Changelog

All notable changes to the "ForensicLab" project will be documented in this file.

## [2.0.0] - 2025-12-15

### Added
- **Vercel Serverless Backend**: Created `/api` directory with serverless functions for `login`, `stats`, `students`, and `activity`.
- **API Service Layer**: `api.service.js` introduced to handle data fetching, with automatic fallback to mock data when running locally (`file://`).
- **Faculty Dashboard**: Full dashboard implementation including:
    - Analytics Cards (Total Students, Avg Score, Alerts).
    - Student Performance Data Table.
    - "Broadcast Announcement" Modal.
    - "Create Scenario" Modal.
- **Faculty Profile**: Detailed profile view with Expertise, Current Courses, and Activity Log.
- **Dynamic Scenarios**: "Start Lab" button now dynamically loads mission details based on the selected scenario.
- **UI Enhancements**:
    - Notification Center (Bell icon + Dropdown).
    - Settings Modal (Preferences).
    - Mission Info Panel in Lab Workspace.
    - High-quality, Audi-themed background images and thumbnails.

### Updated
- **Authentication Flow**: Completely refactored `index.html` and `script.js` to support role-based login (Student vs. Faculty) with proper view routing.
- **Top Navigation**: Replaced the sidebar with a sleek, sticky top navigation bar.
- **Project Structure**: Organized code into `api/` (backend) and root (frontend). Added `package.json` for Node.js compatibility.
- **Error Handling**: Implemented robust error catching in `script.js` to prevent UI crashes and silenced generic alerts for a smoother UX.
- **Code Documentation**: Added comprehensive comments throughout `script.js`.

### Removed
- **Hardcoded Data**: Removed all static dummy data from `index.html`. The UI now populates dynamically via JavaScript.
- **Legacy Sidebar**: Removed old sidebar HTML and CSS in favor of the new top navigation.

### Fixed
- **Login Blinking**: Fixed an issue where the dashboard layout was hidden incorrectly on login/logout.
- **CORS Errors**: Fixed pseudo-CORS errors in local development by detecting the `file:` protocol.
