import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
});

const Admin = model("Admin", AdminSchema);

export default Admin;