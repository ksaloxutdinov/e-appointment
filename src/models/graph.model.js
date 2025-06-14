import { Schema, Types, model } from "mongoose";

const GraphSchema = new Schema({
    schedule: { type: Date, required: true },
    status: { type: String, enum: ['free', 'busy'], required: true },
    doctorId: { type: Types.ObjectId, ref: 'Doctor', require: true }
});

const Graph = model('Graph', GraphSchema);

export default Graph;