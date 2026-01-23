import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email for this user.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
    },
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
    },
    role: {
        type: String,
        enum: ['student', 'faculty'],
        default: 'student',
    },
    universityId: { // S-101 or F-909
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        default: 'AJ'
    },

    // Faculty Specific
    department: String,
    expertise: [String],
    coursesTaught: [String],

    // Student Specific
    enrolledCourses: [String],
    stats: {
        labsCompleted: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 }
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
