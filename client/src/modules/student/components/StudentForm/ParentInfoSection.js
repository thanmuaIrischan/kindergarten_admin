import React from 'react';
import FormSection from './FormSection';
import InputField from './InputField';

const ParentInfoSection = ({ formData, errors, handleInputChange, handleBlur }) => {
    return (
        <FormSection title="Parent Information">
            <InputField
                required
                name="fatherName"
                label="Father's Name"
                value={formData.fatherName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.fatherName}
                helperText={errors.fatherName}
            />
            <InputField
                required
                name="fatherOccupation"
                label="Father's Occupation"
                value={formData.fatherOccupation}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.fatherOccupation}
                helperText={errors.fatherOccupation}
            />
            <InputField
                required
                name="motherName"
                label="Mother's Name"
                value={formData.motherName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.motherName}
                helperText={errors.motherName}
            />
            <InputField
                required
                name="motherOccupation"
                label="Mother's Occupation"
                value={formData.motherOccupation}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.motherOccupation}
                helperText={errors.motherOccupation}
            />
        </FormSection>
    );
};

export default ParentInfoSection; 