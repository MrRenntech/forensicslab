// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const roleBtns = document.querySelectorAll('.role-btn');
const navItems = document.querySelectorAll('.nav-item');
const studentOnly = document.querySelectorAll('.student-only');
const instructorOnly = document.querySelectorAll('.instructor-only');

// Explicitly define views for stability
const viewContainers = [
    document.getElementById('dashboardView'),
    document.getElementById('scenariosView'),
    document.getElementById('labsView'),
    document.getElementById('instructorView'),
    document.getElementById('studentProfileView'),
    document.getElementById('facultyProfileView')
];

// Helper to hide all views
function hideAllViews() {
    viewContainers.forEach(container => {
        if (container) {
            container.classList.add('hidden');
        }
    });
}

const userNameSpan = document.getElementById('userName');
const terminalOutput = document.getElementById('terminalOutput');
const studentPerformance = document.getElementById('studentPerformance');

// Current user state
let currentUser = {
    name: "Alex Johnson",
    role: "student",
    email: "alex.johnson@example.com"
};

// Initialize terminal content
function initTerminal() {
    terminalOutput.innerHTML = `
        <div>> Analyze the email headers to identify the true sender</div>
        <div class="output">Received: from mail.server.com (192.168.1.100)</div>
        <div class="output">by forensiclab.local (10.0.0.5) with ESMTPS</div>
        <div class="output">Return-Path: &lt;attacker@malicious.com&gt;</div>
        <div class="output">Received-SPF: fail (domain of attacker@malicious.com</div>
        <div class="output">does not designate 192.168.1.100 as permitted sender)</div>
        <div class="output"></div>
        <div>> Extract and analyze embedded links</div>
        <div class="output">Found 3 links:</div>
        <div class="output">1. https://legit-site.com/login (redirects to phishing page)</div>
        <div class="output">2. https://malicious.com/download.exe (malware payload)</div>
        <div class="output">3. https://legit-site.com/help (legitimate)</div>
        <div class="output"></div>
        <div>> Calculate SHA256 hash of suspicious attachment</div>
        <div class="output">SHA256: a1b2c3d4e5f6...</div>
        <div class="output">VirusTotal match: 42/60 engines detected as malware</div>
    `;
}

// Initialize student performance
function initStudentPerformance() {
    studentPerformance.innerHTML = `
        <div class="student-card">
            <div class="student-header">
                <div class="student-avatar">MS</div>
                <div>
                    <div class="student-name">Maria Sanchez</div>
                    <div>Phishing Lab</div>
                </div>
            </div>
            <div>Score: 92%</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: 92%"></div>
            </div>
            <div class="student-stats">
                <div>Completed: Dec 1, 2025</div>
                <div>Status: <span style="color: var(--success);">Graded</span></div>
            </div>
        </div>
        
        <div class="student-card">
            <div class="student-header">
                <div class="student-avatar">TJ</div>
                <div>
                    <div class="student-name">Thomas Johnson</div>
                    <div>Phishing Lab</div>
                </div>
            </div>
            <div>Score: 78%</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: 78%"></div>
            </div>
            <div class="student-stats">
                <div>Completed: Nov 28, 2025</div>
                <div>Status: <span style="color: var(--warning);">Needs Review</span></div>
            </div>
        </div>
        
        <div class="student-card">
            <div class="student-header">
                <div class="student-avatar">AK</div>
                <div>
                    <div class="student-name">Aisha Khan</div>
                    <div>Phishing Lab</div>
                </div>
            </div>
            <div>Score: 100%</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: 100%"></div>
            </div>
            <div class="student-stats">
                <div>Completed: Dec 1, 2025</div>
                <div>Status: <span style="color: var(--success);">Graded</span></div>
            </div>
        </div>
    `;
}

// Role selection
const studentInputs = document.getElementById('studentInputs');
const facultyInputs = document.getElementById('facultyInputs');

roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active button
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle Input Fields
        const role = btn.dataset.role;
        if (role === 'student') {
            studentInputs.classList.remove('hidden');
            facultyInputs.classList.add('hidden');
        } else {
            studentInputs.classList.add('hidden');
            facultyInputs.classList.remove('hidden');
        }
    });
});

// Login functionality
loginBtn.addEventListener('click', () => {
    const selectedRole = document.querySelector('.role-btn.active').dataset.role;
    let isValid = false;
    let name = "";

    // Validate based on role
    if (selectedRole === 'student') {
        const email = document.getElementById('studentEmail').value;
        const pass = document.getElementById('studentPass').value;
        if (email && pass) {
            isValid = true;
            name = "Alex Johnson"; // Hardcoded for demo
        }
    } else {
        const id = document.getElementById('facultyId').value;
        const code = document.getElementById('accessCode').value;
        if (id && code) {
            isValid = true;
            name = "Dr. Sarah Connor"; // Hardcoded for demo
        }
    }

    if (isValid) {
        currentUser.role = selectedRole;
        currentUser.name = name;
        userNameSpan.textContent = currentUser.name;

        // Update Role Display Line
        const roleDisplay = document.getElementById('userRoleDisplay');
        if (roleDisplay) {
            roleDisplay.textContent = selectedRole === 'student' ? 'Student Dashboard' : 'Instructor Access Terminal';
        }

        // Handle View Visibility
        if (currentUser.role === 'faculty') {
            // Show instructor-only items
            instructorOnly.forEach(el => el.classList.remove('hidden'));
            // Hide separate student nav items
            studentOnly.forEach(el => el.classList.add('hidden'));

            // Redirect straight to Instructor Panel
            hideAllViews();
            document.getElementById('instructorView').classList.remove('hidden');

            // Update active nav
            navItems.forEach(i => i.classList.remove('active'));
            const instrNav = document.querySelector('[data-view="instructor"]');
            if (instrNav) instrNav.classList.add('active');

        } else {
            // Student View
            instructorOnly.forEach(el => el.classList.add('hidden'));
            // Show student nav items
            studentOnly.forEach(el => el.classList.remove('hidden'));

            // Redirect to Standard Dashboard
            hideAllViews();
            document.getElementById('dashboardView').classList.remove('hidden');

            navItems.forEach(i => i.classList.remove('active'));
            navItems[0].classList.add('active');
        }

        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        initTerminal();
        initStudentPerformance();
    } else {
        alert('Please enter valid credentials.');
    }
});

// Logout functionality
logoutBtn.addEventListener('click', () => {
    dashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    roleBtns[0].classList.add('active');
    roleBtns[1].classList.remove('active');
});



// ... (Rest of code)

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        // Update active nav item
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Show correct view
        hideAllViews();
        const view = item.dataset.view;
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }

        // Hide instructor panel if student tries to access it manually (safeguard)
        if (view === 'instructor' && currentUser.role !== 'faculty') {
            hideAllViews();
            document.getElementById('dashboardView').classList.remove('hidden');

            navItems.forEach(i => i.classList.remove('active'));
            navItems[0].classList.add('active'); // Back to dashboard
        }
    });
});

// Lab actions
document.getElementById('submitLab')?.addEventListener('click', () => {
    alert('Lab submitted for grading!');
});

document.getElementById('saveLab')?.addEventListener('click', () => {
    alert('Progress saved!');
});

document.getElementById('resetLab')?.addEventListener('click', () => {
    if (confirm('Reset all progress in this lab?')) {
        initTerminal();
    }
});

// Profile save
document.getElementById('saveProfile')?.addEventListener('click', () => {
    alert('Profile updated successfully!');
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    initStudentPerformance();
});

/* ===== LAB FEATURES JS ===== */

// 1. Case Header Logic
function generateCaseID() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = 'CASE-';
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// 2. Tool Status Logic
const forensicTools = [
    { name: 'Network Sniffer', status: 'idle' },
    { name: 'Hex Editor', status: 'running' },
    { name: 'Hash Calculator', status: 'idle' },
    { name: 'Metadata Viewer', status: 'completed' }
];

function renderToolList() {
    const list = document.getElementById('toolList');
    if (!list) return;

    list.innerHTML = forensicTools.map(tool => `
        <div class="tool-item">
            <div class="tool-name">${tool.name}</div>
            <div class="tool-status status-${tool.status}">${tool.status}</div>
        </div>
    `).join('');
}

// 3. Evidence Upload Simulation
const uploadBtn = document.getElementById('uploadEvidenceBtn');
const evidencePanel = document.getElementById('evidencePanel');

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        // Change button state
        const originalText = uploadBtn.innerHTML;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        uploadBtn.disabled = true;

        // Simulate network delay
        setTimeout(() => {
            // Restore button
            uploadBtn.innerHTML = '<i class="fas fa-check"></i> Uploaded';
            uploadBtn.classList.remove('btn-outline');
            uploadBtn.classList.add('btn'); // Make it solid primary

            // Show panel
            if (evidencePanel) {
                evidencePanel.classList.remove('hidden');

                // Simulate hash calculation
                const hashParams = "LOADING...";
                document.getElementById('evidenceHash').textContent = hashParams;

                setTimeout(() => {
                    document.getElementById('evidenceHash').textContent = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
                }, 1500);
            }
        }, 1500);
    });
}

// Initialize Lab Features when switching to Lab View
// We hook into the existing nav click listener logic by adding a check
// or simply run this on init if we are on the page. 
// For now, let's run generating ID on load.

window.addEventListener('DOMContentLoaded', () => {
    const caseIdEl = document.getElementById('caseId');
    if (caseIdEl) {
        caseIdEl.textContent = "ID: " + generateCaseID();
    }
    renderToolList();
});