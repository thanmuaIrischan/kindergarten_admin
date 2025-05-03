import React, { useEffect } from 'react';
import {
    TextField,
    Box,
    Button,
    Typography,
    Paper,
    Stack,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const TeacherForm = ({ onSubmit, isLoading, initialData, onBack, isViewMode = false }) => {
    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        teacherID: initialData?.teacherID || '',
        gender: initialData?.gender || '',
        phone: initialData?.phone || '',
        dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
        avatar: initialData?.avatar || ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                teacherID: initialData.teacherID || '',
                gender: initialData.gender || '',
                phone: initialData.phone || '',
                dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
                avatar: initialData.avatar || ''
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
        const submitData = {
            ...formData,
            dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, 'dd-MM-yyyy') : '',
        };
        onSubmit(submitData);
    };

    return (
        <Box component={Paper} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                >
                    Back
                </Button>
                <Typography variant="h5" component="h2">
                    {isViewMode ? 'Teacher Details' : (initialData ? 'Edit Teacher' : 'Add Teacher')}
                </Typography>
            </Stack>

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                    />

                    <TextField
                        label="Teacher ID"
                        name="teacherID"
                        value={formData.teacherID}
                        onChange={handleChange}
                        required
                        disabled={isViewMode || initialData}
                        helperText={initialData && "Teacher ID cannot be changed"}
                    />

                    <FormControl required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            label="Gender"
                            disabled={isViewMode}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                        helperText="Format: +1234567890 or 1234567890"
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
                            disabled={isViewMode}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    required
                                    helperText="DD-MM-YYYY"
                                />
                            )}
                        />
                    </LocalizationProvider>

                    {!isViewMode && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                    color: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                                    }
                                }}
                            >
                                {isLoading ? 'Saving...' : (initialData ? 'Update Teacher' : 'Add Teacher')}
                            </Button>
                        </Box>
                    )}
                </Stack>
            </form>
        </Box>
    );
};

export default TeacherForm; 