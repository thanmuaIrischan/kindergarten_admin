import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import FormSection from './FormSection';
import InputField from './InputField';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const EducationInfoSection = ({ formData, errors, handleInputChange, handleBlur }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/class`);
                if (response.data && response.data.success) {
                    setClasses(response.data.data || []);
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
            <FormControl
                fullWidth
                required
                variant="outlined"
                error={!!errors.class}
            >
                <InputLabel>Class</InputLabel>
                <Select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    label="Class"
                    disabled={loading}
                >
                    {classes.map((classItem) => (
                        <MenuItem key={classItem.id} value={classItem.className}>
                            {classItem.className}
                        </MenuItem>
                    ))}
                </Select>
                {errors.class && (
                    <FormHelperText>{errors.class}</FormHelperText>
                )}
            </FormControl>
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
    );
};

export default EducationInfoSection; 