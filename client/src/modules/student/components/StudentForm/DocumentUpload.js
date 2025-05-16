import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    useTheme,
    alpha,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, API_URL } from './constants';

const DocumentUpload = ({ title, name, value, onChange, accept, error }) => {
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFile = async (file) => {
        if (!file) return;

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert('File size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Extract documentType from name (e.g., "studentDocument.image" -> "image")
            const documentType = name.split('.')[1];
            formData.append('documentType', documentType);

            // Use XMLHttpRequest for better progress tracking
            const xhr = new XMLHttpRequest();
            
            // Set up progress tracking
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setUploadProgress(percentCompleted);
                }
            });

            // Create a promise to handle the XHR request
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                resolve(response);
                            } else {
                                reject(new Error(response.error || 'Failed to upload file'));
                            }
                        } catch (error) {
                            reject(new Error('Invalid response from server'));
                        }
                    } else {
                        reject(new Error('Upload failed'));
                    }
                };
                xhr.onerror = () => reject(new Error('Network error occurred'));
            });

            // Open and send the request
            xhr.open('POST', `${API_URL}/student/document/upload`);
            xhr.send(formData);

            // Wait for the upload to complete
            const response = await uploadPromise;

            const event = {
                target: {
                    name,
                    value: {
                        url: response.data.url,
                        public_id: response.data.public_id
                    }
                }
            };
            onChange(event);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(error.message || 'Error uploading file');
        } finally {
            // Add a small delay before hiding the progress to ensure smooth transition
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
        }
    };

    return (
        <Box
            sx={{
                p: 3,
                borderRadius: 2,
                border: `1px dashed ${error ? theme.palette.error.main : isDragging ? theme.palette.primary.main : theme.palette.divider}`,
                transition: 'all 0.2s ease-in-out',
                backgroundColor: isDragging ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                accept={accept}
                style={{ display: 'none' }}
                id={name}
                type="file"
                name={name}
                onChange={(e) => handleFile(e.target.files[0])}
            />
            <label htmlFor={name}>
                <Button
                    component="span"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    disabled={isUploading}
                    sx={{
                        width: '100%',
                        height: '100px',
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        '&:hover': {
                            borderStyle: 'dashed',
                            borderWidth: '2px'
                        }
                    }}
                >
                    {isUploading ? (
                        <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <CircularProgress 
                                variant="determinate" 
                                value={uploadProgress} 
                                size={40}
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="textSecondary">
                                Uploading... {uploadProgress}%
                            </Typography>
                        </Box>
                    ) : value ? (
                        <Box 
                            sx={{ 
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '80px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={value.url}
                                    alt={title}
                                    sx={{
                                        maxWidth: '100%',
                                        maxHeight: '80px',
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                        boxShadow: theme.shadows[1]
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onChange({ target: { name, value: null } });
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: theme.palette.error.light,
                                        color: theme.palette.common.white,
                                        '&:hover': {
                                            backgroundColor: theme.palette.error.main,
                                        },
                                        boxShadow: theme.shadows[2]
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography 
                                variant="caption" 
                                color="textSecondary"
                                sx={{
                                    mt: 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}
                            >
                                <UploadIcon fontSize="small" />
                                Click to change {title}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <UploadIcon sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
                            <Typography color="textSecondary">
                                Click or drag to upload {title}
                            </Typography>
                        </Box>
                    )}
                </Button>
            </label>
            {error && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default DocumentUpload; 