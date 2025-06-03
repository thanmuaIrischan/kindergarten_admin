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
            setSelectedStudents([]);
            setSearchTerm('');
            fetchAvailableStudents();
        }
    }, [open, currentStudentIds]);

    const fetchAvailableStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            // Get all students from Firebase without limitation
            const response = await axios.get(`${API_URL}/student`, {
                params: {
                    limit: 0 // Set limit to 0 to get all records
                }
            });

            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format from server');
            }

            console.log('Total students from server:', response.data.data.length);

            // Get all classes to check which students are already assigned
            const classesResponse = await axios.get(`${API_URL}/class`);
            const allClasses = classesResponse.data.data || [];

            // Create a set of all assigned student IDs across all classes
            const assignedStudentIds = new Set();
            allClasses.forEach(classItem => {
                if (classItem.students && Array.isArray(classItem.students)) {
                    classItem.students.forEach(studentId => assignedStudentIds.add(studentId));
                }
            });

            console.log('Students already assigned to classes:', assignedStudentIds.size);

            // Filter out students that are already in any class
            const availableStudents = response.data.data
                .filter(student => !assignedStudentIds.has(student.studentID))
                .map(student => ({
                    id: student.id,
                    studentID: student.studentID,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    gender: student.gender,
                    dateOfBirth: student.dateOfBirth,
                    phone: student.phone,
                    email: student.email,
                    address: student.address,
                    avatar: student.avatar
                }));

            console.log('Available students after filter:', availableStudents.length);
            
            if (availableStudents.length === 0) {
                setError('No available students to add to this class. All students are already assigned to classes.');
            }
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

            const classResponse = await axios.get(`${API_URL}/class/${classId}`);
            const currentClass = classResponse.data.data;

            const currentStudents = currentClass.students || [];
            const newStudentIds = selectedStudents.map(student => student.studentID);

            const duplicateStudents = selectedStudents.filter(
                student => currentStudents.includes(student.studentID)
            );

            if (duplicateStudents.length > 0) {
                const duplicateNames = duplicateStudents
                    .map(s => `${s.firstName} ${s.lastName} (${s.studentID})`)
                    .join(', ');
                throw new Error(`The following students are already in this class: ${duplicateNames}`);
            }

            const updatedStudents = [...currentStudents, ...newStudentIds];

            // const response = await axios.put(`${API_URL}/class/${classId}`, {
            //     ...currentClass,
            //     students: updatedStudents
            // });

            // if (response.data.success) {
            //     await onStudentAdd(selectedStudents, response.data.data);
            //     onClose();
            // } else {
            //     throw new Error('Failed to add students to class');
            // }
            await onStudentAdd(updatedStudents, currentClass);
            onClose();
        } catch (error) {
            console.error('Error adding students:', error);
            setError(error.message || 'Failed to add students. Please try again.');
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
                    {students.length > 0 && (
                        <Typography variant="body2" color="textSecondary">
                            Total Available: {students.length} students
                        </Typography>
                    )}
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
                    <List 
                        sx={{ 
                            maxHeight: '60vh', 
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '4px',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                },
                            },
                        }}
                    >
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
                                        secondary={
                                            <React.Fragment>
                                                <Typography component="span" variant="body2">
                                                    ID: {student.studentID}
                                                </Typography>
                                            </React.Fragment>
                                        }
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