import React from 'react';
import { Stack, Alert } from '@mui/material';
import FormSection from './FormSection';
import DocumentUpload from './DocumentUpload';

const DocumentsSection = ({ formData, errors, handleFileChange, uploadError }) => {
    return (
        <FormSection title="Required Documents">
            <Stack spacing={3}>
                {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {uploadError}
                    </Alert>
                )}
                <DocumentUpload
                    title="Student Photo"
                    name="image"
                    value={formData.image}
                    onChange={handleFileChange}
                    accept="image/*"
                    error={errors.image}
                />
                <DocumentUpload
                    title="Birth Certificate"
                    name="birthCertificate"
                    value={formData.birthCertificate}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    error={errors.birthCertificate}
                />
                <DocumentUpload
                    title="Household Registration"
                    name="householdRegistration"
                    value={formData.householdRegistration}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    error={errors.householdRegistration}
                />
            </Stack>
        </FormSection>
    );
};

export default DocumentsSection;