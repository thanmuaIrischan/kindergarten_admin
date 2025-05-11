import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const ImportDialog = ({ open, onClose, onImport }) => {
    const theme = useTheme();
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                selectedFile.type === 'application/vnd.ms-excel') {
                setFile(selectedFile);
                setError('');
            } else {
                setError('Please select a valid Excel file (.xlsx or .xls)');
                setFile(null);
            }
        }
    };

    const handleImport = () => {
        if (file) {
            onImport(file);
            onClose();
            setFile(null);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
            }}>
                Import Students
            </DialogTitle>
            <DialogContent sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
            }}>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please select an Excel file (.xlsx or .xls) containing student data with the following columns:
                    </Typography>
                    <Typography variant="body2" component="div" sx={{ mb: 2, pl: 2 }}>
                        • First Name<br />
                        • Last Name<br />
                        • Date of Birth (YYYY-MM-DD)<br />
                        • Gender (male/female/other)<br />
                        • Parent Name<br />
                        • Parent Contact<br />
                        • Parent Email<br />
                        • Address<br />
                        • Class<br />
                        • Medical Conditions (comma-separated)<br />
                        • Emergency Contact Name<br />
                        • Emergency Contact Relationship<br />
                        • Emergency Contact Phone
                    </Typography>
                    <input
                        accept=".xlsx,.xls"
                        style={{ display: 'none' }}
                        id="import-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="import-file">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadIcon />}
                            sx={{
                                borderColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                '&:hover': {
                                    borderColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2471a3',
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(41, 128, 185, 0.1)',
                                },
                            }}
                        >
                            Choose File
                        </Button>
                    </label>
                    {file && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected file: {file.name}
                        </Typography>
                    )}
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
            }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleImport}
                    disabled={!file}
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2471a3',
                        },
                    }}
                >
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImportDialog; 