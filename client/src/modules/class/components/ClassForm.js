import React, { useEffect } from 'react';
import {
    TextField,
    Box,
    Button,
    Typography,
    Paper,
    Stack,
    useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ClassForm = ({ onSubmit, isLoading, initialData, onBack }) => {
    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        className: initialData?.className || '',
        teacherID: initialData?.teacherID || '',
        studentIDs: initialData?.studentIDs || [],
        semesterID: initialData?.semesterID || ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                className: initialData.className || '',
                teacherID: initialData.teacherID || '',
                studentIDs: initialData.studentIDs || [],
                semesterID: initialData.semesterID || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box className="class-form-container">
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
            >
                <Box display="flex" alignItems="center" mb={3}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{
                            mr: 2,
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(44, 62, 80, 0.08)',
                            }
                        }}
                    >
                        Back to List
                    </Button>
                    <Typography variant="h6" color="primary">
                        {initialData ? 'Edit Class' : 'Add New Class'}
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ maxWidth: '600px', margin: '0 auto' }}>
                        <TextField
                            fullWidth
                            label="Class Name"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                    },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Teacher ID"
                            name="teacherID"
                            value={formData.teacherID}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                    },
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={onBack}
                                sx={{
                                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                    '&:hover': {
                                        borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#2563eb' : '#1d4ed8',
                                    },
                                }}
                            >
                                {initialData ? 'Update Class' : 'Create Class'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default ClassForm; 