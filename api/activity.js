export default function handler(req, res) {
    res.status(200).json([
        { time: 'Today, 09:41 AM', text: 'Graded "Phishing Lab" for 3 students' },
        { time: 'Yesterday, 02:15 PM', text: 'Created new scenario: "Ransomware Analysis"' },
        { time: 'Dec 12, 11:00 AM', text: 'Updated course syllabus for CS-405' },
        { time: 'Dec 10, 04:30 PM', text: 'System Maintenance: Server Restart' }
    ]);
}
