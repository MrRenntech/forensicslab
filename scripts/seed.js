import 'dotenv/config'; // Load env vars
import dbConnect from '../lib/dbConnect.js';
import User from '../models/User.js';
import Scenario from '../models/Scenario.js';
import Submission from '../models/Submission.js';

async function seed() {
    console.log('🌱 Connecting to Database...');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in .env file');
        process.exit(1);
    }

    await dbConnect();
    console.log('✅ Connected.');

    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Scenario.deleteMany({});
    await Submission.deleteMany({});

    console.log('👤 Creating Users...');

    const faculty = await User.create({
        name: "Dr. Sarah Connor",
        email: "s.connor@cyber.edu",
        password: "password123", // In a real app, hash this!
        role: "faculty",
        universityId: "F-909",
        avatar: "SC",
        department: "Computer Science / Forensics",
        expertise: ["Malware Analysis", "Network Security"],
        coursesTaught: ["CS-401", "CS-405", "CYB-501"]
    });

    const student = await User.create({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        password: "password123",
        role: "student",
        universityId: "S-101",
        avatar: "AJ",
        enrolledCourses: ["CS-401"],
        stats: { labsCompleted: 5, avgScore: 88 }
    });

    // Create fake peers for "Student Performance" table
    await User.create([
        { name: "Jane Smith", email: "j@j.com", password: "p", universityId: "S-102", role: "student", stats: { labsCompleted: 4, avgScore: 88 } },
        { name: "Michael Brown", email: "m@m.com", password: "p", universityId: "S-103", role: "student", stats: { labsCompleted: 2, avgScore: 75 } },
        { name: "Emily Davis", email: "e@e.com", password: "p", universityId: "S-104", role: "student", stats: { labsCompleted: 6, avgScore: 98 } },
        { name: "Chris Wilson", email: "c@c.com", password: "p", universityId: "S-105", role: "student", stats: { labsCompleted: 0, avgScore: 0 } },
    ]);

    console.log('🧪 Creating Scenarios...');

    const scenarios = await Scenario.create([
        {
            title: "Data Breach Investigation",
            description: "Analyze logs from a simulated data breach to identify compromised data, attack vectors, and exfiltration methods.",
            type: "Network Forensics",
            difficulty: "Advanced",
            thumbnail: "assets/images/network_thumb.png",
            mission: {
                briefing: "A large volume of data was exfiltrated from the internal file server. Trace the attacker's steps.",
                objectives: ["Map Lateral Movement", "Identify Exfiltration Point", "Recover Compromised Credentials"],
                evidenceFiles: [{ name: "server_logs.log", size: "15 MB", type: "Log File" }]
            },
            createdBy: faculty._id
        },
        {
            title: "Ransomware Decryption",
            description: "Investigate a compromised server and attempt to recover encrypted files.",
            type: "Malware Analysis",
            difficulty: "Advanced",
            thumbnail: "assets/images/malware_thumb.png",
            mission: {
                briefing: "Server flight-data-01 has been encrypted. We have captured a memory dump.",
                objectives: ["Analyze Memory Dump", "Find Encryption Key", "Decrypt Files"],
                evidenceFiles: [{ name: "memory_dump.dmp", size: "4 GB", type: "Raw Memory" }]
            },
            createdBy: faculty._id
        },
        {
            title: "Network Traffic Analysis",
            description: "Examine captured network traffic to identify command-and-control communications.",
            type: "Network Forensics",
            difficulty: "Intermediate",
            thumbnail: "assets/images/network_thumb.png",
            mission: {
                briefing: "Strange beacons have been detected leaving the subnet. Isolate the infected host.",
                objectives: ["Filter PCAP traffic", "Isolate C2 Heartbeat", "Block IP Address"],
                evidenceFiles: [{ name: "traffic_capture.pcap", size: "120 MB", type: "PCAP" }]
            },
            createdBy: faculty._id
        },
        {
            title: "SQL Injection Analysis",
            description: "Analyze web server logs to identify SQL manipulation patterns.",
            type: "Web Forensics",
            difficulty: "Intermediate",
            thumbnail: "assets/images/sql_thumb.png",
            mission: {
                briefing: "The public portal was defaced. Reconstruct the attacker's steps from the logs.",
                objectives: ["Reconstruct SQL Queries", "Identify Vulnerable Parameter", "Patch Code"],
                evidenceFiles: [{ name: "access.log", size: "45 MB", type: "Log File" }]
            },
            createdBy: faculty._id
        },
        {
            title: "Memory Dump Forensics",
            description: "Analyze a raw RAM dump to extract artifacts and hidden processes.",
            type: "System Forensics",
            difficulty: "Advanced",
            thumbnail: "assets/images/memory_thumb.png",
            mission: {
                briefing: "A rootkit is suspected on the finance server. Find the hidden process.",
                objectives: ["Extract Process List", "Find Injected Code", "Retrieve Password Hash"],
                evidenceFiles: [{ name: "ram_dump.mem", size: "8 GB", type: "Raw Memory" }]
            },
            createdBy: faculty._id
        },
        {
            title: "Insider Threat Detection",
            description: "Investigate an employee's activity logs and file access history.",
            type: "Audit Analysis",
            difficulty: "Advanced",
            thumbnail: "assets/images/insider_thumb.png",
            mission: {
                briefing: "An employee is suspected of selling trade secrets. Verify their file access history.",
                objectives: ["Correlate Badge Logs", "Verify Download Times", "Prove Intent"],
                evidenceFiles: [{ name: "badge_access.csv", size: "50 KB", type: "CSV" }]
            },
            createdBy: faculty._id
        }
    ]);

    console.log('📝 Creating Submissions...');
    await Submission.create({
        student: student._id,
        scenario: scenarios[0]._id,
        status: "Graded",
        score: 92,
        submittedAt: new Date()
    });

    console.log('✨ Database Seeded Successfully!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding Failed:', JSON.stringify(err, null, 2));
    process.exit(1);
});
