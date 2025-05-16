const Joi = require('joi');

const baseStudentSchema = Joi.object({
    studentID: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Student ID is required',
            'any.required': 'Student ID is required'
        }),

    name: Joi.string()
        .required()
        .trim()
        .max(100)
        .messages({
            'string.empty': 'Full name is required',
            'string.max': 'Full name cannot be more than 100 characters'
        }),

    dateOfBirth: Joi.string()
        .required()
        .pattern(/^\d{1,2}-\d{1,2}-\d{4}$/)
        .custom((value, helpers) => {
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date > new Date()) {
                return helpers.error('date.future');
            }
            if (isNaN(date.getTime()) || date.getFullYear() !== year) {
                return helpers.error('date.invalid');
            }
            return value;
        })
        .messages({
            'string.empty': 'Date of birth is required',
            'string.pattern.base': 'Date of birth must be in format DD-MM-YYYY',
            'date.future': 'Date of birth cannot be in the future',
            'date.invalid': 'Invalid date of birth'
        }),

    gender: Joi.string()
        .required()
        .valid('Male', 'Female', 'Other')
        .messages({
            'any.only': 'Gender must be Male, Female, or Other',
            'any.required': 'Gender is required'
        }),

    fatherFullname: Joi.string()
        .required()
        .trim()
        .max(100)
        .messages({
            'string.empty': "Father's name is required",
            'string.max': "Father's name cannot be more than 100 characters"
        }),

    fatherOccupation: Joi.string()
        .required()
        .trim()
        .max(100)
        .messages({
            'string.empty': "Father's occupation is required",
            'string.max': "Father's occupation cannot be more than 100 characters"
        }),

    motherFullname: Joi.string()
        .required()
        .trim()
        .max(100)
        .messages({
            'string.empty': "Mother's name is required",
            'string.max': "Mother's name cannot be more than 100 characters"
        }),

    motherOccupation: Joi.string()
        .required()
        .trim()
        .max(100)
        .messages({
            'string.empty': "Mother's occupation is required",
            'string.max': "Mother's occupation cannot be more than 100 characters"
        }),

    gradeLevel: Joi.number()
        .required()
        .min(1)
        .messages({
            'number.base': 'Grade level must be a number',
            'number.min': 'Grade level must be at least 1',
            'any.required': 'Grade level is required'
        }),

    school: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'School is required'
        }),

    class: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Class is required'
        }),

    educationSystem: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'Education system is required'
        }),

    image: Joi.string()
        .allow('')
        .messages({
            'string.base': 'Image must be a valid public_id'
        }),

    birthCertificate: Joi.string()
        .allow('')
        .messages({
            'string.base': 'Birth certificate must be a valid public_id'
        }),

    householdRegistration: Joi.string()
        .allow('')
        .messages({
            'string.base': 'Household registration must be a valid public_id'
        })
});

// Schema cho tạo học sinh
const createStudentSchema = baseStudentSchema;

// Schema cho cập nhật học sinh
const updateStudentSchema = baseStudentSchema.fork(
    [
        'name', 'dateOfBirth', 'gender', 'fatherFullname', 'fatherOccupation',
        'motherFullname', 'motherOccupation', 'gradeLevel', 'school', 'class',
        'educationSystem'
    ],
    (schema) => schema.optional()
);

const validateStudent = (data, operation = 'create') => {
    const schema = operation === 'create' ? createStudentSchema : updateStudentSchema;
    return schema.validate(data, { abortEarly: false });
};

module.exports = {
    validateStudent
};