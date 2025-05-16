import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import InputField from '../../../common/components/InputField';
import { getClasses } from '../../../class/api/class.api';

const EditEducationInfoSection = ({ formData, handleChange, errors }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await getClasses();
                if (response.success) {
                    setClasses(response.data);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Education Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Grade Level"
                        name="gradeLevel"
                        value={formData.gradeLevel || ''}
                        onChange={handleChange}
                        error={errors.gradeLevel}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.class}>
                        <InputLabel>Class</InputLabel>
                        <Select
                            name="class"
                            value={formData.class || ''}
                            onChange={handleChange}
                            label="Class"
                            disabled={loading}
                        >
                            {classes.map((classItem) => (
                                <MenuItem key={classItem._id} value={classItem._id}>
                                    {classItem.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.class && <FormHelperText>{errors.class}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Enrollment Date"
                        name="enrollmentDate"
                        type="date"
                        value={formData.enrollmentDate}
                        onChange={handleChange}
                        error={errors.enrollmentDate}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputField
                        label="Previous School"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        error={errors.previousSchool}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditEducationInfoSection; 