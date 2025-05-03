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
    Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createClass } from '../api/class.api';
import { getAllTeachers } from '../../teacher/api/teacher.api';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AddClass = ({ onBack }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        className: '',
        teacherID: '',
        semesterID: '',
        teacherName: '',
    });
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [teacherLoading, setTeacherLoading] = useState(false);

    useEffect(() => {
        fetchSemesters();
        fetchAllTeachers();
    }, []);

    const fetchAllTeachers = async () => {
        setTeacherLoading(true);
        try {
            const response = await getAllTeachers();
            setTeachers(response.data || []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setTeacherLoading(false);
        }
    };

    const fetchSemesters = async () => {
        try {
            const response = await axios.get(`${API_URL}/semester`);
            setSemesters(response.data.data || []);
        } catch (error) {
            console.error('Error fetching semesters:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const classData = {
                className: formData.className,
                teacherID: formData.teacherID,
                semesterID: formData.semesterID,
            };
            await createClass(classData);
            if (onBack) {
                onBack({
                    type: 'success',
                    message: `Class "${formData.className}" has been successfully created with teacher ${formData.teacherName}`,
                    open: true
                });
            }
        } catch (error) {
            console.error('Error creating class:', error);
            setFormData(prev => ({
                ...prev,
                error: 'Failed to create class. Please try again.'
            }));
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
        <Box
            className="class-form-container"
            sx={{
                width: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
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
                        Add New Class
                    </Typography>
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Stack
                        spacing={3}
                        sx={{
                            width: '100%',
                            flex: 1
                        }}
                    >
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

                        <Autocomplete
                            options={teachers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (ID: ${option.teacherID})`}
                            loading={teacherLoading}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    teacherID: newValue ? newValue.teacherID : '',
                                    teacherName: newValue ? `${newValue.firstName} ${newValue.lastName}` : ''
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Teacher"
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

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                onClick={onBack}
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f1f5f9',
                                    },
                                    minWidth: '120px',
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
                                    minWidth: '120px',
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create Class'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddClass; 