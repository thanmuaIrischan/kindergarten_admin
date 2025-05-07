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
    Divider,
} from '@mui/material';
import {
    School as SchoolIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    SwapHoriz as SwapHorizIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const TransferStudent = ({
    open,
    onClose,
    currentClassId,
    student = null,
    students = [],
    onStudentTransfer,
    mode = 'single'
}) => {
    const theme = useTheme();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        if (open) {
            fetchAvailableClasses();
            // Initialize selected students based on mode
            setSelectedStudents(mode === 'single' && student ? [student] : []);
            setSelectedClass(null);
            setError(null);
        }
    }, [open, student, mode]);

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

    const handleClassSelect = (classItem) => {
        setSelectedClass(classItem);
    };

    const handleTransfer = async () => {
        if (!selectedClass) {
            setError('Please select a target class');
            return;
        }

        if (mode === 'multiple' && selectedStudents.length === 0) {
            setError('Please select at least one student to transfer');
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
            const studentIdsToTransfer = selectedStudents.map(s => s.studentID);

            // Verify students are in source class and not in target class
            const notInSourceClass = studentIdsToTransfer.filter(id => !sourceClass.students?.includes(id));
            if (notInSourceClass.length > 0) {
                throw new Error('Some selected students are not in the current class');
            }

            const alreadyInTargetClass = studentIdsToTransfer.filter(id => targetClassData.students?.includes(id));
            if (alreadyInTargetClass.length > 0) {
                throw new Error('Some selected students are already in the target class');
            }

            // Remove students from source class
            const updatedSourceStudents = sourceClass.students.filter(
                id => !studentIdsToTransfer.includes(id)
            );
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
                onStudentTransfer(selectedStudents, selectedClass, targetUpdateResponse.data.data);
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

                {mode === 'multiple' && (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="primary">
                                Selected for transfer: {selectedStudents.length} student(s)
                            </Typography>
                        </Box>

                        {students.length > 0 && (
                            <>
                                <ListItem
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        mb: 1
                                    }}
                                >
                                    <ListItemText primary="Select Students to Transfer" />
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

                                <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
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
                                <Divider sx={{ my: 2 }} />
                            </>
                        )}
                    </>
                )}

                <Typography variant="subtitle1" gutterBottom>
                    {mode === 'single'
                        ? `Transfer ${student?.firstName} ${student?.lastName} to:`
                        : 'Select Target Class:'}
                </Typography>

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
                    <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {filteredClasses.map((classItem) => {
                            const isSelected = selectedClass?.id === classItem.id;
                            return (
                                <ListItem
                                    button
                                    key={classItem.id}
                                    onClick={() => handleClassSelect(classItem)}
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
                                    {mode === 'multiple' && (
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                checked={isSelected}
                                                onChange={() => handleClassSelect(classItem)}
                                                disabled={loading}
                                            />
                                        </ListItemSecondaryAction>
                                    )}
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
                    disabled={loading || !selectedClass || (mode === 'multiple' && selectedStudents.length === 0)}
                    color="primary"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SwapHorizIcon />}
                >
                    Transfer {mode === 'multiple' && selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''} Student{selectedStudents.length !== 1 ? 's' : ''}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransferStudent; 