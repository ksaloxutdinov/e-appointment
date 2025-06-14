import Admin from "../models/admin.model.js";
import Crypto from "../utils/cryptography.js";
import { createAdminValidator, updateAdminValidator  } from "../validation/admin.validator.js";
import { successResponse, errorResponse } from "../helpers/response-handle.js";
import { isValidObjectId } from "mongoose";

const crypto = new Crypto();

export class AdminController {
    async createAdmin(req, res) {
        try {
            const { value, error } = createAdminValidator(req.body);
            if (error) return errorResponse(res, error.message, 422);
            const existsAdmin = await Admin.findOne({ username: value.username });
            if (existsAdmin) return errorResponse(res, 'Admin username already exists', 409);
            const hashedPassword = await crypto.encrypt(value.password);
            const admin = await Admin.create({
                username: value.username,
                hashedPassword
            });
            return successResponse(res, admin, 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getAllAdmins(_req, res) {
        try {
            const admins = await Admin.find();
            return successResponse(res, admins);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getAdminById(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Admin id', 400);
            const id = req.params.id;
            const admin = await Admin.findById(id);
            if (!admin) return errorResponse(res, 'Admin not found', 404);
            return successResponse(res, admin);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateAdmin(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Admin id', 400);
            const id = req.params.id;
            const admin = await Admin.findById(id);
            if (!admin) return errorResponse(res, 'Admin not found', 404);
            const { value, error } = updateAdminValidator(req.body);
            if (error) return errorResponse(res, error.message, 422);
            const existsAdmin = await Admin.findOne({ username: value.username });
            if (existsAdmin) return errorResponse(res, 'Admin username already exists', 409);
            const hashedPassword = await crypto.encrypt(value.password) || admin.hashedPassword;
            const newAdmin = await Admin.findByIdAndUpdate(id, {
                ...value,
                hashedPassword
            }, { new: true });
            return successResponse(res, newAdmin);
        } catch (error) {
            console.log(error);
            return errorResponse(res, error.message);
        }
    }

    async deleteAdmin(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Admin id', 400);
            const id = req.params.id;
            const admin = await Admin.findById(id);
            if (!admin) return errorResponse(res, 'Admin not found', 404);
            await Admin.findByIdAndDelete(id);
            return successResponse(res, {});
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}