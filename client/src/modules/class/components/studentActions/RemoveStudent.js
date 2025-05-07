import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    useTheme,
    IconButton,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    Avatar,
    Box,
    Checkbox,
    Divider,
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const RemoveStudent = ({ open, onClose, classId, student = null, students = [], onStudentRemove, mode = 'single' }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Reset selections when dialog opens
    React.useEffect(() => {
        if (open) {
            setSelectedStudents(mode === 'single' && student ? [student] : []);
            setError(null);
        }
    }, [open, student, mode]);

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

    const handleSelectAll = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents([...students]);
        }
    };

    const handleRemove = async () => {
        if (mode === 'multiple' && selectedStudents.length === 0) {
            setError('Please select at least one student to remove');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            if (!classId) {
                throw new Error('Missing required data');
            }

            // Get current class data
            const classResponse = await axios.get(`${API_URL}/class/${classId}`);
            const currentClass = classResponse.data.data;

            // Handle single student removal
            if (mode === 'single') {
                if (!student || !currentClass.students?.includes(student.studentID)) {
                    throw new Error('Student is not in this class');
                }
                const updatedStudents = currentClass.students.filter(id => id !== student.studentID);
                const response = await axios.put(`${API_URL}/class/${classId}`, {
                    ...currentClass,
                    students: updatedStudents
                });

                if (response.data.success) {
                    onStudentRemove([student], response.data.data);
                    onClose();
                } else {
                    throw new Error('Failed to remove student from class');
                }
            }
            // Handle multiple student removal
            else {
                const selectedStudentIds = selectedStudents.map(student => student.studentID);
                const updatedStudents = currentClass.students.filter(
                    id => !selectedStudentIds.includes(id)
                );

                const response = await axios.put(`${API_URL}/class/${classId}`, {
                    ...currentClass,
                    students: updatedStudents
                });

                if (response.data.success) {
                    onStudentRemove(selectedStudents, response.data.data);
                    onClose();
                } else {
                    throw new Error('Failed to remove students from class');
                }
            }
        } catch (error) {
            console.error('Error removing student(s):', error);
            setError(error.response?.data?.message || error.message || `Failed to remove student${mode === 'multiple' ? 's' : ''}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    // Render single student removal dialog
    if (mode === 'single') {
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
                    <Typography variant="h6">Remove Student</Typography>
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

                    <Typography>
                        Are you sure you want to remove <strong>{`${student?.lastName} ${student?.firstName}`}</strong> from this class?
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Student ID: {student?.studentID}
                    </Typography>
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
                        onClick={handleRemove}
                        disabled={loading}
                        color="error"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        Remove Student
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Render multiple student removal dialog
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
                <Typography variant="h6">Remove Multiple Students</Typography>
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
                    <Typography variant="subtitle1" color="error">
                        Selected for removal: {selectedStudents.length} student(s)
                    </Typography>
                </Box>

                {students.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        No students in this class
                    </Typography>
                ) : (
                    <>
                        <ListItem
                            sx={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                mb: 1
                            }}
                        >
                            <ListItemText primary="Select All" />
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    checked={selectedStudents.length === students.length}
                                    indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                                    onChange={handleSelectAll}
                                    disabled={loading}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {students.map((student) => {
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
                                            primary={`${student.firstName} ${student.lastName}`}
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
                    </>
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
                    onClick={handleRemove}
                    disabled={loading || selectedStudents.length === 0}
                    color="error"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                >
                    Remove {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} Students
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveStudent; 