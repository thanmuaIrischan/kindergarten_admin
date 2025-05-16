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
        name: initialData?.name || '',
        dateOfBirth: initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
        gender: initialData?.gender || '',
        gradeLevel: initialData?.gradeLevel || '',
        school: initialData?.school || '',
        class: initialData?.class || '',
        educationSystem: initialData?.educationSystem || '',
        fatherFullname: initialData?.fatherFullname || '',
        fatherOccupation: initialData?.fatherOccupation || '',
        motherFullname: initialData?.motherFullname || '',
        motherOccupation: initialData?.motherOccupation || '',
        studentDocument: {
            image: initialData?.studentDocument?.image || null,
            birthCertificate: initialData?.studentDocument?.birthCertificate || null,
            householdRegistration: initialData?.studentDocument?.householdRegistration || null
        }
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
        // Validate if the date is valid before setting it
        if (newValue instanceof Date && !isNaN(newValue)) {
            // Check if the date is not in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
            
            if (newValue > today) {
                setErrors(prev => ({
                    ...prev,
                    dateOfBirth: 'Date of birth cannot be in the future'
                }));
                return;
            }

            try {
                // Format the date to ensure it's in dd-MM-yyyy format
                const formattedDate = format(newValue, 'dd-MM-yyyy');
                // Parse back to verify format is valid
                const [day, month, year] = formattedDate.split('-').map(Number);
                const parsedDate = new Date(year, month - 1, day);
                
                if (isNaN(parsedDate.getTime()) || parsedDate > today) {
                    throw new Error('Invalid date');
                }

                setFormData(prev => ({
                    ...prev,
                    dateOfBirth: newValue
                }));
                setErrors(prev => ({
                    ...prev,
                    dateOfBirth: ''
                }));
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    dateOfBirth: 'Please enter a valid date in DD-MM-YYYY format'
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: null
            }));
            setErrors(prev => ({
                ...prev,
                dateOfBirth: 'Please enter a valid date in DD-MM-YYYY format'
            }));
        }
    }, []);

    const handleFileChange = useCallback((e) => {
        const { name, value } = e.target;
        
        // Handle nested object updates for studentDocument
        if (name.startsWith('studentDocument.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                studentDocument: {
                    ...prev.studentDocument,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        
        // Debug log - Initial form data
        console.log('Initial form data:', formData);

        // Validate all fields
        const newErrors = {};
        let hasErrors = false;

        // Helper function to validate a field
        const validateField = (name, value) => {
            console.log(`Validating ${name}:`, value); // Debug log
            if (name === 'studentID') {
                if (!value || value.trim() === '') {
                    newErrors[name] = 'Student ID is required';
                    hasErrors = true;
                    return;
                }
                if (!/^[A-Z0-9]{6,10}$/.test(value)) {
                    newErrors[name] = 'Student ID must be 6-10 alphanumeric characters';
                    hasErrors = true;
                }
                return;
            }

            if (!value || value.trim() === '') {
                newErrors[name] = `${formatFieldName(name)} is required`;
                hasErrors = true;
            }
        };

        // Validate fields based on current step
        switch (activeStep) {
            case 0: // Basic Information
                validateField('studentID', formData.studentID);
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
                validateField('fatherFullname', formData.fatherFullname);
                validateField('fatherOccupation', formData.fatherOccupation);
                validateField('motherFullname', formData.motherFullname);
                validateField('motherOccupation', formData.motherOccupation);
                break;
            
            case 2: // Documents
                if (!formData.studentDocument.image) {
                    newErrors.studentDocument = {
                        ...newErrors.studentDocument,
                        image: 'Student photo is required'
                    };
                    hasErrors = true;
                }
                if (!formData.studentDocument.birthCertificate) {
                    newErrors.studentDocument = {
                        ...newErrors.studentDocument,
                        birthCertificate: 'Birth certificate is required'
                    };
                    hasErrors = true;
                }
                if (!formData.studentDocument.householdRegistration) {
                    newErrors.studentDocument = {
                        ...newErrors.studentDocument,
                        householdRegistration: 'Household registration is required'
                    };
                    hasErrors = true;
                }
                break;
            
            case 3: // Review - Validate all fields
                validateField('studentID', formData.studentID);
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
                validateField('fatherFullname', formData.fatherFullname);
                validateField('fatherOccupation', formData.fatherOccupation);
                validateField('motherFullname', formData.motherFullname);
                validateField('motherOccupation', formData.motherOccupation);
                if (!formData.studentDocument.image) {
                    newErrors.studentDocument.image = 'Student photo is required';
                    hasErrors = true;
                }
                if (!formData.studentDocument.birthCertificate) {
                    newErrors.studentDocument.birthCertificate = 'Birth certificate is required';
                    hasErrors = true;
                }
                if (!formData.studentDocument.householdRegistration) {
                    newErrors.studentDocument.householdRegistration = 'Household registration is required';
                    hasErrors = true;
                }
                break;
        }

        if (hasErrors) {
            console.log('Validation errors:', newErrors); // Debug log
            setErrors(newErrors);
            return;
        }

        // Ensure studentID is not empty before submitting
        if (!formData.studentID || formData.studentID.trim() === '') {
            console.log('StudentID empty check failed:', formData.studentID); // Debug log
            setErrors(prev => ({
                ...prev,
                studentID: 'Student ID is required'
            }));
            return;
        }

        // Format the date properly before submitting
        const formattedDate = formData.dateOfBirth instanceof Date && !isNaN(formData.dateOfBirth)
            ? format(formData.dateOfBirth, 'dd-MM-yyyy')
            : '';

        // Trim all string values and ensure required fields are present
        const submitData = {
            studentProfile: {
                studentID: formData.studentID.trim(),
                name: formData.name.trim(),
                dateOfBirth: formattedDate,
                gender: formData.gender,
                gradeLevel: formData.gradeLevel.trim(),
                school: formData.school.trim(),
                class: formData.class.trim(),
                educationSystem: formData.educationSystem.trim(),
                fatherFullname: formData.fatherFullname.trim(),
                fatherOccupation: formData.fatherOccupation.trim(),
                motherFullname: formData.motherFullname.trim(),
                motherOccupation: formData.motherOccupation.trim()
            },
            studentDocument: {
                image: formData.studentDocument.image?.public_id || '',
                birthCertificate: formData.studentDocument.birthCertificate?.public_id || '',
                householdRegistration: formData.studentDocument.householdRegistration?.public_id || ''
            }
        };

        console.log('StudentForm - Form data before validation:', {
            originalData: formData,
            processedData: submitData,
            dateOfBirth: {
                original: formData.dateOfBirth,
                formatted: formattedDate
            }
        });

        // Validate date of birth is not in the future
        const dobDate = new Date(submitData.studentProfile.dateOfBirth.split('-').reverse().join('-'));
        if (dobDate > new Date()) {
            console.log('Date validation failed:', {
                inputDate: submitData.studentProfile.dateOfBirth,
                parsedDate: dobDate,
                currentDate: new Date()
            });
            setErrors(prev => ({
                ...prev,
                dateOfBirth: 'Date of birth cannot be in the future'
            }));
            return;
        }

        // Final validation and debug log before submission
        console.log('StudentForm - Final validation check:', {
            studentID: {
                value: submitData.studentProfile.studentID,
                isValid: !!submitData.studentProfile.studentID
            },
            requiredFields: {
                studentID: !!submitData.studentProfile.studentID,
                name: !!submitData.studentProfile.name,
                dateOfBirth: !!submitData.studentProfile.dateOfBirth,
                gender: !!submitData.studentProfile.gender,
                gradeLevel: !!submitData.studentProfile.gradeLevel,
                class: !!submitData.studentProfile.class
            }
        });

        if (!submitData.studentProfile.studentID) {
            console.log('Final studentID check failed:', {
                studentID: submitData.studentProfile.studentID,
                formDataStudentID: formData.studentID
            });
            setErrors(prev => ({
                ...prev,
                studentID: 'Student ID is required'
            }));
            return;
        }

        // Call onSubmit and show success notification
        console.log('StudentForm - Calling onSubmit with data:', submitData);
        onSubmit(submitData);
        setShowSuccess(true);
    }, [formData, onSubmit, activeStep, formatFieldName]);

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