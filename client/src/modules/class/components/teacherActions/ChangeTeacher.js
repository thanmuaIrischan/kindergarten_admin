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
            const response = await axios.get(`${API_URL}/teacher/search`, {
                params: { query: searchQuery }
            });

            // Filter out the current teacher from the list
            const filteredTeachers = response.data.filter(
                teacher => teacher.teacherID !== currentTeacherId
            );

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

            console.log('Attempting to update teacher with:', {
                classId,
                teacherID: selectedTeacher.teacherID,
                url: `${API_URL}/class/${classId}/teacher`
            });

            // Ensure we're using the correct class ID from props
            const response = await axios.patch(`${API_URL}/class/${classId}/teacher`, {
                teacherID: selectedTeacher.teacherID
            });

            console.log('Teacher update response:', response);

            if (response.data.success) {
                onTeacherChange(selectedTeacher);
                onClose();
            } else {
                throw new Error('Failed to update teacher');
            }
        } catch (error) {
            console.error('Error changing teacher:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                url: `${API_URL}/class/${classId}/teacher`,
                requestData: {
                    teacherID: selectedTeacher.teacherID
                }
            });
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
                                sx={{
                                    border: '1px solid',
                                    borderColor: selectedTeacher?.teacherID === teacher.teacherID
                                        ? 'primary.main'
                                        : theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.1)'
                                            : 'rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={teacher.avatar}>
                                        {teacher.firstName[0]}{teacher.lastName[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${teacher.firstName} ${teacher.lastName}`}
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {teacher.teacherID}
                                            {teacher.specialization && ` • ${teacher.specialization}`}
                                        </Typography>
                                    }
                                />
                                {selectedTeacher?.teacherID === teacher.teacherID && (
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            sx={{ color: 'primary.main' }}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!selectedTeacher || saving}
                    startIcon={saving && <CircularProgress size={20} color="inherit" />}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeTeacher; 