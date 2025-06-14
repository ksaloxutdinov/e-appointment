import Doctor from "../models/doctor.model.js";
import { errorResponse, successResponse } from "../helpers/response-handle.js";
import { createDoctorValidator, updateDoctorValidator } from "../validation/doctor.validator.js";
import { isValidObjectId } from "mongoose";

export class DoctorController{
    async createDoctor(req, res) {
        try {
            const { value, error } = createDoctorValidator(req.body);
            const doctor = await Doctor.findOne({phoneNumber: value.phoneNumber});
            if (doctor) return errorResponse(res, 'Phone number already exists', 409);
            if (error) return errorResponse(res, error.message, 422);
            const newDoctor = await Doctor.create({
                ...value
            });
            return successResponse(res, newDoctor, 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getAllDoctors(_req, res) {
        try {
            const doctors = await Doctor.find();
            return successResponse(res, doctors);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getDoctorById(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Doctor id', 400);
            const id = req.params.id;
            const doctor = await Doctor.findById(id);
            if (!doctor) return errorResponse(res, 'Doctor not found', 404);
            return successResponse(res, doctor);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateDoctor(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Doctor id', 400);
            const id = req.params.id;
            const doctor = await Doctor.findById(id);
            if (!doctor) return errorResponse(res, 'Doctor not found', 404);
            const { value, error } = updateDoctorValidator(req.body);
            if (error) return errorResponse(res, error.message, 422);
            const existsDoctor = await Doctor.findOne({ phoneNumber: value.phoneNumber });
            if (existsDoctor) return errorResponse(res, 'Doctor phone number already exists', 409);
            const updatedDoctor = await Doctor.findByIdAndUpdate(id, {
                ...value
            }, { new: true });
            return successResponse(res, updatedDoctor);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async deleteDoctor(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Doctor id', 400);
            const id = req.params.id;
            const doctor = await Doctor.findById(id);
            if (!doctor) return errorResponse(res, 'Doctor not found', 404);
            await Doctor.findByIdAndDelete(id);
            return successResponse(res, {});
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}