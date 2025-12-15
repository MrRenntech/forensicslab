import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';

export default async function handler(req, res) {
    await dbConnect();

    try {
        const students = await User.find({ role: 'student' }).select('name universityId stats role');

        const data = students.map(s => ({
            name: s.name,
            id: s.universityId,
            completed: s.stats ? s.stats.labsCompleted : 0,
            score: s.stats ? s.stats.avgScore : 0,
            status: "Active" // Default status
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json([]);
    }
}
