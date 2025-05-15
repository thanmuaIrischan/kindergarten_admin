import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import EditStudentForm from './components/EditStudentForm/EditStudentForm';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const steps = ['Basic Information', 'Education & Parent Info', 'Documents', 'Review'];

const EditStudent = ({ id, onBack, onSubmit }) => {
    const theme = useTheme();
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [studentData, setStudentData] = useState(null);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await axios.get(`${API_URL}/student/${id}`);
            if (response.data && response.data.success) {
                setStudent(response.data.data);
                setStudentData(response.data.data);
            } else {
                throw new Error('Failed to fetch student');
            }
        } catch (error) {
            console.error('Error fetching student:', error);
            setError('Failed to fetch student details. Redirecting to list.');
            setTimeout(() => {
                onBack();
            }, 2000);
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

    const handleSubmit = async (formData) => {
        setIsSaving(true);
        setError('');
        try {
            const response = await axios.put(`${API_URL}/student/${id}`, formData);
            if (response.data && response.data.success) {
                onSubmit(response.data.data);
            } else {
                throw new Error(response.data.error || 'Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            setError(error.message || 'Failed to update student. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

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
                                Edit Student
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Main Content */}
                <Paper
                    elevation={theme.palette.mode === 'dark' ? 2 : 1}
                    sx={{
                        p: 3,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

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

                    <Box sx={{ p: 3, backgroundColor: 'transparent' }}>
                        <EditStudentForm
                            onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                            isLoading={isSaving}
                            studentData={studentData}
                            activeStep={activeStep}
                            onBack={activeStep === 0 ? null : handleBack}
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default EditStudent; 