import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTeacher } from '../api/teacher.api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddTeacher = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        teacherID: '',
        gender: '',
        phone: '',
        dateOfBirth: null,
        email: '',
        address: '',
        avatar: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTeacher(formData);
            navigate('/teachers', {
                state: {
                    notification: {
                        type: 'success',
                        message: 'Teacher created successfully'
                    }
                }
            });
        } catch (error) {
            console.error('Error creating teacher:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h5" component="h2" sx={{ mb: 3, color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937' }}>
                    Add New Teacher
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Teacher ID"
                            name="teacherID"
                            value={formData.teacherID}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                label="Gender"
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date of Birth"
                                value={formData.dateOfBirth}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        dateOfBirth: newValue
                                    }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        type="button"
                        onClick={() => navigate('/teachers')}
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f1f5f9',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Teacher'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddTeacher; 