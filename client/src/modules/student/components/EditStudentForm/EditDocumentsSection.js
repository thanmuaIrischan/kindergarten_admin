import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const EditDocumentsSection = ({ formData, handleChange, errors }) => {
    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            handleChange({
                target: {
                    name: fieldName,
                    value: file
                }
            });
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Documents
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Birth Certificate
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                        >
                            Upload Birth Certificate
                            <input
                                type="file"
                                hidden
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'birthCertificate')}
                            />
                        </Button>
                        {formData.birthCertificate && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {formData.birthCertificate.name}
                            </Typography>
                        )}
                        {errors.birthCertificate && (
                            <Typography color="error" variant="caption">
                                {errors.birthCertificate}
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Previous School Records
                        </Typography>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                        >
                            Upload School Records
                            <input
                                type="file"
                                hidden
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'schoolRecords')}
                            />
                        </Button>
                        {formData.schoolRecords && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {formData.schoolRecords.name}
                            </Typography>
                        )}
                        {errors.schoolRecords && (
                            <Typography color="error" variant="caption">
                                {errors.schoolRecords}
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EditDocumentsSection; 