import dbConnect from '../lib/dbConnect.js';
import Scenario from '../models/Scenario.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { title, description, difficulty, type } = req.body;
            // Default values for fields not yet in the simple generic modal
            const newScenario = await Scenario.create({
                title,
                description,
                difficulty,
                type: type || 'General',
                mission: {
                    briefing: description,
                    objectives: ["Analyze Evidence", "Submit Report"],
                    evidenceFiles: []
                },
                createdBy: "65789a1b2c3d4e5f6g7h8i9j" // Placeholder ID or get from session if auth was stricter
            });
            return res.status(201).json({ success: true, scenario: newScenario });
        } catch (error) {
            console.error("Create Scenario Error:", error);
            return res.status(500).json({ error: "Failed to create scenario" });
        }
    }

    // Default GET behavior
    try {
        const scenarios = await Scenario.find({}).sort({ createdAt: -1 });

        const data = scenarios.map(s => ({
            id: s._id,
            title: s.title,
            description: s.description,
            difficulty: s.difficulty,
            image: s.thumbnail || 'assets/images/network_thumb.png', // Fallback
            // Add other fields needed for mission briefing
            mission: s.mission
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error("Scenarios API Error:", error);
        res.status(500).json([]);
    }
}
