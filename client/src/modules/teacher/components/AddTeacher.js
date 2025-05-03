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
    Avatar,
    IconButton,
    Alert,
    Snackbar,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTeacher } from '../api/teacher.api';
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

// Add debug logging
console.log('Cloudinary Config:', {
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    cloudName: CLOUDINARY_CLOUD_NAME
});

const AddTeacher = ({ onBack }) => {
    const theme = useTheme();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let avatarUrl = '';

            // Upload image to Cloudinary if a file is selected
            if (selectedFile) {
                if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
                    console.error('Missing Cloudinary config:', {
                        cloudName: CLOUDINARY_CLOUD_NAME,
                        uploadPreset: CLOUDINARY_UPLOAD_PRESET
                    });
                    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
                }

                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

                try {
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                        formData,
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

            // Create teacher with avatar URL
            await createTeacher({
                ...formData,
                avatar: avatarUrl,
                dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null
            });

            onBack();
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Failed to create teacher. Please try again.');
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

    const handleCloseError = () => {
        setError('');
    };

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5" component="h2" sx={{
                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                        flexGrow: 1
                    }}>
                        Add New Teacher
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
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Teacher ID"
                        name="teacherID"
                        value={formData.teacherID}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            label="Gender"
                            disabled={loading}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                    />

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
                                    disabled={loading}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                        type="button"
                        onClick={onBack}
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
                        {loading ? <CircularProgress size={24} /> : 'Add Teacher'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddTeacher; 