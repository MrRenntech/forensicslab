/**
 * api.service.js
 * 
 * Central API Service to communicate with the Vercel Backend.
 * Automatically switches to Mock Data when running locally (file://).
 */

const ApiService = {
    /**
     * user: string - 'student' | 'faculty'
     */
    login: async (role) => {
        // 1. Detect Local Environment
        if (window.location.protocol === 'file:') {
            console.log("Running locally (file://). Using Mock Data for Login.");
            return new Promise(resolve => {
                setTimeout(() => {
                    if (role === 'student') {
                        resolve({
                            success: true,
                            user: {
                                id: 'S-101',
                                name: "Alex Johnson",
                                role: "student",
                                email: "alex.johnson@example.com",
                                avatar: "AJ"
                            }
                        });
                    } else {
                        resolve({
                            success: true,
                            user: {
                                id: 'F-909',
                                name: "Dr. Sarah Connor",
                                role: "faculty",
                                email: "s.connor@cyber.edu",
                                avatar: "SC",
                                department: "Computer Science / Forensics",
                                expertise: "Malware Analysis, Network Security",
                                courses: ["CS-401", "CS-405", "CYB-501"]
                            }
                        });
                    }
                }, 500);
            });
        }

        // 2. Production / Server Environment
        try {
            const response = await fetch(`/api/login?role=${role}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.warn("Login Error (Using Fallback Data):", error);
            return { success: false, message: "Server unreachable" };
        }
    },

    /**
     * Fetches statistics for the Instructor Dashboard.
     */
    getDashboardStats: async () => {
        if (window.location.protocol === 'file:') {
            return {
                totalStudents: 42,
                avgScore: 88,
                pendingReviews: 5,
                activeAlerts: 2
            };
        }

        try {
            const response = await fetch('/api/stats');
            return await response.json();
        } catch (error) {
            return { totalStudents: '-', avgScore: '-', pendingReviews: '-', activeAlerts: '-' };
        }
    },

    /**
     * Fetches the list of students for the Instructor Performance Table.
     */
    getStudentPerformance: async () => {
        if (window.location.protocol === 'file:') {
            return [
                { name: "John Doe", id: "S101", completed: 5, score: 92, status: "Active" },
                { name: "Jane Smith", id: "S102", completed: 4, score: 88, status: "Active" },
                { name: "Michael Brown", id: "S103", completed: 2, score: 75, status: "Warning" },
                { name: "Emily Davis", id: "S104", completed: 6, score: 98, status: "Active" },
                { name: "Chris Wilson", id: "S105", completed: 0, score: 0, status: "Inactive" }
            ];
        }

        try {
            const response = await fetch('/api/students');
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    /**
     * Fetches activity log for the Faculty Profile.
     */
    getFacultyActivity: async () => {
        if (window.location.protocol === 'file:') {
            return [
                { time: 'Today, 09:41 AM', text: 'Graded "Phishing Lab" for 3 students' },
                { time: 'Yesterday, 02:15 PM', text: 'Created new scenario: "Ransomware Analysis"' },
                { time: 'Dec 12, 11:00 AM', text: 'Updated course syllabus for CS-405' },
                { time: 'Dec 10, 04:30 PM', text: 'System Maintenance: Server Restart' }
            ];
        }

        try {
            const response = await fetch('/api/activity');
            return await response.json();
        } catch (error) {
            return [];
        }
    }
};
