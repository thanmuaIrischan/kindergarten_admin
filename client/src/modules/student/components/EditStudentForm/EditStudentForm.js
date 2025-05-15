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

import { validationHelpers, formatFieldName } from '../StudentForm/constants';
import BasicInfoSection from '../StudentForm/BasicInfoSection';
import EducationInfoSection from '../StudentForm/EducationInfoSection';
import ParentInfoSection from '../StudentForm/ParentInfoSection';
import DocumentsSection from '../StudentForm/DocumentsSection';
import ReviewSection from '../StudentForm/ReviewSection';

const EditStudentForm = ({ onSubmit, isLoading, studentData, activeStep, onBack }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        studentID: studentData?.studentID || '',
        firstName: studentData?.firstName || '',
        lastName: studentData?.lastName || '',
        name: studentData?.name || '',
        dateOfBirth: studentData?.dateOfBirth ? new Date(studentData.dateOfBirth) : null,
        gender: studentData?.gender || '',
        gradeLevel: studentData?.gradeLevel || '',
        school: studentData?.school || '',
        class: studentData?.class || '',
        educationSystem: studentData?.educationSystem || '',
        fatherName: studentData?.fatherName || '',
        fatherOccupation: studentData?.fatherOccupation || '',
        motherName: studentData?.motherName || '',
        motherOccupation: studentData?.motherOccupation || '',
        image: studentData?.image || null,
        birthCertificate: studentData?.birthCertificate || null,
        householdRegistration: studentData?.householdRegistration || null
    });

    const [errors, setErrors] = useState({});
    const [uploadError, setUploadError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const validateInput = useCallback((name, value) => {
        if (validationHelpers.isEmptyOrWhitespace(value)) {
            return `${formatFieldName(name)} is required`;
        }
        if (validationHelpers.isOnlySpaces(value)) {
            return `${formatFieldName(name)} cannot contain only spaces`;
        }
        return '';
    }, []);

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
    }, [validateInput]);

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
                        isCheckingID={false}
                        isValidID={true}
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
    }, [activeStep, formData, errors, handleInputChange, handleBlur, handleDateChange, handleFileChange, uploadError]);

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
                                ? 'Update Student'
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
                    Student information has been successfully updated!
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default EditStudentForm; 