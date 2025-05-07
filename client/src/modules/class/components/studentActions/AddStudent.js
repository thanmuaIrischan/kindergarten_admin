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
    ListItemSecondaryAction,
    Avatar,
    Typography,
    TextField,
    CircularProgress,
    Box,
    useTheme,
    IconButton,
    Alert,
    Checkbox,
    Tooltip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AddStudent = ({ open, onClose, classId, currentStudentIds = [], onStudentAdd }) => {
    const theme = useTheme();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        if (open) {
            fetchAvailableStudents();
            setSelectedStudents([]); // Reset selections when dialog opens
        }
    }, [open]);

    const fetchAvailableStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/student`);
            // Filter out students that are already in the class
            const availableStudents = response.data.data.filter(
                student => !currentStudentIds.includes(student.studentID)
            );
            setStudents(availableStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to fetch available students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = (student) => {
        setSelectedStudents(prev => {
            const isSelected = prev.some(s => s.studentID === student.studentID);
            if (isSelected) {
                return prev.filter(s => s.studentID !== student.studentID);
            } else {
                return [...prev, student];
            }
        });
    };

    const handleAddSelectedStudents = async () => {
        if (selectedStudents.length === 0) {
            setError('Please select at least one student');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            if (!classId) {
                throw new Error('Class ID is missing');
            }

            // Get current class data
            const classResponse = await axios.get(`${API_URL}/class/${classId}`);
            const currentClass = classResponse.data.data;

            // Get current student IDs and add new ones
            const currentStudents = currentClass.students || [];
            const newStudentIds = selectedStudents.map(student => student.studentID);

            // Check for duplicates
            const duplicates = newStudentIds.filter(id => currentStudents.includes(id));
            if (duplicates.length > 0) {
                throw new Error('Some selected students are already in this class');
            }

            // Update class with new students
            const updatedStudents = [...currentStudents, ...newStudentIds];

            // Update the class with the new students
            const response = await axios.put(`${API_URL}/class/${classId}`, {
                ...currentClass,
                students: updatedStudents
            });

            if (response.data.success) {
                // Call the callback with updated data
                onStudentAdd(selectedStudents, response.data.data);
                onClose();
            } else {
                throw new Error('Failed to add students to class');
            }
        } catch (error) {
            console.error('Error adding students:', error);
            setError(error.response?.data?.message || error.message || 'Failed to add students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchLower) ||
            student.studentID?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Dialog
            open={open}
            onClose={!loading ? onClose : undefined}
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
                pb: 2
            }}>
                <Typography variant="h6">Add Students to Class</Typography>
                <IconButton onClick={onClose} size="small" disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Selected Students: {selectedStudents.length}
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    placeholder="Search students..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ mb: 2 }}
                />

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : filteredStudents.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        {searchTerm ? 'No matching students found' : 'No available students'}
                    </Typography>
                ) : (
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {filteredStudents.map((student) => {
                            const isSelected = selectedStudents.some(s => s.studentID === student.studentID);
                            return (
                                <ListItem
                                    button
                                    key={student.studentID}
                                    onClick={() => handleStudentSelect(student)}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 1,
                                        border: '1px solid',
                                        borderColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.12)'
                                            : 'rgba(0, 0, 0, 0.12)',
                                        backgroundColor: isSelected
                                            ? theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.08)'
                                                : 'rgba(0, 0, 0, 0.04)'
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.12)'
                                                : 'rgba(0, 0, 0, 0.08)',
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${student.lastName} ${student.firstName}`}
                                        secondary={`Student ID: ${student.studentID}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Checkbox
                                            edge="end"
                                            checked={isSelected}
                                            onChange={() => handleStudentSelect(student)}
                                            disabled={loading}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAddSelectedStudents}
                    disabled={loading || selectedStudents.length === 0}
                    color="primary"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                >
                    Add {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} Students
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddStudent; 