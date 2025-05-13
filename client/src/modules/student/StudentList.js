import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
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
    const fileInputRef = useRef(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        filterAndSortStudents();
    }, [searchTerm, sortType, students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/student`);
            const { data: fetchedStudents } = response.data;
            console.log('Fetched students:', fetchedStudents);
            console.log('First student object structure:', fetchedStudents[0]);
            console.log('Student ID property:', fetchedStudents[0]?._id || fetchedStudents[0]?.id);

            if (!Array.isArray(fetchedStudents)) {
                throw new Error('Invalid response format: expected an array');
            }

            setStudents(fetchedStudents);
            setFilteredStudents(fetchedStudents);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`${API_URL}/student/${id}`);
                setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const filterAndSortStudents = () => {
        let filtered = [...students];

        // Apply search filter
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(student => {
                return Object.values(student).some(value => {
                    if (value === null || value === undefined) return false;
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(searchTermLower);
                    }
                    if (typeof value === 'number') {
                        return value.toString().includes(searchTermLower);
                    }
                    if (value instanceof Date) {
                        return value.toLocaleDateString().toLowerCase().includes(searchTermLower);
                    }
                    return false;
                });
            });
        }

        // Apply sorting
        switch (sortType) {
            case 'newest':
                filtered.sort((a, b) => b.studentID.localeCompare(a.studentID));
                break;
            case 'oldest':
                filtered.sort((a, b) => a.studentID.localeCompare(b.studentID));
                break;
            case 'name':
                filtered.sort((a, b) => {
                    // Get the full name and split it into words
                    const nameA = `${a.lastName} ${a.firstName}`.toLowerCase().trim();
                    const nameB = `${b.lastName} ${b.firstName}`.toLowerCase().trim();
                    
                    // Get the last word of each name
                    const lastWordA = nameA.split(' ').pop();
                    const lastWordB = nameB.split(' ').pop();
                    
                    // Compare the last words
                    return lastWordA.localeCompare(lastWordB);
                });
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
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert(`Successfully imported ${response.data.count} students`);
                fetchStudents(); // Refresh the student list
            } else {
                alert('Failed to import students');
            }
        } catch (error) {
            console.error('Error importing students:', error);
            alert(error.response?.data?.error || 'Failed to import students');
        }
    };

    const handleExport = async (format) => {
        try {
            console.log('Starting export with format:', format);
            console.log('Using API URL:', API_URL);
            
            // Get the current filtered students
            const studentsToExport = filteredStudents.map(student => ({
                studentID: student.studentID || '',
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                name: student.firstName && student.lastName 
                    ? `${student.lastName} ${student.firstName}`.trim()
                    : student.name || '',
                dateOfBirth: student.dateOfBirth || '',
                gender: student.gender || '',
                gradeLevel: student.gradeLevel || '',
                school: student.school || '',
                class: student.class || '',
                educationSystem: student.educationSystem || '',
                fatherName: student.parentName || student.fatherFullname || '',
                fatherOccupation: student.fatherOccupation || '',
                motherName: student.motherName || student.motherFullname || '',
                motherOccupation: student.motherOccupation || '',
                image: student.studentDocument?.image || '',
                birthCertificate: student.studentDocument?.birthCertificate || '',
                householdRegistration: student.studentDocument?.householdRegistration || ''
            }));

            console.log('Exporting students:', studentsToExport);
            
            const response = await axios({
                method: 'post',
                url: `${API_URL}/student/export/${format}`,
                data: { students: studentsToExport },
                responseType: 'blob',
                headers: {
                    'Accept': format === 'xlsx' 
                        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        : 'application/json'
                }
            });

            console.log('Export response received:', {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                dataSize: response.data.size
            });

            if (!response.data || response.data.size === 0) {
                throw new Error('No data received from server');
            }
            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `students.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            console.log('Export completed successfully');
        } catch (error) {
            console.error('Error exporting students:', error);
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            alert(error.response?.data?.error || 'Failed to export students. Please check the console for details.');
        }
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
                                    mr: 1
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
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                    }
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
                            '& .MuiInputLabel-root': {
                                color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
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
                        <MenuItem 
                            onClick={() => handleSortSelect('newest')}
                            selected={sortType === 'newest'}
                        >
                            Newest ID
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleSortSelect('oldest')}
                            selected={sortType === 'oldest'}
                        >
                            Oldest ID
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleSortSelect('name')}
                            selected={sortType === 'name'}
                        >
                            Name A-Z (by last word)
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
        </Box>
    );
};

export default StudentList; 