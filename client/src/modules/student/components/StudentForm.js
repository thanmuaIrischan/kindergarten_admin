import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
    Stack,
    Alert,
    IconButton,
    CircularProgress,
    InputAdornment,
    FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Save as SaveIcon, Upload as UploadIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { format, parse } from 'date-fns';
import debounce from 'lodash/debounce';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to format field name for error messages
const formatFieldName = (name) => {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2');
};

// Validation helper functions
const validationHelpers = {
    isEmptyOrWhitespace: (str) => {
        return !str || str.trim().length === 0;
    },
    
    isOnlySpaces: (str) => {
        return str && str.trim().length === 0;
    },
    
    isValidInput: (str) => {
        return str && str.trim().length > 0;
    }
};

const DocumentUpload = ({ title, name, value, onChange, accept, error }) => {
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (!file) return;

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert('File size should be less than 5MB');
            return;
        }

        const event = {
            target: {
                name,
                files: [file]
            }
        };
        onChange(event);
    };

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 2,
                border: `1px dashed ${error ? theme.palette.error.main : isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                transition: 'all 0.2s ease-in-out',
                backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                accept={accept}
                style={{ display: 'none' }}
                id={name}
                type="file"
                name={name}
                onChange={(e) => handleFile(e.target.files[0])}
            />
            <label htmlFor={name}>
                <Button
                    component="span"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{
                        width: '100%',
                        height: '100px',
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        '&:hover': {
                            borderStyle: 'dashed',
                            borderWidth: '2px'
                        }
                    }}
                >
                    {value ? (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Box
                                component="img"
                                src={value.url}
                                alt={title}
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '80px',
                                    objectFit: 'contain'
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange({ target: { name, value: null } });
                                }}
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -8,
                                    backgroundColor: theme.palette.background.paper,
                                    '&:hover': {
                                        backgroundColor: theme.palette.error.light
                                    }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ) : (
                        <Typography>
                            Click or drag to upload {title}
                        </Typography>
                    )}
                </Button>
            </label>
            {error && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

const StudentForm = ({ onSubmit, isLoading, initialData, activeStep, onBack }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        studentID: initialData?.studentID || '',
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        name: initialData?.name || '',
        dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
        gender: initialData?.gender || '',
        gradeLevel: initialData?.gradeLevel || '',
        school: initialData?.school || '',
        class: initialData?.class || '',
        educationSystem: initialData?.educationSystem || '',
        fatherName: initialData?.fatherName || '',
        fatherOccupation: initialData?.fatherOccupation || '',
        motherName: initialData?.motherName || '',
        motherOccupation: initialData?.motherOccupation || '',
        image: initialData?.image || null,
        birthCertificate: initialData?.birthCertificate || null,
        householdRegistration: initialData?.householdRegistration || null
    });

    const [errors, setErrors] = useState({});
    const [uploadError, setUploadError] = useState('');
    const [isCheckingID, setIsCheckingID] = useState(false);
    const [isValidID, setIsValidID] = useState(false);

    const validateInput = useCallback((name, value) => {
        if (validationHelpers.isEmptyOrWhitespace(value)) {
            return `${formatFieldName(name)} is required`;
        }
        if (validationHelpers.isOnlySpaces(value)) {
            return `${formatFieldName(name)} cannot contain only spaces`;
        }
        return '';
    }, []);

    // Debounced student ID check
    const debouncedCheckStudentID = useCallback(
        debounce(async (studentID) => {
            if (!studentID || validationHelpers.isEmptyOrWhitespace(studentID)) return;
            
            setIsCheckingID(true);
            try {
                const response = await fetch(`${API_URL}/student/check-id/${studentID}`);
                if (!response.ok) {
                    throw new Error('Failed to check student ID');
                }

                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.error || 'Failed to check student ID');
                }
                
                if (data.exists) {
                    setErrors(prev => ({
                        ...prev,
                        studentID: data.message || 'This Student ID already exists'
                    }));
                    setIsValidID(false);
                } else {
                    setErrors(prev => ({
                ...prev,
                        studentID: ''
                    }));
                    setIsValidID(true);
                }
            } catch (error) {
                console.error('Error checking student ID:', error);
                setErrors(prev => ({
                    ...prev,
                    studentID: error.message || 'Error checking student ID'
                }));
                setIsValidID(false);
            } finally {
                setIsCheckingID(false);
            }
        }, 500),
        []
    );

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Update form data
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

        // Immediate validation for all fields
        const errorMessage = validateInput(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));

        // Special handling for student ID
        if (name === 'studentID') {
            setIsValidID(false);
            if (validationHelpers.isValidInput(value)) {
                debouncedCheckStudentID(value);
            }
        }

        // Validate all text inputs for spaces-only
        if (typeof value === 'string') {
            if (validationHelpers.isOnlySpaces(value)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `${formatFieldName(name)} cannot contain only spaces`
                }));
            } else if (validationHelpers.isEmptyOrWhitespace(value)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `${formatFieldName(name)} is required`
                }));
            } else {
                // Clear error if input is valid
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }
        }
    }, [debouncedCheckStudentID, validateInput]);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        
        // Validate on blur for all fields
        if (typeof value === 'string') {
            if (validationHelpers.isOnlySpaces(value)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `${formatFieldName(name)} cannot contain only spaces`
                }));
            } else if (validationHelpers.isEmptyOrWhitespace(value)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `${formatFieldName(name)} is required`
                }));
            }
        }
    }, []);

    const handleDateChange = useCallback((newValue) => {
        setFormData(prev => ({
            ...prev,
            dateOfBirth: newValue
        }));
    }, []);

    const handleFileChange = useCallback(async (e) => {
        const { name, files } = e.target;
        if (!files || !files[0]) return;

            const file = files[0];
        
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                [name]: 'Please upload a valid image file (JPEG, PNG, or GIF)'
            }));
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setErrors(prev => ({
                ...prev,
                [name]: 'File size should be less than 5MB'
            }));
            return;
        }

            try {
                const formData = new FormData();
                formData.append('file', file);
            formData.append('documentType', name);

            const response = await fetch(`${API_URL}/student/document/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload file');
                }

                const data = await response.json();
                if (!data.success) {
                throw new Error(data.error || 'Failed to upload file');
                }

                setFormData(prev => ({
                    ...prev,
                    [name]: {
                    url: data.data.url,
                    public_id: data.data.public_id
                    }
                }));

            // Clear any previous errors
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
            } catch (error) {
                console.error('Error uploading file:', error);
            setErrors(prev => ({
                ...prev,
                [name]: error.message
            }));
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        
        // Validate all fields
        const newErrors = {};
        let hasErrors = false;

        // Helper function to validate a field
        const validateField = (name, value) => {
            const errorMessage = validateInput(name, value);
            if (errorMessage) {
                newErrors[name] = errorMessage;
                hasErrors = true;
            }
        };

        // Validate fields based on current step
        switch (activeStep) {
            case 0: // Basic Information
                validateField('studentID', formData.studentID);
                validateField('firstName', formData.firstName);
                validateField('lastName', formData.lastName);
                validateField('name', formData.name);
                if (!formData.dateOfBirth) {
                    newErrors.dateOfBirth = 'Date of birth is required';
                    hasErrors = true;
                }
                validateField('gender', formData.gender);
                break;
            
            case 1: // Education and Parent Information
                validateField('gradeLevel', formData.gradeLevel);
                validateField('school', formData.school);
                validateField('class', formData.class);
                validateField('educationSystem', formData.educationSystem);
                validateField('fatherName', formData.fatherName);
                validateField('fatherOccupation', formData.fatherOccupation);
                validateField('motherName', formData.motherName);
                validateField('motherOccupation', formData.motherOccupation);
                break;
            
            case 2: // Documents
                if (!formData.image) {
                    newErrors.image = 'Student photo is required';
                    hasErrors = true;
                }
                if (!formData.birthCertificate) {
                    newErrors.birthCertificate = 'Birth certificate is required';
                    hasErrors = true;
                }
                if (!formData.householdRegistration) {
                    newErrors.householdRegistration = 'Household registration is required';
                    hasErrors = true;
                }
                break;
            
            case 3: // Review - Validate all fields
                validateField('studentID', formData.studentID);
                validateField('firstName', formData.firstName);
                validateField('lastName', formData.lastName);
                validateField('name', formData.name);
                if (!formData.dateOfBirth) {
                    newErrors.dateOfBirth = 'Date of birth is required';
                    hasErrors = true;
                }
                validateField('gender', formData.gender);
                validateField('gradeLevel', formData.gradeLevel);
                validateField('school', formData.school);
                validateField('class', formData.class);
                validateField('educationSystem', formData.educationSystem);
                validateField('fatherName', formData.fatherName);
                validateField('fatherOccupation', formData.fatherOccupation);
                validateField('motherName', formData.motherName);
                validateField('motherOccupation', formData.motherOccupation);
                if (!formData.image) {
                    newErrors.image = 'Student photo is required';
                    hasErrors = true;
                }
                if (!formData.birthCertificate) {
                    newErrors.birthCertificate = 'Birth certificate is required';
                    hasErrors = true;
                }
                if (!formData.householdRegistration) {
                    newErrors.householdRegistration = 'Household registration is required';
                    hasErrors = true;
                }
                break;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // Trim all string values before submitting
        const submitData = {
            ...formData,
            studentID: formData.studentID.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            name: formData.name.trim(),
            gradeLevel: formData.gradeLevel.trim(),
            school: formData.school.trim(),
            class: formData.class.trim(),
            educationSystem: formData.educationSystem.trim(),
            fatherName: formData.fatherName.trim(),
            fatherOccupation: formData.fatherOccupation.trim(),
            motherName: formData.motherName.trim(),
            motherOccupation: formData.motherOccupation.trim(),
            dateOfBirth: formData.dateOfBirth instanceof Date
                ? format(formData.dateOfBirth, 'dd-MM-yyyy')
                : formData.dateOfBirth
        };
        onSubmit(submitData);
    }, [formData, onSubmit, activeStep, validateInput]);

    const FormSection = useCallback(({ title, children }) => (
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
    ), [theme]);

    const InputField = useCallback(({ ...props }) => {
        const { name, value, error } = props;
        const isValid = value && !error && !validationHelpers.isEmptyOrWhitespace(value) && !validationHelpers.isOnlySpaces(value);
        const isStudentID = name === 'studentID';

        return (
            <TextField
                {...props}
                fullWidth
                variant="outlined"
                onBlur={handleBlur}
                InputProps={{
                    ...props.InputProps,
                    endAdornment: (
                        <InputAdornment position="end">
                            {isValid && !isStudentID && <CheckCircleIcon color="success" />}
                            {props.InputProps?.endAdornment}
                        </InputAdornment>
                    )
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                        },
                    },
                }}
            />
        );
    }, [theme, handleBlur]);

    const renderBasicInfo = useCallback(() => (
        <FormSection title="Personal Information">
            <InputField
                required
                name="studentID"
                label="Student ID"
                value={formData.studentID}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ 
                    autoComplete: 'off',
                    maxLength: 7,
                    pattern: '[0-9]*'
                }}
                error={!!errors.studentID}
                helperText={errors.studentID}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {isCheckingID ? (
                                <CircularProgress size={20} />
                            ) : isValidID ? (
                                <CheckCircleIcon color="success" />
                            ) : null}
                        </InputAdornment>
                    )
                }}
            />
            <InputField
                required
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.firstName}
                helperText={errors.firstName}
            />
            <InputField
                required
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.lastName}
                helperText={errors.lastName}
            />
            <InputField
                required
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.name}
                helperText={errors.name}
            />
            <DatePicker
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                renderInput={(params) => (
                    <InputField
                        {...params}
                        required
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                    />
                )}
            />
            <FormControl
                fullWidth
                required
                variant="outlined"
                error={!!errors.gender}
            >
                <InputLabel>Gender</InputLabel>
                <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    label="Gender"
                    endAdornment={
                        formData.gender && !errors.gender ? (
                            <InputAdornment position="end">
                                <CheckCircleIcon color="success" />
                            </InputAdornment>
                        ) : null
                    }
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && (
                    <FormHelperText>{errors.gender}</FormHelperText>
                )}
            </FormControl>
        </FormSection>
    ), [FormSection, InputField, formData, handleInputChange, handleDateChange, handleBlur, errors, isCheckingID, isValidID]);

    const renderEducationInfo = useCallback(() => (
        <FormSection title="Education Information">
            <InputField
                required
                name="gradeLevel"
                label="Grade Level"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.gradeLevel}
                helperText={errors.gradeLevel}
            />
            <InputField
                required
                name="school"
                label="School"
                value={formData.school}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.school}
                helperText={errors.school}
            />
            <InputField
                required
                name="class"
                label="Class"
                value={formData.class}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.class}
                helperText={errors.class}
            />
            <InputField
                required
                name="educationSystem"
                label="Education System"
                value={formData.educationSystem}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.educationSystem}
                helperText={errors.educationSystem}
            />
        </FormSection>
    ), [FormSection, InputField, formData, handleInputChange, handleBlur]);

    const renderParentInfo = useCallback(() => (
        <FormSection title="Parent Information">
            <InputField
                required
                name="fatherName"
                label="Father's Name"
                value={formData.fatherName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.fatherName}
                helperText={errors.fatherName}
            />
            <InputField
                required
                name="fatherOccupation"
                label="Father's Occupation"
                value={formData.fatherOccupation}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.fatherOccupation}
                helperText={errors.fatherOccupation}
            />
            <InputField
                required
                name="motherName"
                label="Mother's Name"
                value={formData.motherName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.motherName}
                helperText={errors.motherName}
            />
            <InputField
                required
                name="motherOccupation"
                label="Mother's Occupation"
                value={formData.motherOccupation}
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{ autoComplete: 'off' }}
                error={!!errors.motherOccupation}
                helperText={errors.motherOccupation}
            />
        </FormSection>
    ), [FormSection, InputField, formData, handleInputChange, handleBlur]);

    const renderDocuments = useCallback(() => (
        <FormSection title="Required Documents">
            <Stack spacing={3}>
                {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {uploadError}
                    </Alert>
                )}
                <DocumentUpload
                    title="Student Photo"
                    name="image"
                    value={formData.image}
                    onChange={handleFileChange}
                    accept="image/*"
                    error={errors.image}
                />
                <DocumentUpload
                    title="Birth Certificate"
                    name="birthCertificate"
                    value={formData.birthCertificate}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    error={errors.birthCertificate}
                />
                <DocumentUpload
                    title="Household Registration"
                    name="householdRegistration"
                    value={formData.householdRegistration}
                            onChange={handleFileChange}
                    accept="image/*,.pdf"
                    error={errors.householdRegistration}
                />
            </Stack>
        </FormSection>
    ), [FormSection, formData, handleFileChange, errors, uploadError]);

    const renderReview = useCallback(() => (
        <FormSection title="Review Information">
            <Stack spacing={3}>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Student ID
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.studentID}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        {formData.name}
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
                        {formData.dateOfBirth ? format(formData.dateOfBirth, 'dd-MM-yyyy') : ''}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Education Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Grade Level: {formData.gradeLevel}
                    </Typography>
                    <Typography variant="body1">
                        School: {formData.school}
                    </Typography>
                    <Typography variant="body1">
                        Class: {formData.class}
                    </Typography>
                    <Typography variant="body1">
                        Education System: {formData.educationSystem}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                        Parent Information
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Father's Name: {formData.fatherName}
                    </Typography>
                    <Typography variant="body1">
                        Father's Occupation: {formData.fatherOccupation}
                    </Typography>
                    <Typography variant="body1">
                        Mother's Name: {formData.motherName}
                        </Typography>
                    <Typography variant="body1">
                        Mother's Occupation: {formData.motherOccupation}
                        </Typography>
                </Box>
            </Stack>
        </FormSection>
    ), [FormSection, formData]);

    const renderStepContent = useMemo(() => {
        switch (activeStep) {
            case 0:
                return renderBasicInfo();
            case 1:
                return (
                    <>
                        {renderEducationInfo()}
                        {renderParentInfo()}
                    </>
                );
            case 2:
                return renderDocuments();
            case 3:
                return renderReview();
            default:
                return null;
        }
    }, [activeStep, renderBasicInfo, renderEducationInfo, renderParentInfo, renderDocuments, renderReview]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit}>
                {renderStepContent}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 4,
                        gap: 2
                    }}
                >
                    {onBack && (
                        <Button
                            onClick={onBack}
                            startIcon={<ChevronLeftIcon />}
                            sx={{
                                minWidth: 120,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: theme.shadows[4]
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
                        endIcon={activeStep === 3 ? <SaveIcon /> : <ChevronRightIcon />}
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
                            : activeStep === 3
                                ? 'Save Student'
                                : 'Next'}
                    </Button>
                </Box>
            </form>
        </LocalizationProvider>
    );
};

export default React.memo(StudentForm); 