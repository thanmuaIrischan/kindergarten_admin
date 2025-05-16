import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    IconButton,
    Box,
    CircularProgress,
    TextField,
    Stack,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    useTheme,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Add as AddIcon,
    Clear as ClearIcon,
    Sort as SortIcon,
} from '@mui/icons-material';
import axios from 'axios';
import StudentTable from './components/StudentTable';
import ImportDialog from './components/ImportDialog';
import ExportDialog from './components/ExportDialog';
import { handlePrint } from './utils/printUtils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const StudentList = ({ onEdit, onAdd, onViewDetails }) => {
    const theme = useTheme();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [sortType, setSortType] = useState('newest');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const fileInputRef = useRef(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);

    useEffect(() => {
        fetchStudents();
    }, [page, rowsPerPage]);

    useEffect(() => {
        filterAndSortStudents();
    }, [searchTerm, sortType, students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/student`, {
                params: { page: page + 1, limit: rowsPerPage },
            });
            const { data, pagination } = response.data;
            if (!Array.isArray(data)) {
                throw new Error('Invalid response format: expected an array');
            }
    
            console.log('Raw API response:', response.data);
            console.log('Fetched students:', data);
            console.log('First student:', data[0]);
            console.log('First student keys:', data[0] ? Object.keys(data[0]) : 'No students');
    
            // Prepare data for StudentTable
            const formattedStudents = data.map(student => ({
                ...student,
                id: student.id,
                name: [student.lastName, student.firstName].filter(Boolean).join(' ') || 'N/A',
                studentID: student.studentID || 'N/A',
                fatherFullname: student.fatherName || '',
                motherFullname: student.motherName || '',
                class: student.class || 'N/A',
                school: student.school || 'N/A',
                gradeLevel: student.gradeLevel || 'N/A',
                gender: student.gender || 'N/A',
                dateOfBirth: student.dateOfBirth || 'N/A',
                educationSystem: student.educationSystem || 'N/A',
                fatherOccupation: student.fatherOccupation || 'N/A',
                motherOccupation: student.motherOccupation || 'N/A',
                parentContact: student.parentContact || 'N/A',
                studentDocument: student.studentDocument || {},
                parentName: [student.fatherName, student.motherName].filter(Boolean).join(' & ') || 'N/A',
            }));
    
            console.log('Formatted students:', formattedStudents);
            console.log('First formatted student:', formattedStudents[0]);
    
            setStudents(formattedStudents);
            setFilteredStudents(formattedStudents);
            setTotalStudents(pagination?.total || data.length);
        } catch (error) {
            console.error('Error fetching students:', error);
            console.error('Error response:', error.response?.data);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to fetch students. Please check server connection.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`${API_URL}/student/${id}`);
                setSnackbar({
                    open: true,
                    message: 'Student deleted successfully',
                    severity: 'success',
                });
                await fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
                setSnackbar({
                    open: true,
                    message: error.response?.data?.error || 'Failed to delete student',
                    severity: 'error',
                });
            }
        }
    };

    const filterAndSortStudents = () => {
        let filtered = [...students];

        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(student =>
                student.name?.toLowerCase().includes(searchTermLower) ||
                student.studentID?.toLowerCase().includes(searchTermLower) ||
                student.fatherFullname?.toLowerCase().includes(searchTermLower) ||
                student.motherFullname?.toLowerCase().includes(searchTermLower) ||
                student.class?.toLowerCase().includes(searchTermLower) ||
                student.school?.toLowerCase().includes(searchTermLower)
            );
        }

        switch (sortType) {
            case 'newest':
                filtered.sort((a, b) => b.studentID.localeCompare(a.studentID));
                break;
            case 'oldest':
                filtered.sort((a, b) => a.studentID.localeCompare(b.studentID));
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }

        setFilteredStudents(filtered);
    };

    const handleImport = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${API_URL}/student/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setSnackbar({
                    open: true,
                    message: `Successfully imported ${response.data.count} students`,
                    severity: 'success',
                });
                await fetchStudents();
            } else {
                throw new Error('Import failed');
            }
        } catch (error) {
            console.error('Error importing students:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to import students',
                severity: 'error',
            });
        }
        setImportDialogOpen(false);
    };

    const handleExport = async (format) => {
        try {
            const studentsToExport = filteredStudents.map(student => ({
                studentID: student.studentID || '',
                name: student.name || '',
                dateOfBirth: student.dateOfBirth || '',
                gender: student.gender || '',
                gradeLevel: student.gradeLevel || '',
                school: student.school || '',
                class: student.class || '',
                educationSystem: student.educationSystem || '',
                fatherFullname: student.fatherFullname || '',
                fatherOccupation: student.fatherOccupation || '',
                motherFullname: student.motherFullname || '',
                motherOccupation: student.motherOccupation || '',
                image: student.studentDocument?.image || '',
                birthCertificate: student.studentDocument?.birthCertificate || '',
                householdRegistration: student.studentDocument?.householdRegistration || '',
            }));

            const response = await axios({
                method: 'post',
                url: `${API_URL}/student/export/${format}`,
                data: { students: studentsToExport },
                responseType: 'blob',
                headers: {
                    Accept: format === 'xlsx'
                        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        : 'application/json',
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `students.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setSnackbar({
                open: true,
                message: `Exported students as ${format.toUpperCase()}`,
                severity: 'success',
            });
        } catch (error) {
            console.error('Error exporting students:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.error || 'Failed to export students',
                severity: 'error',
            });
        }
        setExportDialogOpen(false);
    };

    const handleViewDetails = (studentId) => {
        onViewDetails(studentId);
    };

    const handleSortClick = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setSortAnchorEl(null);
    };

    const handleSortSelect = (type) => {
        setSortType(type);
        handleSortClose();
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                        mr: 1,
                                    }}
                                />
                            ),
                            endAdornment: searchTerm && (
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchTerm('')}
                                    sx={{
                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(52, 152, 219, 0.2)'
                                                : 'rgba(41, 128, 185, 0.1)',
                                        },
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff',
                                '& fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2471a3',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2471a3',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? '#000000' : '#000000',
                            },
                        }}
                    />
                    <IconButton
                        onClick={handleSortClick}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                            },
                        }}
                    >
                        <SortIcon />
                    </IconButton>
                    <Menu
                        anchorEl={sortAnchorEl}
                        open={Boolean(sortAnchorEl)}
                        onClose={handleSortClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                                '& .MuiMenuItem-root': {
                                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                    '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(41, 128, 185, 0.1)',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.2)',
                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={() => handleSortSelect('newest')} selected={sortType === 'newest'}>
                            Newest ID
                        </MenuItem>
                        <MenuItem onClick={() => handleSortSelect('oldest')} selected={sortType === 'oldest'}>
                            Oldest ID
                        </MenuItem>
                        <MenuItem onClick={() => handleSortSelect('name')} selected={sortType === 'name'}>
                            Name A-Z
                        </MenuItem>
                    </Menu>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2471a3',
                            },
                        }}
                    >
                        Add Student
                    </Button>
                    <IconButton
                        onClick={fetchStudents}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                            },
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setImportDialogOpen(true)}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                            },
                        }}
                    >
                        <UploadIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setExportDialogOpen(true)}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                            },
                        }}
                    >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handlePrint(filteredStudents)}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                            },
                        }}
                    >
                        <PrintIcon />
                    </IconButton>
                </Stack>
            </Box>

            <StudentTable
                students={filteredStudents}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRows={totalStudents}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                onEdit={onEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
            />

            <ImportDialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
                onImport={handleImport}
            />

            <ExportDialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                onExport={handleExport}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StudentList;