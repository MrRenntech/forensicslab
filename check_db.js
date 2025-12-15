import 'dotenv/config';
import dbConnect from './lib/dbConnect.js';
import Scenario from './models/Scenario.js';
import User from './models/User.js';

async function check() {
    await dbConnect();
    const count = await Scenario.countDocuments();
    const users = await User.countDocuments();
    console.log(`Scenarios in DB: ${count}`);
    console.log(`Users in DB: ${users}`);
    process.exit(0);
}

check().catch(console.error);
