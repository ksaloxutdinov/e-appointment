import Joi from "joi";

export const createDoctorValidator = (data) => {
    const doctor = Joi.object({
        phoneNumber: Joi.string().regex(/^\+998\s?(9[0-9]|8[8]|33)\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
        fullName: Joi.string().required()
    });
    return doctor.validate(data);
}

export const updateDoctorValidator = (data) => {
    const doctor = Joi.object({
        phoneNumber: Joi.string().regex(/^\+998\s?(9[0-9]|8[8]|33)\s?\d{3}\s?\d{2}\s?\d{2}$/).optional(),
        fullName: Joi.string().optional()
    });
    return doctor.validate(data);
}