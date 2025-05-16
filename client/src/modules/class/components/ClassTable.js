import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    useTheme,
    Tooltip,
    Stack,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Autocomplete,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const EditClassDialog = ({ open, onClose, classData, onClassUpdate }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        className: '',
        semesterID: '',
        teacherID: '',
        teacherName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (classData) {
            setFormData({
                className: classData.className || '',
                semesterID: classData.semesterID || '',
                teacherID: classData.teacherID || '',
                teacherName: classData.teacherName || '',
            });
        }
    }, [classData]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            setError(null);
            try {
                const [semestersRes, teachersRes] = await Promise.all([
                    axios.get(`${API_URL}/semester`),
                    axios.get(`${API_URL}/teacher`)
                ]);

                // Ensure we have valid arrays
                const semestersData = Array.isArray(semestersRes.data) ? semestersRes.data :
                    (semestersRes.data.data || semestersRes.data.semesters || []);

                const teachersData = Array.isArray(teachersRes.data) ? teachersRes.data :
                    (teachersRes.data.data || teachersRes.data.teachers || []);

                setSemesters(semestersData);
                setTeachers(teachersData);

                // Log the data for debugging
                console.log('Semesters data:', semestersData);
                console.log('Teachers data:', teachersData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load semesters and teachers data');
                setSemesters([]);
                setTeachers([]);
            } finally {
                setLoadingData(false);
            }
        };

        if (open) {
            fetchData();
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                setError('User session not found. Please login again.');
                return;
            }

            // Create updateData object that preserves existing class data
            const updateData = {
                ...classData,
                className: formData.className,
                semesterID: formData.semesterID,
                teacherID: formData.teacherID,
                teacherName: formData.teacherName,
                // Preserve the students array
                students: classData.students || []
            };

            const response = await axios.put(
                `${API_URL}/class/${classData.id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setSuccess(true);
                // Call onClassUpdate with the updated class data
                onClassUpdate(response.data);
            }
        } catch (error) {
            console.error('Error updating class:', error);
            if (error.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
            } else {
                setError(error.response?.data?.message || 'Failed to update class');
            }
        } finally {
            setLoading(false);
        }
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
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Edit Class
                </Typography>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Class updated successfully!
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Class Name"
                            name="className"
                            value={formData.className}
                            onChange={handleChange}
                            required
                            error={!formData.className}
                            helperText={!formData.className ? "Class name is required" : ""}
                        />

                        <FormControl fullWidth required error={!formData.semesterID}>
                            <InputLabel id="semester-label" sx={{ color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b' }}>
                                Semester
                            </InputLabel>
                            <Select
                                labelId="semester-label"
                                name="semesterID"
                                value={formData.semesterID}
                                onChange={handleChange}
                                label="Semester"
                                disabled={loadingData}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                    },
                                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                }}
                            >
                                {Array.isArray(semesters) && semesters.map((semester) => (
                                    <MenuItem key={semester.id} value={semester.id}>
                                        {semester.semesterName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {!formData.semesterID && (
                                <Typography color="error" variant="caption">
                                    Semester is required
                                </Typography>
                            )}
                        </FormControl>

                        <Autocomplete
                            options={teachers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (ID: ${option.teacherID})`}
                            loading={loadingData}
                            value={teachers.find(t => t.teacherID === formData.teacherID) || null}
                            onChange={(event, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    teacherID: newValue ? newValue.teacherID : '',
                                    teacherName: newValue ? `${newValue.firstName} ${newValue.lastName}` : ''
                                }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Teacher"
                                    required
                                    error={!formData.teacherID}
                                    helperText={!formData.teacherID ? "Teacher is required" : ""}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingData ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Box>
                                        <Typography variant="body1">
                                            {option.firstName} {option.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {option.teacherID} • Phone: {option.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        />
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: 'text.secondary',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || loadingData || !formData.className || !formData.semesterID || !formData.teacherID}
                    sx={{
                        minWidth: 100,
                        position: 'relative',
                    }}
                >
                    {loading ? (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ClassTable = React.forwardRef(({ classes, onEdit, onDelete, onViewDetails }, ref) => {
    const theme = useTheme();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const handleEditClick = (classItem) => {
        setSelectedClass(classItem);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedClass(null);
    };

    const handleClassUpdate = (updatedClass) => {
        // Update the class in the list without changing the page
        onEdit(updatedClass);
        setEditDialogOpen(false);
        setSelectedClass(null);
    };

    if (!classes || classes.length === 0) {
        return (
            <TableContainer
                component={Paper}
                ref={ref}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    minHeight: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="200px"
                    flexDirection="column"
                    gap={2}
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                        p: 4
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                            fontWeight: 500
                        }}
                    >
                        No classes found
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#6b7280' : '#94a3b8',
                            textAlign: 'center'
                        }}
                    >
                        Add a new class or adjust your search filters
                    </Typography>
                </Box>
            </TableContainer>
        );
    }

    return (
        <>
            <TableContainer
                component={Paper}
                ref={ref}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '2px solid #1f2937'
                                        : '2px solid #3498db',
                                    '&:first-of-type': {
                                        borderTopLeftRadius: '8px',
                                    },
                                }}
                            >
                                Class Name
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '2px solid #1f2937'
                                        : '2px solid #3498db',
                                }}
                            >
                                Semester
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '2px solid #1f2937'
                                        : '2px solid #3498db',
                                }}
                            >
                                Teacher ID
                            </TableCell>
                            <TableCell
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '2px solid #1f2937'
                                        : '2px solid #3498db',
                                }}
                            >
                                Students Count
                            </TableCell>
                            <TableCell
                                className="no-print"
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '2px solid #1f2937'
                                        : '2px solid #3498db',
                                    width: '150px',
                                    '&:last-child': {
                                        borderTopRightRadius: '8px',
                                    },
                                }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.map((classItem) => (
                            <TableRow
                                key={classItem.id}
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8f9fa',
                                    },
                                    '&:nth-of-type(even)': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
                                    },
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#e8f4fe',
                                    },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <TableCell
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        borderBottom: theme.palette.mode === 'dark'
                                            ? '1px solid #1f2937'
                                            : '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                    }}
                                >
                                    {classItem.className}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        borderBottom: theme.palette.mode === 'dark'
                                            ? '1px solid #1f2937'
                                            : '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                    }}
                                >
                                    {classItem.semesterName || 'Unknown Semester'}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        borderBottom: theme.palette.mode === 'dark'
                                            ? '1px solid #1f2937'
                                            : '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                    }}
                                >
                                    {classItem.teacherID}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        borderBottom: theme.palette.mode === 'dark'
                                            ? '1px solid #1f2937'
                                            : '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                    }}
                                >
                                    {classItem.studentCount || 0}
                                </TableCell>
                                <TableCell
                                    className="no-print"
                                    sx={{
                                        borderBottom: theme.palette.mode === 'dark'
                                            ? '1px solid #1f2937'
                                            : '1px solid #e0e0e0',
                                        padding: '12px 16px',
                                    }}
                                >
                                    <Stack direction="row" spacing={1}>
                                        <Tooltip title="View Details">
                                            <IconButton
                                                onClick={() => {
                                                    console.log('View class details:', {
                                                        classItem,
                                                        id: classItem?.id,
                                                        fullData: JSON.stringify(classItem)
                                                    });
                                                    onViewDetails(classItem);
                                                }}
                                                size="small"
                                                sx={{
                                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                                    color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                                    padding: '8px',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                                                    },
                                                    boxShadow: theme.palette.mode === 'dark' ? '0 0 8px rgba(52, 152, 219, 0.2)' : 'none'
                                                }}
                                            >
                                                <VisibilityIcon sx={{ fontSize: '1.2rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Class">
                                            <IconButton
                                                onClick={() => handleEditClick(classItem)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                                    color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                                    padding: '8px',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                                                    },
                                                    boxShadow: theme.palette.mode === 'dark' ? '0 0 8px rgba(52, 152, 219, 0.2)' : 'none'
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: '1.2rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Class">
                                            <IconButton
                                                onClick={() => onDelete(classItem.id)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(192, 57, 43, 0.1)',
                                                    color: theme.palette.mode === 'dark' ? '#e74c3c' : '#c0392b',
                                                    padding: '8px',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.3)' : 'rgba(192, 57, 43, 0.2)',
                                                    },
                                                    boxShadow: theme.palette.mode === 'dark' ? '0 0 8px rgba(231, 76, 60, 0.2)' : 'none'
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <EditClassDialog
                open={editDialogOpen}
                onClose={handleEditClose}
                classData={selectedClass}
                onClassUpdate={handleClassUpdate}
            />
        </>
    );
});

export default ClassTable; 