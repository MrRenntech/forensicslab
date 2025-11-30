// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const roleBtns = document.querySelectorAll('.role-btn');
const navItems = document.querySelectorAll('.nav-item');
const viewContainers = [
    document.getElementById('dashboardView'),
    document.getElementById('scenariosView'),
    document.getElementById('labsView'),
    document.getElementById('instructorView'),
    document.getElementById('profileView')
];
const instructorOnly = document.querySelectorAll('.instructor-only');
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
roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Login functionality
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const selectedRole = document.querySelector('.role-btn.active').dataset.role;

    if (email && password) {
        currentUser.role = selectedRole;
        currentUser.name = email.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        userNameSpan.textContent = currentUser.name;

        // Update profile fields
        document.getElementById('fullName').value = currentUser.name;
        document.getElementById('emailProfile').value = email;
        document.getElementById('roleProfile').value = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);

        // Show/hide instructor elements
        if (currentUser.role === 'faculty') {
            instructorOnly.forEach(el => el.classList.remove('hidden'));
        } else {
            instructorOnly.forEach(el => el.classList.add('hidden'));
        }

        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        initTerminal();
        initStudentPerformance();
    } else {
        alert('Please enter both email and password');
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

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        // Update active nav item
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Show correct view
        const view = item.dataset.view;
        viewContainers.forEach(container => {
            if (container && container.id === `${view}View`) {
                container.classList.remove('hidden');
            } else if (container) {
                container.classList.add('hidden');
            }
        });

        // Hide instructor panel if student
        if (view === 'instructor' && currentUser.role !== 'faculty') {
            document.getElementById('dashboardView').classList.remove('hidden');
            if (document.getElementById('instructorView')) {
                document.getElementById('instructorView').classList.add('hidden');
            }
            navItems[0].classList.add('active');
            item.classList.remove('active');
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