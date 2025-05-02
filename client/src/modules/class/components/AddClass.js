import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createClass } from '../api/class.api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AddClass = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        className: '',
        teacherID: '',
        semesterID: '',
    });
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [searchTeacher, setSearchTeacher] = useState('');
    const [teacherLoading, setTeacherLoading] = useState(false);

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (searchTeacher) {
            searchTeachers();
        }
    }, [searchTeacher]);

    const fetchSemesters = async () => {
        try {
            const response = await axios.get(`${API_URL}/semester`);
            setSemesters(response.data.data || []);
        } catch (error) {
            console.error('Error fetching semesters:', error);
        }
    };

    const searchTeachers = async () => {
        setTeacherLoading(true);
        try {
            const response = await axios.get(`${API_URL}/teacher/search?query=${searchTeacher}`);
            setTeachers(response.data.data || []);
        } catch (error) {
            console.error('Error searching teachers:', error);
        } finally {
            setTeacherLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createClass(formData);
            navigate('/classes', {
                state: {
                    notification: {
                        type: 'success',
                        message: 'Class created successfully'
                    }
                }
            });
        } catch (error) {
            console.error('Error creating class:', error);
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
                    Add New Class
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Class Name"
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
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
                            '& .MuiInputLabel-root': {
                                color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                            },
                            '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            },
                        }}
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Autocomplete
                        options={teachers}
                        getOptionLabel={(option) => `${option.firstName} ${option.lastName} (ID: ${option.teacherID})`}
                        loading={teacherLoading}
                        onInputChange={(event, newValue) => {
                            setSearchTeacher(newValue);
                        }}
                        onChange={(event, newValue) => {
                            setFormData(prev => ({
                                ...prev,
                                teacherID: newValue ? newValue.teacherID : ''
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Teacher"
                                required
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {teacherLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
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
                                    '& .MuiInputLabel-root': {
                                        color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                    },
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                <Box>
                                    <Typography variant="body1">
                                        {option.firstName} {option.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {option.teacherID} • Phone: {option.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    />
                </Box>

                <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="semester-label" sx={{ color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b' }}>
                            Semester
                        </InputLabel>
                        <Select
                            labelId="semester-label"
                            name="semesterID"
                            value={formData.semesterID}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                },
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            }}
                        >
                            {semesters.map((semester) => (
                                <MenuItem key={semester.id} value={semester.id}>
                                    {semester.semesterName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        type="button"
                        onClick={() => navigate('/classes')}
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
                        {loading ? <CircularProgress size={24} /> : 'Create Class'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddClass; 