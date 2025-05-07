import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    InputAdornment,
    Divider,
    useTheme,
    Alert,
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ChangeTeacher = ({ open, onClose, currentTeacherId, classId, onTeacherChange }) => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            fetchTeachers();
        } else {
            // Reset state when dialog closes
            setSearchQuery('');
            setSelectedTeacher(null);
            setError(null);
        }
    }, [open, searchQuery]);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/teacher`);

            // Filter out the current teacher and filter by search query if present
            const filteredTeachers = response.data
                .filter(teacher => teacher.teacherID !== currentTeacherId)
                .filter(teacher => {
                    if (!searchQuery) return true;
                    const searchLower = searchQuery.toLowerCase();
                    return (
                        teacher.firstName.toLowerCase().includes(searchLower) ||
                        teacher.lastName.toLowerCase().includes(searchLower) ||
                        teacher.teacherID.toLowerCase().includes(searchLower)
                    );
                });

            setTeachers(filteredTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setError('Failed to fetch teachers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherSelect = (teacher) => {
        setSelectedTeacher(teacher);
        setError(null);
    };

    const handleSave = async () => {
        if (!selectedTeacher || !classId) {
            console.error('Missing required data:', { selectedTeacher, classId });
            setError('Missing required data. Please try again.');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // First get the current class data to preserve all fields
            const currentClassResponse = await axios.get(`${API_URL}/class/${classId}`);
            const currentClassData = currentClassResponse.data.data;

            // Update the teacher while preserving other data
            const response = await axios.patch(`${API_URL}/class/${classId}/teacher`, {
                teacherID: selectedTeacher.teacherID,
                studentIDs: currentClassData.studentIDs || [],
                semesterID: currentClassData.semesterID
            });

            if (response.data) {
                // Get fresh class data to ensure proper state update
                const classResponse = await axios.get(`${API_URL}/class/${classId}`);
                const updatedClass = classResponse.data.data;

                // Get fresh teacher data
                const teacherResponse = await axios.get(`${API_URL}/teacher/by-teacher-id/${selectedTeacher.teacherID}`);
                const updatedTeacher = teacherResponse.data;

                console.log('Teacher change successful:', {
                    updatedClass,
                    updatedTeacher,
                    preservedData: {
                        studentIDs: updatedClass.studentIDs,
                        semesterID: updatedClass.semesterID
                    }
                });

                // Update the UI with fresh data
                onTeacherChange(updatedTeacher, updatedClass);
                onClose();
            }
        } catch (error) {
            console.error('Error changing teacher:', error);
            setError(error.response?.data?.message || 'Failed to change teacher. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Dialog
            open={open}
            onClose={!saving ? onClose : undefined}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                }
            }}
        >
            <DialogTitle>
                Change Class Teacher
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    fullWidth
                    placeholder="Search teachers..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    disabled={saving}
                    sx={{ mb: 2, mt: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Divider sx={{ my: 2 }} />
                {loading ? (
                    <Box display="flex" justifyContent="center" my={3}>
                        <CircularProgress />
                    </Box>
                ) : teachers.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ my: 3 }}>
                        {searchQuery ? 'No matching teachers found' : 'No available teachers'}
                    </Typography>
                ) : (
                    <List sx={{
                        maxHeight: 400,
                        overflow: 'auto',
                        '& .MuiListItem-root': {
                            borderRadius: 1,
                            mb: 1,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.04)',
                            }
                        }
                    }}>
                        {teachers.map((teacher) => (
                            <ListItem
                                key={teacher.teacherID}
                                button
                                selected={selectedTeacher?.teacherID === teacher.teacherID}
                                onClick={() => handleTeacherSelect(teacher)}
                                disabled={saving}
                                sx={{
                                    border: '1px solid',
                                    borderColor: selectedTeacher?.teacherID === teacher.teacherID
                                        ? 'primary.main'
                                        : theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.12)'
                                            : 'rgba(0, 0, 0, 0.12)',
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={teacher.avatar}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${teacher.firstName} ${teacher.lastName}`}
                                    secondary={`Teacher ID: ${teacher.teacherID}`}
                                />
                                {selectedTeacher?.teacherID === teacher.teacherID && (
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" disabled>
                                            <CheckIcon color="primary" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button
                    onClick={onClose}
                    disabled={saving}
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!selectedTeacher || saving}
                    variant="contained"
                    sx={{ minWidth: 100 }}
                >
                    {saving ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeTeacher; 