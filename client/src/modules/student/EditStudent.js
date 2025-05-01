import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import StudentForm from './components/StudentForm';

const EditStudent = ({ id, onBack }) => {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await fetch(`/api/students/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student');
            }
            const data = await response.json();
            setStudent(data);
        } catch (error) {
            console.error('Error fetching student:', error);
            alert('Failed to fetch student details. Redirecting to list.');
            onBack();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (studentData) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            if (!response.ok) {
                throw new Error('Failed to update student');
            }

            onBack();
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student. Please try again.');
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
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Student
                </Typography>
                <Button variant="outlined" onClick={onBack}>
                    Back to List
                </Button>
            </Box>
            <Paper sx={{ p: 3 }}>
                <StudentForm
                    student={student}
                    onSubmit={handleSubmit}
                    isLoading={isSaving}
                />
            </Paper>
        </Box>
    );
};

export default EditStudent; 