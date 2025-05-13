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
    Fade
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import StudentForm from './components/StudentForm';
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
                onBack();
            } else {
                throw new Error('Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            setError(error.response?.data?.message || 'Failed to update student. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ width: '100%', maxWidth: '100%', p: 2 }}>
                <Paper
                    sx={{
                        p: 3,
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                        borderRadius: 2,
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                            : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Edit Student
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={onBack}
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                borderColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                '&:hover': {
                                    borderColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2471a3',
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(41, 128, 185, 0.1)',
                                },
                            }}
                        >
                            Back to List
                        </Button>
                    </Box>

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
                        <StudentForm
                            onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                            isLoading={isSaving}
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

export default EditStudent; 