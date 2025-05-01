import React, { useEffect } from 'react';
import {
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Box,
    Button,
    Typography,
    useTheme,
    Divider,
    Paper,
    alpha,
    Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Save as SaveIcon } from '@mui/icons-material';

const StudentForm = ({ onSubmit, isLoading, initialData, activeStep, onBack }) => {
    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
        gender: initialData?.gender || '',
        parentName: initialData?.parentName || '',
        parentContact: initialData?.parentContact || '',
        parentEmail: initialData?.parentEmail || '',
        address: initialData?.address || '',
        enrollmentDate: initialData?.enrollmentDate ? new Date(initialData.enrollmentDate) : new Date(),
        class: initialData?.class || '',
        medicalConditions: initialData?.medicalConditions || [],
        emergencyContact: {
            name: initialData?.emergencyContact?.name || '',
            relationship: initialData?.emergencyContact?.relationship || '',
            phone: initialData?.emergencyContact?.phone || ''
        },
        studentPhoto: initialData?.studentPhoto || null,
        transcriptPhoto: initialData?.transcriptPhoto || null,
        householdRegistration: initialData?.householdRegistration || null
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/student/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file. Please try again.');
                }

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message || 'Failed to upload file');
                }

                setFormData(prev => ({
                    ...prev,
                    [name]: {
                        url: data.url,
                        public_id: data.public_id
                    }
                }));
            } catch (error) {
                console.error('Error uploading file:', error);
                alert(error.message || 'Failed to upload file. Please try again.');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            medicalConditions: typeof formData.medicalConditions === 'string'
                ? formData.medicalConditions.split(',').map(condition => condition.trim())
                : Array.isArray(formData.medicalConditions)
                    ? formData.medicalConditions
                    : [],
            dateOfBirth: formData.dateOfBirth instanceof Date
                ? formData.dateOfBirth.toISOString()
                : formData.dateOfBirth,
            enrollmentDate: formData.enrollmentDate instanceof Date
                ? formData.enrollmentDate.toISOString()
                : formData.enrollmentDate
        };
        onSubmit(submitData);
    };

    const FormSection = ({ title, children }) => (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.1)
                    : alpha(theme.palette.background.paper, 0.9),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '4px 0 0 4px'
                }
            }}
        >
            <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    mb: 3,
                    pl: 1
                }}
            >
                {title}
            </Typography>
            <Stack spacing={3}>
                {children}
            </Stack>
        </Paper>
    );

    const InputField = ({ multiline, rows, ...props }) => (
        <TextField
            fullWidth
            {...props}
            multiline={multiline}
            rows={rows}
            sx={{
                '& .MuiOutlinedInput-root': {
                    height: multiline ? 'auto' : '56px',
                    backgroundColor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.1)
                        : alpha(theme.palette.background.paper, 0.9),
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.15)
                            : alpha(theme.palette.background.paper, 1)
                    }
                }
            }}
        />
    );

    const renderBasicInfo = () => (
        <FormSection title="Personal Information">
            <InputField
                required
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
            />
            <InputField
                required
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
            />
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
                    <InputField
                        {...params}
                        required
                    />
                )}
            />
            <FormControl
                fullWidth
                required
                sx={{
                    '& .MuiOutlinedInput-root': {
                        height: '56px',
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.1)
                            : alpha(theme.palette.background.paper, 0.9),
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.15)
                                : alpha(theme.palette.background.paper, 1)
                        }
                    }
                }}
            >
                <InputLabel>Gender</InputLabel>
                <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
            </FormControl>
        </FormSection>
    );

    const renderParentInfo = () => (
        <FormSection title="Parent Information">
            <InputField
                required
                name="parentName"
                label="Parent Name"
                value={formData.parentName}
                onChange={handleChange}
            />
            <InputField
                required
                name="parentContact"
                label="Parent Contact"
                value={formData.parentContact}
                onChange={handleChange}
            />
            <InputField
                name="parentEmail"
                label="Parent Email"
                type="email"
                value={formData.parentEmail}
                onChange={handleChange}
            />
            <InputField
                required
                name="address"
                label="Address"
                multiline
                rows={4}
                value={formData.address}
                onChange={handleChange}
            />
        </FormSection>
    );

    const renderDocuments = () => (
        <FormSection title="Required Documents">
            <Stack spacing={3}>
                {['studentPhoto', 'transcriptPhoto', 'householdRegistration'].map((docType) => (
                    <Box
                        key={docType}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: `1px dashed ${theme.palette.divider}`,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.background.paper, 0.05)
                            }
                        }}
                    >
                        <input
                            accept={docType === 'studentPhoto' ? 'image/*' : 'image/*,.pdf'}
                            style={{ display: 'none' }}
                            id={docType}
                            type="file"
                            name={docType}
                            onChange={handleFileChange}
                        />
                        <label htmlFor={docType}>
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{
                                    height: '56px',
                                    borderColor: theme.palette.divider,
                                    color: theme.palette.text.primary,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: 'transparent'
                                    }
                                }}
                            >
                                {formData[docType]
                                    ? `Change ${docType.replace(/([A-Z])/g, ' $1').trim()}`
                                    : `Upload ${docType.replace(/([A-Z])/g, ' $1').trim()}`}
                            </Button>
                        </label>
                        {formData[docType] && (
                            <Typography
                                variant="caption"
                                display="block"
                                sx={{
                                    mt: 1,
                                    color: theme.palette.success.main,
                                    textAlign: 'center'
                                }}
                            >
                                Uploaded successfully
                            </Typography>
                        )}
                    </Box>
                ))}
            </Stack>
        </FormSection>
    );

    const renderReview = () => (
        <FormSection title="Review Information">
            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {`${formData.firstName} ${formData.lastName}`}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Gender
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.gender}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.dateOfBirth?.toLocaleDateString()}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Parent Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.parentName}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Address
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.address}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Documents Status
                    </Typography>
                    <Stack spacing={1}>
                        <Typography variant="body1" color={formData.studentPhoto ? 'success.main' : 'error.main'}>
                            • Student Photo: {formData.studentPhoto ? 'Uploaded' : 'Missing'}
                        </Typography>
                        <Typography variant="body1" color={formData.transcriptPhoto ? 'success.main' : 'error.main'}>
                            • Transcript: {formData.transcriptPhoto ? 'Uploaded' : 'Missing'}
                        </Typography>
                        <Typography variant="body1" color={formData.householdRegistration ? 'success.main' : 'error.main'}>
                            • Household Registration: {formData.householdRegistration ? 'Uploaded' : 'Missing'}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </FormSection>
    );

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <>
                        {renderBasicInfo()}
                        {renderParentInfo()}
                    </>
                );
            case 1:
                return renderDocuments();
            case 2:
                return renderReview();
            default:
                return null;
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit}>
                {renderStepContent()}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 4
                    }}
                >
                    {onBack && (
                        <Button
                            onClick={onBack}
                            startIcon={<ChevronLeftIcon />}
                            disabled={isLoading}
                            sx={{
                                color: theme.palette.text.primary,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.text.primary, 0.08)
                                }
                            }}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        endIcon={activeStep === 2 ? <SaveIcon /> : <ChevronRightIcon />}
                        sx={{
                            minWidth: 120,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}
                    >
                        {isLoading
                            ? 'Saving...'
                            : activeStep === 2
                                ? 'Save Student'
                                : 'Next'}
                    </Button>
                </Box>
            </form>
        </LocalizationProvider>
    );
};

export default StudentForm; 