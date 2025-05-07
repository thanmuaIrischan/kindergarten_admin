import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    TextField,
    CircularProgress,
    Box,
    useTheme,
    IconButton,
} from '@mui/material';
import {
    School as SchoolIcon,
    Close as CloseIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ChangeSemester = ({ open, onClose, currentSemesterId, classId, onSemesterChange }) => {
    const theme = useTheme();
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    // Helper function to format date to DD-MM-YYYY
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not set';
        const [day, month, year] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        if (open) {
            fetchSemesters();
        }
    }, [open]);

    const fetchSemesters = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/semester`);
            console.log('Fetched semesters response:', response.data);
            setSemesters(response.data.data || []);
        } catch (error) {
            console.error('Error fetching semesters:', error);
            setError('Failed to fetch semesters. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSemesterSelect = async (semester) => {
        setError(null);
        setLoading(true);
        try {
            if (!classId) {
                throw new Error('Class ID is missing');
            }
            if (!semester || !semester.id) {
                throw new Error('Invalid semester data');
            }

            console.log('Selected semester:', semester);

            // First get the current class data
            const classResponse = await axios.get(`${API_URL}/class/${classId}`);
            const currentClass = classResponse.data.data;
            console.log('Current class data:', currentClass);

            if (!currentClass || !currentClass.className) {
                throw new Error('Failed to fetch current class data');
            }

            // Update the class with the new semester while preserving other required fields
            const response = await axios.put(`${API_URL}/class/${classId}`, {
                semesterID: semester.id,
                className: currentClass.className,
                // Preserve other required fields
                teacherID: currentClass.teacherID,
                students: currentClass.students || []
            });

            console.log('Update class response:', response.data);

            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to update class');
            }

            onSemesterChange(semester, response.data.data);
            onClose();
        } catch (error) {
            console.error('Error changing semester:', error);
            setError(error.response?.data?.message || error.message || 'Failed to change semester. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredSemesters = semesters.filter(semester =>
        semester.semesterName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Typography variant="h6" component="div">
                    Change Semester
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search semesters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ mb: 2 }}
                />

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={{ py: 2 }}>
                        {error}
                    </Typography>
                ) : filteredSemesters.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        No semesters found
                    </Typography>
                ) : (
                    <List sx={{ pt: 0 }}>
                        {filteredSemesters.map((semester) => (
                            <ListItem
                                button
                                key={semester.id}
                                onClick={() => handleSemesterSelect(semester)}
                                selected={semester.id === currentSemesterId}
                                sx={{
                                    borderRadius: 1,
                                    mb: 1,
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.08)'
                                            : 'rgba(0, 0, 0, 0.04)',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.16)'
                                            : 'rgba(0, 0, 0, 0.08)',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.24)'
                                                : 'rgba(0, 0, 0, 0.12)',
                                        },
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText,
                                        }}
                                    >
                                        <SchoolIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={semester.semesterName}
                                    secondary={`${formatDate(semester.startDate)} - ${formatDate(semester.endDate)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeSemester; 