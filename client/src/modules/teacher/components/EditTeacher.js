import React, { useState, useEffect } from 'react';
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
    Alert,
    Snackbar,
    Stack,
    Avatar,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateTeacher } from '../api/teacher.api';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { ArrowBack as ArrowBackIcon, PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

const EditTeacher = ({ teacher, onBack }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        teacherID: '',
        gender: '',
        phone: '',
        dateOfBirth: null,
        avatar: ''
    });

    useEffect(() => {
        if (teacher) {
            setFormData({
                firstName: teacher.firstName || '',
                lastName: teacher.lastName || '',
                teacherID: teacher.teacherID || '',
                gender: teacher.gender || '',
                phone: teacher.phone || '',
                dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth) : null,
                avatar: teacher.avatar || ''
            });
        }
    }, [teacher]);

    const validateForm = () => {
        if (!formData.firstName.trim()) return 'First name is required';
        if (!formData.lastName.trim()) return 'Last name is required';
        if (!formData.teacherID.trim()) return 'Teacher ID is required';
        if (!formData.gender) return 'Gender is required';
        if (!formData.phone.trim()) return 'Phone number is required';
        if (!formData.dateOfBirth) return 'Date of birth is required';

        // Phone number validation - Updated to accept Vietnamese phone numbers
        const phoneRegex = /^(0|\+84|84)?([3|5|7|8|9])([0-9]{8})$/;
        if (!phoneRegex.test(formData.phone.trim())) {
            return 'Invalid phone number format. Please use Vietnamese phone number format (e.g., 0912345678 or +84912345678)';
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            let avatarUrl = formData.avatar;

            // Upload new image to Cloudinary if a file is selected
            if (selectedFile) {
                if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
                    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
                }

                const cloudinaryFormData = new FormData();
                cloudinaryFormData.append('file', selectedFile);
                cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                cloudinaryFormData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

                try {
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                        cloudinaryFormData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );

                    if (response.data && response.data.secure_url) {
                        avatarUrl = response.data.secure_url;
                    } else {
                        throw new Error('Failed to get image URL from Cloudinary');
                    }
                } catch (uploadError) {
                    console.error('Cloudinary Upload Error:', uploadError);
                    throw new Error(uploadError.response?.data?.message || 'Failed to upload image to Cloudinary');
                }
            }

            const formattedData = {
                ...formData,
                dateOfBirth: format(formData.dateOfBirth, 'dd-MM-yyyy'),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                teacherID: formData.teacherID.trim(),
                phone: formData.phone.trim(),
                avatar: avatarUrl
            };

            await updateTeacher(teacher.id, formattedData);

            if (onBack) {
                onBack();
            } else {
                navigate('/teachers', {
                    state: {
                        notification: {
                            type: 'success',
                            message: 'Teacher updated successfully'
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
            setError(error.response?.data?.message || 'Error updating teacher. Please try again.');
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
        setError('');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setSelectedFile(file);
            setFormData(prev => ({
                ...prev,
                avatar: URL.createObjectURL(file)
            }));
        }
    };

    if (!teacher) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Typography variant="h6" color="error">Teacher not found</Typography>
            </Box>
        );
    }

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
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack || (() => navigate('/teachers'))}
                    >
                        Back
                    </Button>
                    <Typography variant="h5" component="h2" sx={{
                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                        flexGrow: 1
                    }}>
                        Edit Teacher
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={formData.avatar}
                            sx={{ width: 56, height: 56 }}
                        />
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            disabled={loading}
                        >
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleAvatarChange}
                            />
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                </Stack>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={true}
                            helperText="Teacher ID cannot be changed"
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
                        <FormControl fullWidth required disabled={loading}>
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
                            disabled={loading}
                            helperText="Format: 0xxxxxxxxx or +84xxxxxxxxx"
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
                                    setError('');
                                }}
                                disabled={loading}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        fullWidth: true,
                                        helperText: 'DD-MM-YYYY',
                                        sx: {
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                                },
                                            },
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        type="button"
                        onClick={onBack || (() => navigate('/teachers'))}
                        disabled={loading}
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
                            backgroundColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2563eb' : '#1d4ed8',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditTeacher; 