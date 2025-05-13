import React from 'react';
import FormSection from './FormSection';
import InputField from './InputField';

const EducationInfoSection = ({ formData, errors, handleInputChange, handleBlur }) => {
    return (
        <FormSection title="Education Information">
            <InputField
                required
                name="gradeLevel"
                label="Grade Level"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.gradeLevel}
                helperText={errors.gradeLevel}
            />
            <InputField
                required
                name="school"
                label="School"
                value={formData.school}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.school}
                helperText={errors.school}
            />
            <InputField
                required
                name="class"
                label="Class"
                value={formData.class}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.class}
                helperText={errors.class}
            />
            <InputField
                required
                name="educationSystem"
                label="Education System"
                value={formData.educationSystem}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.educationSystem}
                helperText={errors.educationSystem}
            />
        </FormSection>
    );
};

export default EducationInfoSection; 