import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scenario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scenario',
        required: true,
    },
    status: {
        type: String,
        enum: ['In Progress', 'Submitted', 'Graded'],
        default: 'In Progress',
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
    },
    submittedAt: Date,
    feedback: String,
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
