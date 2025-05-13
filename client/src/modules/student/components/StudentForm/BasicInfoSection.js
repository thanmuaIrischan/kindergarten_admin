import React from 'react';
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    InputAdornment, 
    FormHelperText,
    CircularProgress 
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormSection from './FormSection';
import InputField from './InputField';

const BasicInfoSection = ({ formData, errors, handleInputChange, handleBlur, handleDateChange, isCheckingID, isValidID }) => {
    return (
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
    );
};

export default BasicInfoSection; 