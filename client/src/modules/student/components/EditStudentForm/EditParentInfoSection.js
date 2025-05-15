import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import InputField from '../../../common/components/InputField';

const EditParentInfoSection = ({ formData, handleChange, errors }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Parent Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Parent/Guardian Name"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        error={errors.parentName}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Relationship"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        error={errors.relationship}
                        required
                        select
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Select Relationship</option>
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="guardian">Guardian</option>
                    </InputField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Phone Number"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        error={errors.parentPhone}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Email"
                        name="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        error={errors.parentEmail}
                    />
                </Grid>
                <Grid item xs={12}>
                    <InputField
                        label="Parent Address"
                        name="parentAddress"
                        value={formData.parentAddress}
                        onChange={handleChange}
                        error={errors.parentAddress}
                        required
                        multiline
                        rows={3}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditParentInfoSection; 