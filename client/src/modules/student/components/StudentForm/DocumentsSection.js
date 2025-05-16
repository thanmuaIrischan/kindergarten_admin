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
                    name="studentDocument.image"
                    value={formData.studentDocument?.image}
                    onChange={handleFileChange}
                    accept="image/*"
                    error={errors.studentDocument?.image}
                />
                <DocumentUpload
                    title="Birth Certificate"
                    name="studentDocument.birthCertificate"
                    value={formData.studentDocument?.birthCertificate}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    error={errors.studentDocument?.birthCertificate}
                />
                <DocumentUpload
                    title="Household Registration"
                    name="studentDocument.householdRegistration"
                    value={formData.studentDocument?.householdRegistration}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    error={errors.studentDocument?.householdRegistration}
                />
            </Stack>
        </FormSection>
    );
};

export default DocumentsSection;