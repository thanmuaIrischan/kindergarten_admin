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
import { parse } from 'date-fns';

const BasicInfoSection = ({ formData, errors, handleInputChange, handleBlur, handleDateChange, isCheckingID, isValidID }) => {
    const parsedDate = formData.dateOfBirth
    ? (typeof formData.dateOfBirth === 'string'
        ? parse(formData.dateOfBirth, 'dd-MM-yyyy', new Date())
        : formData.dateOfBirth)
    : null;
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
                    maxLength: 10,
                    style: { textTransform: 'uppercase' }
                }}
                error={!!errors.studentID}
                helperText={errors.studentID || 'Enter 6-10 alphanumeric characters'}
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
                value={parsedDate}
                onChange={handleDateChange}
                maxDate={new Date()}
                renderInput={(params) => (
                    <InputField
                        {...params}
                        required
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth || 'Format: DD-MM-YYYY'}
                        inputProps={{
                            ...params.inputProps,
                            placeholder: 'DD-MM-YYYY'
                        }}
                    />
                )}
                inputFormat="dd-MM-yyyy"
                mask="__-__-____"
                views={['year', 'month', 'day']}
                disableFuture
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
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.gender && (
                    <FormHelperText>{errors.gender}</FormHelperText>
                )}
            </FormControl>
        </FormSection>
    );
};

export default BasicInfoSection; 