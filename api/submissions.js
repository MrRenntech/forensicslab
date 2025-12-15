import dbConnect from '../lib/dbConnect.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { studentId, scenarioId, answers, logs } = req.body;

            // Basic validation
            if (!studentId || !scenarioId) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Create submission
            const submission = await Submission.create({
                student: studentId,
                scenario: scenarioId,
                answers: answers || {},
                logs: logs || [],
                status: 'Under Review',
                submittedAt: new Date()
            });

            return res.status(201).json({ success: true, submission });
        } catch (error) {
            console.error("Submission Error:", error);
            return res.status(500).json({ error: "Failed to submit lab" });
        }
    }

    if (req.method === 'GET') {
        try {
            // If faculty, return all. If student, return theirs (query param?)
            // For now, simplify to return all for faculty dashboard
            const submissions = await Submission.find({})
                .populate('student', 'name email')
                .populate('scenario', 'title')
                .sort({ submittedAt: -1 });

            return res.status(200).json(submissions);
        } catch (error) {
            console.error("Fetch Submissions Error:", error);
            return res.status(500).json({ error: "Failed to fetch submissions" });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { submissionId, score, feedback } = req.body;

            if (!submissionId || score === undefined) {
                return res.status(400).json({ error: "Missing submission ID or score" });
            }

            const updated = await Submission.findByIdAndUpdate(
                submissionId,
                {
                    score: score,
                    feedback: feedback || "",
                    status: 'Graded'
                },
                { new: true }
            );

            return res.status(200).json({ success: true, submission: updated });
        } catch (error) {
            console.error("Grading Error:", error);
            return res.status(500).json({ error: "Failed to grade submission" });
        }
    }
}
