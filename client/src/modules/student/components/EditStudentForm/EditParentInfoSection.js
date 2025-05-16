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
                        label="Father's Name"
                        name="fatherFullname"
                        value={formData.fatherFullname}
                        onChange={handleChange}
                        error={errors.fatherFullname}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Father's Occupation"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        error={errors.fatherOccupation}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Mother's Name"
                        name="motherFullname"
                        value={formData.motherFullname}
                        onChange={handleChange}
                        error={errors.motherFullname}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Mother's Occupation"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        error={errors.motherOccupation}
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
            </Grid>
        </Box>
    );
};

export default EditParentInfoSection; 