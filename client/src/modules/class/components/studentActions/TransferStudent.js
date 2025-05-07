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
    Alert,
    Chip,
} from '@mui/material';
import {
    School as SchoolIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const TransferStudent = ({ open, onClose, currentClassId, student, students = [], onStudentTransfer, mode = 'single' }) => {
    const theme = useTheme();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        if (open) {
            fetchAvailableClasses();
            setSelectedClass(null);
            setError(null);
        }
    }, [open]);

    const fetchAvailableClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/class`);
            // Filter out the current class
            const availableClasses = response.data.data.filter(
                classItem => classItem.id !== currentClassId
            );
            setClasses(availableClasses);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setError('Failed to fetch available classes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async () => {
        if (!selectedClass) {
            setError('Please select a target class');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            if (!currentClassId || !selectedClass.id) {
                throw new Error('Missing required data');
            }

            // Get current class data
            const sourceClassResponse = await axios.get(`${API_URL}/class/${currentClassId}`);
            const sourceClass = sourceClassResponse.data.data;

            // Get target class data
            const targetClassResponse = await axios.get(`${API_URL}/class/${selectedClass.id}`);
            const targetClassData = targetClassResponse.data.data;

            // Get student IDs to transfer
            const studentIdsToTransfer = mode === 'single' ? [student.studentID] : students.map(s => s.studentID);

            // Verify students are in source class
            const notInSourceClass = studentIdsToTransfer.filter(id => !sourceClass.students?.includes(id));
            if (notInSourceClass.length > 0) {
                throw new Error('Some selected students are not in the current class');
            }

            // Verify students are not already in target class
            const alreadyInTargetClass = studentIdsToTransfer.filter(id => targetClassData.students?.includes(id));
            if (alreadyInTargetClass.length > 0) {
                throw new Error('Some selected students are already in the target class');
            }

            // Remove students from source class
            const updatedSourceStudents = sourceClass.students.filter(id => !studentIdsToTransfer.includes(id));
            const sourceUpdateResponse = await axios.put(`${API_URL}/class/${currentClassId}`, {
                ...sourceClass,
                students: updatedSourceStudents
            });

            if (!sourceUpdateResponse.data.success) {
                throw new Error('Failed to remove students from current class');
            }

            // Add students to target class
            const updatedTargetStudents = [...(targetClassData.students || []), ...studentIdsToTransfer];
            const targetUpdateResponse = await axios.put(`${API_URL}/class/${selectedClass.id}`, {
                ...targetClassData,
                students: updatedTargetStudents
            });

            if (targetUpdateResponse.data.success) {
                onStudentTransfer(mode === 'single' ? [student] : students, selectedClass, targetUpdateResponse.data.data);
                onClose();
            } else {
                // Rollback the source class update if target update fails
                await axios.put(`${API_URL}/class/${currentClassId}`, sourceClass);
                throw new Error('Failed to add students to target class');
            }
        } catch (error) {
            console.error('Error transferring students:', error);
            setError(error.response?.data?.message || error.message || 'Failed to transfer students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter(classItem =>
        classItem.className?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const studentsToTransfer = mode === 'single' ? [student] : students;

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
                <Typography variant="h6">
                    {mode === 'single' ? 'Transfer Student' : 'Transfer Multiple Students'}
                </Typography>
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
                    <Typography variant="subtitle1" gutterBottom>
                        {mode === 'single'
                            ? `Transfer ${student?.lastName} ${student?.firstName} to:`
                            : `Transfer ${students.length} students to:`}
                    </Typography>
                    {mode === 'multiple' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {students.map((student) => (
                                <Chip
                                    key={student.studentID}
                                    icon={<PersonIcon />}
                                    label={` ${student.lastName} ${student.firstName}`}
                                    size="small"
                                    sx={{ m: 0.5 }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                <TextField
                    fullWidth
                    placeholder="Search classes..."
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
                ) : filteredClasses.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        {searchTerm ? 'No matching classes found' : 'No available classes'}
                    </Typography>
                ) : (
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {filteredClasses.map((classItem) => {
                            const isSelected = selectedClass?.id === classItem.id;
                            return (
                                <ListItem
                                    button
                                    key={classItem.id}
                                    onClick={() => setSelectedClass(classItem)}
                                    disabled={loading}
                                    selected={isSelected}
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
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <SchoolIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={classItem.className}
                                        secondary={`${classItem.students?.length || 0} students`}
                                    />
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
                    onClick={handleTransfer}
                    disabled={loading || !selectedClass}
                    color="primary"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SchoolIcon />}
                >
                    {loading ? 'Transferring...' : `Transfer ${mode === 'single' ? 'Student' : `${students.length} Students`}`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransferStudent; 