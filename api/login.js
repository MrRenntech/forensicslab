import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';

export default async function handler(req, res) {
    const { role } = req.query;

    await dbConnect();

    try {
        let user;
        if (role === 'student') {
            user = await User.findOne({ email: 'alex.johnson@example.com' });
        } else {
            user = await User.findOne({ email: 's.connor@cyber.edu' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please run seed script." });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.universityId,
                name: user.name,
                role: user.role,
                email: user.email,
                avatar: user.avatar,
                // Include other fields if they exist
                department: user.department,
                expertise: user.expertise,
                courses: user.coursesTaught || user.enrolledCourses
            }
        });
    } catch (error) {
        console.error("Login API Error:", error);
        return res.status(500).json({ success: false, message: "Database Error" });
    }
}
