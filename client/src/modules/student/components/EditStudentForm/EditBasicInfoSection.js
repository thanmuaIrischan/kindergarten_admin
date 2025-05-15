import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import InputField from '../../../common/components/InputField';

const EditBasicInfoSection = ({ formData, handleChange, errors }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Basic Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        error={errors.dateOfBirth}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        error={errors.gender}
                        required
                        select
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </InputField>
                </Grid>
                <Grid item xs={12}>
                    <InputField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                        required
                        multiline
                        rows={3}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditBasicInfoSection; 