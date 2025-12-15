import dbConnect from '../lib/dbConnect.js';
import Submission from '../models/Submission.js';

export default async function handler(req, res) {
    await dbConnect();

    try {
        // Fetch recent graded submissions to mimic activity
        const recentSubs = await Submission.find({ status: 'Graded' })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('student', 'name')
            .populate('scenario', 'title');

        const activities = recentSubs.map(sub => ({
            time: new Date(sub.updatedAt).toLocaleDateString(),
            text: `Graded "${sub.scenario.title}" for ${sub.student.name}`
        }));

        // Add some filler if empty (since it's a demo)
        if (activities.length < 3) {
            activities.push(
                { time: 'Today', text: 'System Maintenance: Security Patch Applied' },
                { time: 'Yesterday', text: 'Updated Course Material for CS-401' }
            );
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json([]);
    }
}
