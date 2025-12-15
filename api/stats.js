import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';

export default async function handler(req, res) {
    await dbConnect();

    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const pendingReviews = await Submission.countDocuments({ status: 'Submitted' });

        // Calculate Average Score
        const stats = await Submission.aggregate([
            { $group: { _id: null, avg: { $avg: "$score" } } }
        ]);
        const avgScore = stats.length > 0 ? Math.round(stats[0].avg) : 0;

        res.status(200).json({
            totalStudents,
            avgScore,
            pendingReviews,
            activeAlerts: 2 // Hardcoded for now, or could come from a 'SystemLog' model
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
}
