export default function handler(req, res) {
    res.status(200).json({
        totalStudents: 42,
        avgScore: 88,
        pendingReviews: 5,
        activeAlerts: 2
    });
}
