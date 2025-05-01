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
} from '@mui/icons-material';
import axios from 'axios';
import StudentTable from './components/StudentTable';
import ImportDialog from './components/ImportDialog';
import ExportDialog from './components/ExportDialog';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const StudentList = ({ onEdit, onAdd, onViewDetails }) => {
    const theme = useTheme();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const fileInputRef = useRef(null);

    // Pagination and filtering state
    const [selectedClass, setSelectedClass] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [uniqueClasses, setUniqueClasses] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (students.length > 0) {
            const classes = [...new Set(students.map(student => student.class))]
                .filter(Boolean)
                .sort((a, b) => {
                    // Extract class numbers for comparison
                    const aNum = a.match(/\d+/);
                    const bNum = b.match(/\d+/);
                    if (aNum && bNum) {
                        return parseInt(aNum[0]) - parseInt(bNum[0]);
                    }
                    return a.localeCompare(b);
                });
            setUniqueClasses(classes);
        }
    }, [students]);

    useEffect(() => {
        filterStudents();
    }, [searchTerm, selectedClass, students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/student`);
            const { data: fetchedStudents } = response.data;

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

    const filterStudents = () => {
        let filtered = [...students];

        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = filtered.filter(student =>
                student.firstName?.toLowerCase().includes(searchTermLower) ||
                student.lastName?.toLowerCase().includes(searchTermLower) ||
                student.parentName?.toLowerCase().includes(searchTermLower) ||
                student.class?.toLowerCase().includes(searchTermLower) ||
                student.studentID?.toLowerCase().includes(searchTermLower) ||
                student.school?.toLowerCase().includes(searchTermLower)
            );
        }

        if (selectedClass) {
            filtered = filtered.filter(student => student.class === selectedClass);
        }

        setFilteredStudents(filtered);
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${API_URL}/students/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchStudents();
        } catch (error) {
            console.error('Error importing file:', error);
        }
        event.target.value = '';
    };

    const handleExport = async (format) => {
        try {
            const response = await axios.get(`${API_URL}/students/export/${format}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `students_export.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting students:', error);
        }
    };

    const handlePrint = () => {
        const printContent = document.getElementById('studentTable');
        const originalContents = document.body.innerHTML;

        const printStyles = `
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                @media print {
                    body { padding: 20px; }
                    button { display: none; }
                }
            </style>
        `;

        document.body.innerHTML = printStyles + printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const handleViewDetails = (studentId) => {
        const student = students.find(s => s.id === studentId);
        console.log('Selected Student:', student);
        if (student) {
            onViewDetails(student);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#1976d2' : '#1976d2',
                        fontWeight: 800,
                        fontSize: '2.2rem',
                        textShadow: theme.palette.mode === 'dark'
                            ? '0 0 10px rgba(232, 244, 254, 0.4), 0 0 20px rgba(52, 152, 219, 0.5), 0 0 30px rgba(52, 152, 219, 0.3)'
                            : 'none',
                        letterSpacing: theme.palette.mode === 'dark' ? '0.5px' : 'normal',
                        position: 'relative',
                        '&::after': theme.palette.mode === 'dark' ? {
                            content: '""',
                            position: 'absolute',
                            bottom: -4,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(90deg, #3498db 30%, rgba(52, 152, 219, 0.3))',
                            borderRadius: '2px',
                            boxShadow: '0 0 8px rgba(52, 152, 219, 0.5)'
                        } : {}
                    }}
                >
                    Student List
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                            boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(52, 152, 219, 0.3)' : 'none'
                        }}
                    >
                        Add Student
                    </Button>
                    <IconButton
                        onClick={fetchStudents}
                        title="Refresh List"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                            boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(52, 152, 219, 0.3)' : 'none'
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setImportDialogOpen(true)}
                        title="Import Students"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                            boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(52, 152, 219, 0.3)' : 'none'
                        }}
                    >
                        <UploadIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setExportDialogOpen(true)}
                        title="Export Students"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                            boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(52, 152, 219, 0.3)' : 'none'
                        }}
                    >
                        <DownloadIcon />
                    </IconButton>
                    <IconButton
                        onClick={handlePrint}
                        title="Print List"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                            boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(52, 152, 219, 0.3)' : 'none'
                        }}
                    >
                        <PrintIcon />
                    </IconButton>
                </Stack>
            </Box>

            <Box mb={3} display="flex" gap={2} alignItems="center">
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
                        sx: {
                            backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#ffffff',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                borderWidth: '2px'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                                borderWidth: '2px'
                            },
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
                            '&::placeholder': {
                                color: theme.palette.mode === 'dark' ? '#bdc3c7' : '#7f8c8d',
                            }
                        }
                    }}
                    sx={{
                        width: 300,
                        '& label.Mui-focused': {
                            color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                        }
                    }}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Class</InputLabel>
                    <Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        label="Filter by Class"
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#ffffff',
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            },
                        }}
                    >
                        <MenuItem value="">All Classes</MenuItem>
                        {uniqueClasses.map((classId) => (
                            <MenuItem key={classId} value={classId}>
                                {classId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                onImportClick={(format) => {
                    fileInputRef.current.click();
                    setImportDialogOpen(false);
                }}
            />

            <ExportDialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                onExportClick={handleExport}
            />

            <input
                type="file"
                accept=".json,.xlsx,.xls"
                onChange={handleImport}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
        </Box>
    );
};

export default StudentList; 