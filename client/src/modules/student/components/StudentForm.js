import React, { useState, useCallback, useMemo } from 'react';
import {
    Box,
    Button,
    useTheme,
    Snackbar,
    Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Save as SaveIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

import { API_URL, validationHelpers, formatFieldName } from './StudentForm/constants';
import BasicInfoSection from './StudentForm/BasicInfoSection';
import EducationInfoSection from './StudentForm/EducationInfoSection';
import ParentInfoSection from './StudentForm/ParentInfoSection';
import DocumentsSection from './StudentForm/DocumentsSection';
import ReviewSection from './StudentForm/ReviewSection';

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
    const [showSuccess, setShowSuccess] = useState(false);

    const validateInput = useCallback((name, value) => {
        if (name === 'studentID') {
            if (!value || value.trim() === '') {
                return 'Student ID is required';
            }
            if (!/^[A-Z0-9]{6,10}$/.test(value)) {
                return 'Student ID must be 6-10 alphanumeric characters';
            }
            return '';
        }

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
            if (!studentID || validationHelpers.isEmptyOrWhitespace(studentID)) {
                setErrors(prev => ({
                    ...prev,
                    studentID: 'Student ID is required'
                }));
                setIsValidID(false);
                return;
            }

            if (!/^[A-Z0-9]{6,10}$/.test(studentID)) {
                setErrors(prev => ({
                    ...prev,
                    studentID: 'Student ID must be 6-10 alphanumeric characters'
                }));
                setIsValidID(false);
                return;
            }
            
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

        // Special handling for student ID
        if (name === 'studentID') {
            setIsValidID(false);
            if (value.trim() === '') {
                setErrors(prev => ({
                    ...prev,
                    studentID: 'Student ID is required'
                }));
            } else if (!/^[A-Z0-9]{6,10}$/.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    studentID: 'Student ID must be 6-10 alphanumeric characters'
                }));
            } else {
                debouncedCheckStudentID(value);
            }
            return;
        }

        // Immediate validation for other fields
        const errorMessage = validateInput(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: errorMessage
        }));
    }, [debouncedCheckStudentID, validateInput]);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        
        if (name === 'studentID') {
            if (value.trim() === '') {
                setErrors(prev => ({
                    ...prev,
                    studentID: 'Student ID is required'
                }));
            } else if (!/^[A-Z0-9]{6,10}$/.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    studentID: 'Student ID must be 6-10 alphanumeric characters'
                }));
            }
            return;
        }

        // Validate on blur for other fields
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

        // Call onSubmit and show success notification
        onSubmit(submitData);
        setShowSuccess(true);
    }, [formData, onSubmit, activeStep, validateInput]);

    const handleCloseSuccess = useCallback(() => {
        setShowSuccess(false);
    }, []);

    const renderStepContent = useMemo(() => {
        switch (activeStep) {
            case 0:
                return (
                    <BasicInfoSection
                        formData={formData}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        handleBlur={handleBlur}
                        handleDateChange={handleDateChange}
                        isCheckingID={isCheckingID}
                        isValidID={isValidID}
                    />
                );
            case 1:
                return (
                    <>
                        <EducationInfoSection
                            formData={formData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />
                        <ParentInfoSection
                            formData={formData}
                            errors={errors}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />
                    </>
                );
            case 2:
                return (
                    <DocumentsSection
                        formData={formData}
                        errors={errors}
                        handleFileChange={handleFileChange}
                        uploadError={uploadError}
                    />
                );
            case 3:
                return <ReviewSection formData={formData} />;
            default:
                return null;
        }
    }, [activeStep, formData, errors, handleInputChange, handleBlur, handleDateChange, handleFileChange, uploadError, isCheckingID, isValidID]);

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
                        disabled={isLoading || (activeStep === 0 && !isValidID)}
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
            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Student information has been successfully saved!
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default React.memo(StudentForm); 