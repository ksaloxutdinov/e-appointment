import Admin from "../models/admin.model.js";
import Crypto from "../utils/cryptography.js";
import { connectDB } from "./index.js";
import { disconnect } from "mongoose";
import { config } from "dotenv";

config();
const crypto = new Crypto();

async function createSuperAdmin() {
    try {
        await connectDB();
        const superadmin = await Admin.findOne({ role: 'superadmin' });
        if (superadmin) throw new Error('Superadmin already exists');
        const admin = await Admin.findOne({ username: process.env.SUPERADMIN_USERNAME });
        if (admin) throw new Error('Admin username already taken');
        const hashedPassword = await crypto.encrypt(process.env.SUPERADMIN_PASSWORD);
        await Admin.create({
            username: process.env.SUPERADMIN_USERNAME,
            hashedPassword,
            role: 'superadmin'
        });
        console.log('Super Admin created successfully');
        disconnect();
    } catch (error) {
        console.log(`Error on creating Super Admin: ${error}`);
        disconnect();
    }    
}

await createSuperAdmin();