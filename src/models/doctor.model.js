import { Schema, model } from "mongoose";

const DoctorSchema = new Schema({
    phoneNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true }
});

const Doctor = model('Doctor', DoctorSchema);
export default Doctor;