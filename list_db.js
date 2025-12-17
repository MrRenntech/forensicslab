import 'dotenv/config';
import dbConnect from './lib/dbConnect.js';
import Scenario from './models/Scenario.js';

async function list() {
    await dbConnect();
    const scenarios = await Scenario.find({});
    console.log("--- CURRENT DATABASE CONTENT ---");
    scenarios.forEach(s => console.log(`- ${s.title} (${s.difficulty})`));
    console.log("--------------------------------");
    process.exit(0);
}

list().catch(console.error);
