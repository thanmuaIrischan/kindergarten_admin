import React from 'react';
import FormSection from './FormSection';
import InputField from './InputField';

const ParentInfoSection = ({ formData, errors, handleInputChange, handleBlur }) => {
    return (
        <FormSection title="Parent Information">
            <InputField
                required
                name="fatherFullname"
                label="Father's Name"
                value={formData.fatherFullname}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.fatherFullname}
                helperText={errors.fatherFullname}
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
                name="motherFullname"
                label="Mother's Name"
                value={formData.motherFullname}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.motherFullname}
                helperText={errors.motherFullname}
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