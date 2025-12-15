import mongoose from 'mongoose';

const ScenarioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String, // e.g., 'Phishing', 'Network', 'Malware'
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    thumbnail: String, // URL to image

    // Mission Data
    mission: {
        briefing: String,
        objectives: [String],
        evidenceFiles: [{
            name: String,
            size: String,
            type: { type: String },
            hash: String
        }]
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Faculty who created it
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);
