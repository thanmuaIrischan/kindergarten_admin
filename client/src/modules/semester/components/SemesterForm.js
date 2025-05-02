import React, { useEffect } from 'react';
import {
    TextField,
    Box,
    Button,
    Typography,
    Paper,
    Stack,
    useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const SemesterForm = ({ onSubmit, isLoading, initialData, onBack }) => {
    const theme = useTheme();
    const [formData, setFormData] = React.useState({
        semesterName: initialData?.semesterName || '',
        startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
        endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                semesterName: initialData.semesterName || '',
                startDate: initialData.startDate ? new Date(initialData.startDate) : null,
                endDate: initialData.endDate ? new Date(initialData.endDate) : null,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            startDate: formData.startDate ? format(formData.startDate, 'dd-MM-yyyy') : '',
            endDate: formData.endDate ? format(formData.endDate, 'dd-MM-yyyy') : '',
        };
        onSubmit(submitData);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Box display="flex" alignItems="center" mb={3}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{
                            mr: 2,
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(44, 62, 80, 0.08)',
                            }
                        }}
                    >
                        Back to List
                    </Button>
                    <Typography variant="h6" color="primary">
                        {initialData ? 'Edit Semester' : 'Add New Semester'}
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            required
                            fullWidth
                            name="semesterName"
                            label="Semester Name"
                            value={formData.semesterName}
                            onChange={handleChange}
                        />

                        <DatePicker
                            label="Start Date"
                            value={formData.startDate}
                            onChange={(newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    startDate: newValue
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} required fullWidth />
                            )}
                        />

                        <DatePicker
                            label="End Date"
                            value={formData.endDate}
                            onChange={(newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    endDate: newValue
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} required fullWidth />
                            )}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                sx={{
                                    minWidth: 120,
                                    height: 40,
                                }}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </LocalizationProvider>
    );
};

export default SemesterForm; 