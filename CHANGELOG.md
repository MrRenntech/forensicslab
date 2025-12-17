# Changelog

All notable changes to the **ForensicLab** project will be documented in this file.

## [1.0.0] - 2025-12-15

### Added
- **MongoDB Integration**:
  - Replaced static mock data with a real **MongoDB Atlas** database.
  - Added `mongoose` models for `User`, `Scenario`, and `Submission`.
  - Added `scripts/seed.js` to populate the database with initial users and scenarios.
- **Interactive Terminal**:
  - Implemented a functional CLI in the browser.
  - Supported commands: `help`, `ls`, `clear`, `analyze`, `submit`.
  - Added real-time typing feedback and scroll-to-bottom logic.
- **Submission System**:
  - `POST /api/submissions`: Endpoint for students to submit lab work.
  - Linked terminal `submit` command to the backend API.
- **Instructor Grading**:
  - `PUT /api/submissions`: Endpoint for faculty to grade submissions.
  - Added **Grade** button to the Faculty Dashboard table.
  - Real-time status updates (In Progress -> Submitted -> Graded).
- **Dynamic Scenarios**:
  - Scenarios are now fetched dynamically from the database via `/api/scenarios`.
  - Implemented "Create Scenario" modal for instructors to add new labs.
- **UI/UX Enhancements**:
  - **Top Navigation**: Switched to CSS Grid for perfect centering of buttons.
  - **Dark Mode**: Refined contrast (White text on Black) for better readability.
  - **Grouping**: Consolidated all navigation links (Dashboard, Scenarios, Labs, Profile) into the center block.

### Changed
- **Local Development**:
  - Switched from Vercel CLI to a custom `server.js` (Express) for stable local testing.
  - Wired all `/api/*` routes manually in `server.js`.
- **Frontend Architecture**:
  - Refactored `script.js` to use `ApiService` for all data fetching.
  - Added `activeScenarioId` state tracking to link Terminal actions to specific labs.

### Fixed
- **Navigation Alignment**: Fixed off-center buttons by using `grid-template-columns: 1fr auto 1fr`.
- **Contrast Issues**: Fixed invisible text in the top navigation bar.
- **Login Glitches**: Resolved "blank screen" issues by correctly hiding/showing view containers.

## [0.1.0] - 2025-12-14

### Initial Release
- Basic HTML/CSS structure (Audi-inspired dark theme).
- Static "Mock" data for scenarios and student stats.
- Basic Login UI (Role selection: Student/Faculty).
- Placeholder "Tools" and "Analysis" views.
