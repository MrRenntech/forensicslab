// ============================================
// FORENSIC LAB - FRONTEND CONTROLLER
// ============================================

// --- View State Management ---
const viewContainers = [
    'loginScreen',
    'dashboardView',
    'scenariosView',
    'labsView',
    'instructorView',
    'studentProfileView',
    'facultyProfileView'
];

/**
 * Hides all main view containers.
 */
function hideAllViews() {
    viewContainers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
}

// --- Global User State ---
let currentUser = null; // Populated after login

// --- Login & Authentication Logic ---
const loginBtn = document.getElementById('loginBtn');
const loginScreen = document.getElementById('loginScreen');
const roleBtns = document.querySelectorAll('.role-btn');
const studentInputs = document.getElementById('studentInputs');
const facultyInputs = document.getElementById('facultyInputs');

let selectedRole = 'student'; // Default

// Toggle input fields based on Role Selection (Buttons)
roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update visual state
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update logic state
        selectedRole = btn.getAttribute('data-role'); // 'student' or 'faculty'

        // Toggle Views
        if (selectedRole === 'student') {
            studentInputs.classList.remove('hidden');
            facultyInputs.classList.add('hidden');
        } else {
            studentInputs.classList.add('hidden');
            facultyInputs.classList.remove('hidden');
        }
    });
});

// Handle Login Event
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        // 1. Simulate API Call
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Authenticating...';

        try {
            const response = await ApiService.login(selectedRole);

            if (response.success) {
                currentUser = response.user;

                // 2. Update UI with User Data
                updateUserProfileUI(currentUser);

                // 3. Handle Role-Based Routing
                hideAllViews();
                if (loginScreen) loginScreen.classList.add('hidden');
                document.getElementById('dashboard').classList.remove('hidden'); // Unhide Main Wrapper
                document.querySelector('.top-nav').classList.remove('hidden');

                if (currentUser.role === 'faculty') {
                    // Faculty Flow
                    document.getElementById('instructorView').classList.remove('hidden');
                    document.querySelectorAll('.student-only').forEach(el => el.style.display = 'none');
                    document.querySelectorAll('.instructor-only').forEach(el => el.style.display = 'inline-block');

                    // Load Faculty Data
                    loadInstructorDashboard();
                } else {
                    // Student Flow
                    document.getElementById('dashboardView').classList.remove('hidden');
                    document.querySelectorAll('.instructor-only').forEach(el => el.style.display = 'none');
                    document.querySelectorAll('.student-only').forEach(el => el.style.display = 'inline-block');

                    // Load Student Data
                    loadScenarios(); // NEW: Fetch dynamic scenarios
                }
                initTerminal();
            } else {
                alert("Login Failed: " + response.message);
            }
        } catch (err) {
            console.error("Login Script Error:", err);
            // alert("System Error: " + err.message); // Silenced for smooth UX
        } finally {
            loginBtn.textContent = originalText;
        }
    });
}

/**
 * Updates the Top Nav and Profile views with the current user's info.
 */
function updateUserProfileUI(user) {
    // Top Nav
    const nameDisplay = document.getElementById('userName');
    const roleDisplay = document.getElementById('userRoleDisplay');
    const profileInitial = document.querySelector('.avatar');

    if (nameDisplay) nameDisplay.textContent = user.name;
    if (roleDisplay) roleDisplay.textContent = user.role === 'student' ? 'Student Dashboard' : 'Instructor Console';
    if (profileInitial) profileInitial.textContent = user.avatar;

    // Student Profile Inputs
    if (user.role === 'student') {
        const pName = document.getElementById('profileName');
        const pEmail = document.getElementById('profileEmail');
        if (pName) pName.value = user.name;
        if (pEmail) pEmail.value = user.email;
    }
}

/**
 * Loads data for the Faculty Dashboard (Stats, Students, Profile).
 */
async function loadInstructorDashboard() {
    // 1. Load Analytics Cards
    const stats = await ApiService.getDashboardStats();
    if (document.getElementById('statTotalStudents')) document.getElementById('statTotalStudents').textContent = stats.totalStudents;
    if (document.getElementById('statAvgScore')) document.getElementById('statAvgScore').textContent = stats.avgScore + '%';
    if (document.getElementById('statPendingReviews')) document.getElementById('statPendingReviews').textContent = stats.pendingReviews;
    if (document.getElementById('statActiveAlerts')) document.getElementById('statActiveAlerts').textContent = stats.activeAlerts;

    // 2. Load Student Performance Table (Real Submissions)
    const submissions = await ApiService.getSubmissions();
    const tbody = document.getElementById('studentTableBody');
    if (tbody) {
        if (submissions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: #888;">No submissions yet.</td></tr>`;
        } else {
            tbody.innerHTML = submissions.map(s => `
                <tr>
                    <td>${s.student ? s.student.name : 'Unknown Student'}</td>
                    <td>${s.scenario ? s.scenario.title : 'Unknown Lab'}</td>
                    <td>${s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '-'}</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${s.score || 0}%"></div>
                        </div>
                        <span style="font-size: 0.8rem; margin-left: 5px;">${s.score !== undefined ? s.score + '%' : 'N/A'}</span>
                    </td>
                    <td>
                        <span class="status-badge status-${s.status.toLowerCase().replace(' ', '-')}">${s.status}</span>
                        ${s.status !== 'Graded' ? `
                            <button class="btn-sm grade-btn" data-id="${s._id}" style="margin-left: 10px; padding: 2px 8px; font-size: 0.7rem;">
                                Grade
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
        }

        // Attach Grade Listeners
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const subId = e.target.getAttribute('data-id');
                const score = prompt("Enter Grade (0-100):");
                if (score !== null) {
                    const gradeNum = parseInt(score);
                    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
                        alert("Invalid score.");
                        return;
                    }

                    const result = await ApiService.gradeSubmission({
                        submissionId: subId,
                        score: gradeNum,
                        feedback: "Good work." // Simplified for now
                    });

                    if (result.success) {
                        alert("Graded successfully!");
                        loadInstructorDashboard(); // Refresh table
                    } else {
                        alert("Failed to grade.");
                    }
                }
            });
        });
    }

    // 3. Load Faculty Profile Data
    populateFacultyProfile(currentUser);
}

/**
 * Populates the Faculty Profile View with data.
 */
async function populateFacultyProfile(user) {
    if (document.getElementById('facName')) document.getElementById('facName').value = user.name;
    if (document.getElementById('facDept')) document.getElementById('facDept').value = user.department;
    if (document.getElementById('facExpertise')) document.getElementById('facExpertise').value = user.expertise;

    // Load Courses
    const courseList = document.getElementById('courseList');
    if (courseList && user.courses) {
        courseList.innerHTML = user.courses.map(c => `<span class="badge">${c}</span>`).join('');
    }

    // Load Activity Log
    const activities = await ApiService.getFacultyActivity();
    const timeline = document.getElementById('facultyActivityLog');
    if (timeline) {
        timeline.innerHTML = activities.map(item => `
            <div class="timeline-item">
                <div class="time-stamp">${item.time}</div>
                <div class="activity-text">${item.text}</div>
            </div>
        `).join('');
    }
}


// --- Sidebar / Navbar Navigation Logic ---
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Handle View Switching
        const viewId = item.getAttribute('data-view');

        // Special case: Profile link needs to route based on Role
        if (viewId === 'profile') {
            hideAllViews();
            if (currentUser && currentUser.role === 'faculty') {
                document.getElementById('facultyProfileView').classList.remove('hidden');
                populateFacultyProfile(currentUser);
            } else {
                document.getElementById('studentProfileView').classList.remove('hidden');
                updateUserProfileUI(currentUser);
            }
        }
        // Standard View Switching
        else if (viewId) {
            const targetView = viewId + 'View'; // e.g., 'dashboard' -> 'dashboardView'
            hideAllViews();
            const el = document.getElementById(targetView);
            if (el) el.classList.remove('hidden');
        }
    });
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentUser = null; // Clear user state
        hideAllViews();
        if (loginScreen) loginScreen.classList.remove('hidden'); // Show login screen
        document.getElementById('dashboard').classList.add('hidden'); // Hide Main Wrapper
        document.querySelector('.top-nav').classList.add('hidden'); // Hide dashboard nav

        // Reset login form fields
        if (document.getElementById('studentEmail')) document.getElementById('studentEmail').value = '';
        if (document.getElementById('studentPass')) document.getElementById('studentPass').value = '';
        if (document.getElementById('facultyId')) document.getElementById('facultyId').value = '';
        if (document.getElementById('accessCode')) document.getElementById('accessCode').value = '';

        // Reset role buttons
        roleBtns.forEach(b => b.classList.remove('active'));
        const studentBtn = document.querySelector('.role-btn[data-role="student"]');
        if (studentBtn) studentBtn.classList.add('active');
        selectedRole = 'student';

        // Reset Inputs visibility
        if (studentInputs) studentInputs.classList.remove('hidden');
        if (facultyInputs) facultyInputs.classList.add('hidden');
    });
}

// --- Lab & Scenario Logic ---

// Helper: Generate Random Case ID
function generateCaseID() {
    return 'CS-' + Math.floor(1000 + Math.random() * 9000);
}

let activeScenarioId = null; // Track current scenario

// Initialize terminal content
function initTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');
    if (!terminalOutput) return;

    terminalOutput.innerHTML = `
        <div>> INITIALIZING FORENSIC WORKSTATION...</div>
        <div>> MOUNTING EVIDENCE DRIVES... [OK]</div>
        <div>> LOADING ANALYSIS MODULES... [OK]</div>
        <div class="output">Ready. Type 'help' for available commands.</div>
    `;

    const input = document.getElementById('terminalInput');
    if (input) {
        // Remove old listeners to prevent duplicates if re-initialized
        const newHelper = input.cloneNode(true);
        input.parentNode.replaceChild(newHelper, input);

        newHelper.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command) {
                    processCommand(command);
                    this.value = ''; // Clear input
                }
            }
        });
        newHelper.focus();
    }
}

function processCommand(cmd) {
    const output = document.getElementById('terminalOutput');
    const lowerCmd = cmd.toLowerCase();

    // Echo command
    output.innerHTML += `<div><span style="color: #00ff00;">$ user@forensiclab:</span> ${cmd}</div>`;

    let response = '';

    switch (lowerCmd) {
        case 'help':
            response = `
                Available Commands:
                - <span class="cmd">help</span>: Show this message
                - <span class="cmd">ls</span>: List evidence files
                - <span class="cmd">clear</span>: Clear terminal
                - <span class="cmd">analyze [file]</span>: Run forensic analysis
                - <span class="cmd">submit</span>: Submit current case findings
            `;
            break;
        case 'ls':
            response = `
                Evidence Directory:
                drwxr-xr-x  root  root  4096  .
                drwxr-xr-x  root  root  4096  ..
                -rw-r--r--  user  user  24KB  suspicious_email.eml
                -rw-r--r--  user  user  15MB  server_logs.log
            `;
            // Dynamic check could go here later based on current scenario
            break;
        case 'clear':
            output.innerHTML = '';
            return; // Exit early
        case 'submit':
            // Trigger real submission logic
            response = "Initiating Submission Protocol...";
            handleSubmission();
            break;
        default:
            if (lowerCmd.startsWith('analyze')) {
                response = `Running heuristic analysis on target... [COMPLETED]<br>
                            > No major threats detected in header signature.<br>
                            > Suggestion: Use 'strings' or hex editor for deeper inspection.`;
            } else {
                response = `Command not found: ${cmd}. Type 'help' for list.`;
            }
    }

    output.innerHTML += `<div class="output">${response}</div>`;
    // Auto scroll to bottom
    const terminalContainer = output.parentNode; // .terminal
    terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

// --- UI Interaction Handlers (Modals, Buttons) ---

// Profile Edit Logic (Generic for Student/Faculty)
function setupEditToggle(editBtnId, saveBtnId, inputIds) {
    const editBtn = document.getElementById(editBtnId);
    const saveBtn = document.getElementById(saveBtnId);

    if (editBtn && saveBtn) {
        editBtn.addEventListener('click', () => {
            // Un-disable inputs
            inputIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.removeAttribute('disabled');
            });
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        });

        saveBtn.addEventListener('click', () => {
            // Disable inputs again
            inputIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.setAttribute('disabled', 'true');
            });
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
            alert("Profile updated successfully!"); // Simulation
        });
    }
}

// Setup Student Edit
setupEditToggle('editProfileBtn', 'saveProfileBtn', ['profileName', 'profileEmail']);
// Setup Faculty Edit
setupEditToggle('editFacProfile', 'saveFacProfile', ['facName', 'facDept', 'facExpertise']);

// Scenario Modal Logic
const modal = document.getElementById('scenarioModal');
const openModalBtn = document.getElementById('openScenarioModal');
const closeModalBtn = document.querySelector('.close-modal');
const cancelBtn = document.getElementById('cancelScenario');
const confirmBtn = document.getElementById('confirmScenario');

function toggleModal(show) {
    if (show && modal) modal.classList.remove('hidden');
    else if (modal) modal.classList.add('hidden');
}

if (openModalBtn) openModalBtn.addEventListener('click', () => toggleModal(true));
if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(false));

if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
        const title = document.getElementById('scenarioTitle').value;
        const type = document.getElementById('scenarioType').value;
        const difficulty = document.getElementById('scenarioDifficulty').value;
        const description = document.getElementById('scenarioDesc').value;

        if (!title || !description) {
            alert("Please fill in all required fields.");
            return;
        }

        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Creating...';

        try {
            const result = await ApiService.createScenario({ title, type, difficulty, description });

            if (result.success) {
                alert("New scenario created successfully!");
                toggleModal(false);
                // Clear form
                document.getElementById('scenarioTitle').value = '';
                document.getElementById('scenarioDesc').value = '';
            } else {
                alert("Failed to create: " + (result.message || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("System Error creating scenario.");
        } finally {
            confirmBtn.textContent = originalText;
        }
    });
}

// --- Frontend Polish Features ---

// 1. Dynamic Scenario Loading
async function loadScenarios() {
    const container = document.getElementById('scenariosContainer');
    if (!container) return;

    // Show loading state (if not already there)
    container.innerHTML = `<div style="text-align: center; color: #888; grid-column: span 3;"><i class="fas fa-circle-notch fa-spin"></i> Loading Scenarios...</div>`;

    try {
        const scenarios = await ApiService.getScenarios();

        if (scenarios.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #888; grid-column: span 3;">No scenarios available.</div>`;
            return;
        }

        container.innerHTML = scenarios.map(s => `
            <div class="scenario-card">
                <div class="scenario-thumb">
                    <img src="${s.image}" alt="${s.title}" onerror="this.src='assets/images/network_thumb.png'">
                </div>
                <div class="scenario-header">
                    <h3 class="scenario-title">${s.title}</h3>
                    <span class="scenario-difficulty">${s.difficulty}</span>
                </div>
                <div class="scenario-content">
                    <p class="scenario-description">${s.description}</p>
                    <div class="scenario-actions">
                        <button class="btn-outline start-lab-btn" 
                            data-title="${s.title}"
                            data-desc="${s.mission && s.mission.briefing ? s.mission.briefing : 'No briefing available.'}">
                            Start Lab
                        </button>
                        <button class="btn-outline btn-danger">Reset</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-attach event listeners to the new buttons
        attachLabButtonListeners();

    } catch (err) {
        console.error("Failed to load scenarios:", err);
        container.innerHTML = `<div style="text-align: center; color: red; grid-column: span 3;">Failed to load scenarios.</div>`;
    }
}

function attachLabButtonListeners() {
    const startLabBtns = document.querySelectorAll('.start-lab-btn');
    startLabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title') || "Unknown Lab";
            const desc = btn.getAttribute('data-desc') || "No description loaded.";

            // In a real app, this ID comes from the DB (data-id)
            // For now, we simulate or grab it if present
            activeScenarioId = btn.getAttribute('data-id') || "65d4c3b2a1e0f9d8c7b6a5e4";

            // Populate Lab View
            const caseTitleInput = document.getElementById('caseTitle');
            const missionText = document.getElementById('missionText');

            if (caseTitleInput) caseTitleInput.value = title;
            if (missionText) missionText.textContent = desc;

            // Generate new Case ID
            const caseIdEl = document.getElementById('caseId');
            if (caseIdEl) caseIdEl.textContent = "ID: " + generateCaseID();

            // Switch View
            hideAllViews();
            document.getElementById('labsView').classList.remove('hidden');

            // Update Nav
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            const labNav = document.querySelector('[data-view="labs"]');
            if (labNav) labNav.classList.add('active');

            // Reset Terminal
            initTerminal();
            if (document.getElementById('terminalOutput')) {
                const terminalOutput = document.getElementById('terminalOutput');
                terminalOutput.innerHTML += `<div>> CASE INITIALIZED: ${title}</div>`;
                terminalOutput.innerHTML += `<div>> LOADING MISSION PARAMETERS... [OK]</div>`;
            }
        });
    });
}
// Initial listener attachment not needed as we load dynamically, but keeping for safety if static existed
// attachLabButtonListeners();

// 2. Notification Center
const notifBtn = document.getElementById('notificationBtn');
const notifDropdown = document.getElementById('notificationDropdown');

if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing immediately
        notifDropdown.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.add('hidden');
        }
    });
}

// 3. Settings Modal
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsModal');
const saveSettingsBtn = document.getElementById('saveSettings');

function toggleSettingsModal(show) {
    if (show && settingsModal) settingsModal.classList.remove('hidden');
    else if (settingsModal) settingsModal.classList.add('hidden');
}

if (settingsBtn) settingsBtn.addEventListener('click', () => toggleSettingsModal(true));
if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => toggleSettingsModal(false));
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        toggleSettingsModal(false);
        alert("Preferences saved. (Visual demo)");
    });
}


// --- Broadcast Announcement Logic ---
const broadcastModal = document.getElementById('broadcastModal');
const openBroadcastBtn = document.getElementById('openBroadcastModal');
const closeBroadcastBtn = document.getElementById('closeBroadcastModal');
const cancelBroadcastBtn = document.getElementById('cancelBroadcast');
const sendBroadcastBtn = document.getElementById('sendBroadcast');

function toggleBroadcastModal(show) {
    if (show && broadcastModal) broadcastModal.classList.remove('hidden');
    else if (broadcastModal) broadcastModal.classList.add('hidden');
}

if (openBroadcastBtn) openBroadcastBtn.addEventListener('click', () => toggleBroadcastModal(true));
if (closeBroadcastBtn) closeBroadcastBtn.addEventListener('click', () => toggleBroadcastModal(false));
if (cancelBroadcastBtn) cancelBroadcastBtn.addEventListener('click', () => toggleBroadcastModal(false));

if (sendBroadcastBtn) {
    sendBroadcastBtn.addEventListener('click', () => {
        const subject = document.getElementById('broadcastSubject').value;
        const recipients = document.getElementById('broadcastRecipients').value;

        if (subject) {
            let count = recipients === 'all' ? 42 : (recipients === 'cs401' ? 24 : 18);
            alert(`Announcement "${subject}" sent to ${count} students successfully.`);
            toggleBroadcastModal(false);
            // reset form
            document.getElementById('broadcastSubject').value = '';
            document.getElementById('broadcastMessage').value = '';
        } else {
            alert("Please enter a subject line.");
        }
    });
}

// --- Submission Logic ---

/**
 * Handles the submission of a lab report from the terminal or UI.
 * Gathers terminal logs, current user ID, and active scenario ID.
 */
async function handleSubmission() {
    if (!activeScenarioId) {
        alert("Error: No active scenario found. Please restart the lab.");
        return;
    }

    const output = document.getElementById('terminalOutput');
    // Basic mock log gathering
    const logs = output ? output.innerText.split('\n').filter(l => l.trim().length > 0) : [];

    // Safety check for user
    const studentId = (currentUser && currentUser._id) ? currentUser._id : "65789a1b2c3d4e5f6g7h8i9k";

    const submissionData = {
        studentId: studentId,
        scenarioId: activeScenarioId,
        answers: { note: "Automated submission from terminal." },
        logs: logs
    };

    const result = await ApiService.submitLab(submissionData);

    if (result.success) {
        alert("✅ Case Submitted Successfully! Pending Faculty Review.");
        if (output) {
            output.innerHTML += `<div>> UPLOADING REPORT... [100%]</div>`;
            output.innerHTML += `<div>> SUBMISSION ID: ${result.submission._id || 'Pending'}</div>`;
            output.innerHTML += `<div>> SESSION CLOSED.</div>`;
        }
    } else {
        alert("❌ Submission Failed: " + result.message);
    }
}

// Attach to generic button if it exists
const globalSubmitBtn = document.getElementById('submitLab');
if (globalSubmitBtn) {
    globalSubmitBtn.addEventListener('click', handleSubmission);
}