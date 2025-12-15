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

    // 2. Load Student Performance Table
    const students = await ApiService.getStudentPerformance();
    const tbody = document.getElementById('studentTableBody');
    if (tbody) {
        tbody.innerHTML = students.map(s => `
            <tr>
                <td>${s.name}</td>
                <td>${s.id}</td>
                <td>${s.completed}/8</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${s.score}%"></div>
                    </div>
                </td>
                <td><span class="status-badge status-${s.status.toLowerCase()}">${s.status}</span></td>
            </tr>
        `).join('');
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

// Initialize terminal content
function initTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');
    if (!terminalOutput) return;

    terminalOutput.innerHTML = `
        <div>> INITIALIZING FORENSIC WORKSTATION...</div>
        <div>> MOUNTING EVIDENCE DRIVES... [OK]</div>
        <div>> LOADING ANALYSIS MODULES... [OK]</div>
        <div class="output">Ready. Type 'help' for available commands.</div>
        <div class="output"></div>
    `;
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
    confirmBtn.addEventListener('click', () => {
        alert("New scenario created successfully!");
        toggleModal(false);
    });
}

// --- Frontend Polish Features ---

// 1. Dynamic Scenario Loading
const startLabBtns = document.querySelectorAll('.start-lab-btn');

startLabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title') || "Unknown Lab";
        const desc = btn.getAttribute('data-desc') || "No description loaded.";

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
        navItems.forEach(i => i.classList.remove('active'));
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