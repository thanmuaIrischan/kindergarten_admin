import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    useTheme,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Fade,
    alpha
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import StudentForm from './components/StudentForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const steps = ['Basic Information', 'Documents', 'Review'];

const AddStudent = ({ onBack }) => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [studentData, setStudentData] = useState(null);

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        setError('');
        try {
            console.log('Raw form data:', formData); // Debug log for raw data

            // Deep clone and sanitize the data to remove any undefined values
            const sanitizedFormData = formData;

            console.log('Sanitized form data structure:', {
                hasStudentProfile: !!sanitizedFormData.studentProfile,
                studentProfileFields: sanitizedFormData.studentProfile ? Object.keys(sanitizedFormData.studentProfile) : [],
                studentProfileValues: sanitizedFormData.studentProfile || {},
                documentFields: sanitizedFormData.studentDocument ? Object.keys(sanitizedFormData.studentDocument) : [],
            }); // Debug log

            // Validate required fields
            const requiredFields = [
                'studentID',
                'name',
                'dateOfBirth',
                'gender',
                'gradeLevel',
                'class'
            ];

            console.log('Checking required fields:', {
                requiredFields,
                presentFields: requiredFields.map(field => ({
                    field,
                    value: sanitizedFormData.studentProfile[field],
                    exists: !!sanitizedFormData.studentProfile[field]
                }))
            }); // Debug log

            const missingFields = requiredFields.filter(
                field => !sanitizedFormData.studentProfile[field]
            );

            if (missingFields.length > 0) {
                console.log('Missing fields detected:', {
                    missingFields,
                    formValues: sanitizedFormData.studentProfile
                }); // Debug log
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            console.log('All required fields present, sending to server:', sanitizedFormData); // Debug log

            const response = await fetch(`${API_URL}/student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedFormData),
            });

            const data = await response.json();
            console.log('Server response:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create student');
            }

            if (data.success) {
                onBack();
            } else {
                throw new Error(data.error || 'Failed to create student');
            }
        } catch (error) {
            console.error('Error creating student:', error);
            setError(error.message || 'Failed to create student. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = (data) => {
        setStudentData(data);
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    minHeight: '80vh'
                }}
            >
                {/* Header */}
                <Paper
                    elevation={theme.palette.mode === 'dark' ? 2 : 1}
                    sx={{
                        p: 2,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.primary.dark, 0.2)
                            : alpha(theme.palette.primary.light, 0.1),
                        borderRadius: 2,
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={onBack}
                                sx={{
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                Back
                            </Button>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Add New Student
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Main Content */}
                <Paper
                    elevation={theme.palette.mode === 'dark' ? 3 : 1}
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        flex: 1
                    }}
                >
                    {/* Stepper */}
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.primary.dark, 0.1)
                                : alpha(theme.palette.primary.light, 0.1),
                            borderBottom: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Stepper
                            activeStep={activeStep}
                            alternativeLabel
                            sx={{
                                '& .MuiStepLabel-label': {
                                    color: theme.palette.text.primary,
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease-in-out',
                                    '&.Mui-active': {
                                        color: theme.palette.primary.main,
                                        fontWeight: 600
                                    }
                                },
                                '& .MuiStepIcon-root': {
                                    color: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.primary.main, 0.5)
                                        : theme.palette.primary.light,
                                    '&.Mui-active': {
                                        color: theme.palette.primary.main
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                },
                                '& .MuiStepIcon-root.Mui-completed': {
                                    color: theme.palette.success.main
                                },
                                '& .MuiStepConnector-line': {
                                    borderColor: theme.palette.divider
                                }
                            }}
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <Fade in={!!error}>
                            <Alert
                                severity="error"
                                sx={{
                                    mx: 3,
                                    mt: 3,
                                    borderRadius: 1,
                                    '& .MuiAlert-icon': {
                                        color: theme.palette.error.main
                                    }
                                }}
                                onClose={() => setError('')}
                            >
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    {/* Form */}
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: 'transparent'
                        }}
                    >
                        <StudentForm
                            onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                            isLoading={isLoading}
                            initialData={studentData}
                            activeStep={activeStep}
                            onBack={activeStep === 0 ? null : handleBack}
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default AddStudent; 