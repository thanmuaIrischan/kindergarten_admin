import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    IconButton,
    Typography,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllTeachers, deleteTeacher } from '../api/teacher.api';

const TeacherList = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchTeachers();

        if (location.state?.notification) {
            const { type, message } = location.state.notification;
            showNotification(message, type);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await getAllTeachers();
            setTeachers(response.data || []);
            showNotification('Teachers loaded successfully');
        } catch (error) {
            console.error('Error fetching teachers:', error);
            showNotification('Error loading teachers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await deleteTeacher(id);
                setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== id));
                showNotification('Teacher deleted successfully');
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error deleting teacher', 'error');
            }
        }
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedTeachers = filteredTeachers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" sx={{
                    color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                    fontWeight: 600
                }}>
                    Teacher Management
                </Typography>
                <Box display="flex" gap={2}>
                    <TextField
                        size="small"
                        placeholder="Search teachers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                            endAdornment: searchTerm && (
                                <IconButton size="small" onClick={() => setSearchTerm('')}>
                                    <ClearIcon />
                                </IconButton>
                            )
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/teachers/add')}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            }
                        }}
                    >
                        Add Teacher
                    </Button>
                    <IconButton onClick={fetchTeachers}>
                        <RefreshIcon />
                    </IconButton>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Teacher ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedTeachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell>{teacher.teacherID}</TableCell>
                                <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                                <TableCell>{teacher.gender}</TableCell>
                                <TableCell>{teacher.phone}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                                        size="small"
                                        sx={{ color: theme.palette.primary.main }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(teacher.id)}
                                        size="small"
                                        sx={{ color: theme.palette.error.main }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredTeachers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherList; 