import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { format, parse } from 'date-fns';
import FormSection from './FormSection';

const ReviewSection = ({ formData }) => {
    const [day, month, year] = formData?.dateOfBirth.split("-");
    return (
        <FormSection title="Review Information">
            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Student ID
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.studentID}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.name}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Gender
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.gender}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.dateOfBirth}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Education Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Grade Level: {formData.gradeLevel}
                    </Typography>
                    <Typography variant="body1">
                        School: {formData.school}
                    </Typography>
                    <Typography variant="body1">
                        Class: {formData.class}
                    </Typography>
                    <Typography variant="body1">
                        Education System: {formData.educationSystem}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Parent Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Father's Name: {formData.fatherFullname || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        Father's Occupation: {formData.fatherOccupation || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        Mother's Name: {formData.motherFullname || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        Mother's Occupation: {formData.motherOccupation || 'N/A'}
                    </Typography>
                </Box>
            </Stack>
        </FormSection>
    );
};

export default ReviewSection; 