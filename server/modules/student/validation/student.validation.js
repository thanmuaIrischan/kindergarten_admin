const Joi = require('joi');

const studentSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .trim()
        .max(50)
        .messages({
            'string.empty': 'First name is required',
            'string.max': 'First name cannot be more than 50 characters'
        }),

    lastName: Joi.string()
        .required()
        .trim()
        .max(50)
        .messages({
            'string.empty': 'Last name is required',
            'string.max': 'Last name cannot be more than 50 characters'
        }),

    dateOfBirth: Joi.date()
        .required()
        .messages({
            'date.base': 'Please provide a valid date of birth',
            'any.required': 'Date of birth is required'
        }),

    gender: Joi.string()
        .required()
        .valid('male', 'female', 'other')
        .messages({
            'any.only': 'Gender must be either male, female, or other',
            'any.required': 'Gender is required'
        }),

    parentName: Joi.string()
        .required()
        .trim()
        .max(100)
        .messages({
            'string.empty': 'Parent name is required',
            'string.max': 'Parent name cannot be more than 100 characters'
        }),

    parentContact: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Parent contact number is required'
        }),

    parentEmail: Joi.string()
        .email()
        .trim()
        .lowercase()
        .allow('')
        .messages({
            'string.email': 'Please provide a valid email address'
        }),

    address: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Address is required'
        }),

    enrollmentDate: Joi.date()
        .default(Date.now),

    class: Joi.string()
        .trim()
        .allow(''),

    medicalConditions: Joi.array()
        .items(Joi.string().trim())
        .default([]),

    emergencyContact: Joi.object({
        name: Joi.string().trim().allow(''),
        relationship: Joi.string().trim().allow(''),
        phone: Joi.string().trim().allow('')
    }).default({}),

    studentPhoto: Joi.object({
        url: Joi.string().allow(''),
        public_id: Joi.string().allow('')
    }).allow(null),

    transcriptPhoto: Joi.object({
        url: Joi.string().allow(''),
        public_id: Joi.string().allow('')
    }).allow(null),

    householdRegistration: Joi.object({
        url: Joi.string().allow(''),
        public_id: Joi.string().allow('')
    }).allow(null)
});

const validateStudent = (data) => {
    return studentSchema.validate(data, { abortEarly: false });
};

module.exports = {
    validateStudent
}; 