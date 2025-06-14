import Graph from "../models/graph.model.js";
import Doctor from "../models/doctor.model.js";
import { createGraphValidator, updateGraphValidator } from "../validation/graph.validator.js";
import { successResponse, errorResponse} from "../helpers/response-handle.js";
import { isValidObjectId } from "mongoose";

export class GraphController{
    async createGraph(req, res) {
        try {
            const { value, error } = createGraphValidator(req.body);
            if (error) return errorResponse(res, error.message, 422);
            if (!isValidObjectId(value.doctorId)) return errorResponse(res, 'Invalid Graph id', 400);
            const doctor = await Doctor.findById(value.doctorId);
            if (!doctor) return errorResponse(res, 'Doctor does not exists', 400);
            const graph = await Graph.findOne({
                schedule: value.schedule,
                doctorId: value.doctorId
            });
            if (graph) return errorResponse(res, 'Doctor is busy at this time', 409)
            const newGraph = await Graph.create(value);
            return successResponse(res, newGraph, 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getAllGraphs(_req, res) {
        try {
            const graphs = await Graph.find().populate('doctorId');
            return successResponse(res, graphs);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getGraphById(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Graph id', 400);
            const id = req.params.id;
            const graph = await Graph.findById(id).populate('doctorId');
            if (!graph) return errorResponse(res, 'Graph not found', 404);
            return successResponse(res, graph);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateGraph(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Graph id', 400);
            const id = req.params.id;
            const graph = await Graph.findById(id);
            if (!graph) return errorResponse(res, 'Graph not found', 404);
            const { value, error } = updateGraphValidator(req.body);
            if (error) return errorResponse(res, error.message, 422);
            if (value.doctorId) {
                const doctor = await Doctor.findById(value.doctorId);
                if (!doctor) return errorResponse(res, 'Doctor does not exist', 400);
            }
            const existsGraph = await Graph.findOne({
                schedule: value.schedule,
                doctorId: value.doctorId
            });
            if (existsGraph) return errorResponse(res, 'Doctor is busy at this time', 409);
            const updatedGraph = await Graph.findByIdAndUpdate(id, value, { new: true });
            return successResponse(res, updatedGraph);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async deleteGraph(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) return errorResponse(res, 'Invalid Graph id', 400);
            const id = req.params.id;
            const graph = await Graph.findById(id);
            if (!graph) return errorResponse(res, 'Graph not found', 404);
            await Graph.findByIdAndDelete(id);
            return successResponse(res, {});
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}