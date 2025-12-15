export default function handler(req, res) {
    // In a real app, you would parse req.body and validate credentials against a database
    // const { role, email, password } = req.body;

    // For now, we return mock data based on the 'role' query param or body
    const role = req.query.role || (req.body && req.body.role) || 'student';

    if (role === 'student') {
        res.status(200).json({
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
        res.status(200).json({
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
}
