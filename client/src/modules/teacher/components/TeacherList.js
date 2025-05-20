import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    IconButton,
    Typography,
    TextField,
    Stack,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    useTheme,
    InputAdornment,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Clear as ClearIcon,
    Print as PrintIcon,
    Help as HelpIcon,
    FileDownload as ExportIcon,
    FileUpload as ImportIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllTeachers, deleteTeacher } from '../api/teacher.api';
import TeacherTable from './TeacherTable';
import TeacherPrintView from './TeacherPrintView';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { printTeacherList } from '../services/PrintService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const TeacherList = ({ onAdd, onEdit, onViewDetails }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importLoading, setImportLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedGender, setSelectedGender] = useState('');
    const [dateOfBirthRange, setDateOfBirthRange] = useState({
        start: null,
        end: null
    });
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const componentRef = useRef();
    const printComponentRef = useRef();
    const [printLoading, setPrintLoading] = useState(false);

    // Common button style for action buttons
    const actionButtonStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
        }
    };

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
            setTeachers(response.data);
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

    const handleExport = () => {
        const dataToExport = filteredTeachers.map(({ id, avatar, ...rest }) => rest);
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");
        XLSX.writeFile(workbook, "teachers.xlsx");
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            showNotification('Please select a file to import', 'error');
            return;
        }

        // Validate file type
        const fileType = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileType)) {
            showNotification('Please upload an Excel file (.xlsx or .xls)', 'error');
            return;
        }

        setImportLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    if (!sheetName) {
                        showNotification('Excel file is empty', 'error');
                        setImportLoading(false);
                        return;
                    }

                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

                    if (!data || data.length === 0) {
                        showNotification('No data found in the Excel file', 'error');
                        setImportLoading(false);
                        return;
                    }

                    // Validate required columns
                    const requiredColumns = ['firstName', 'lastName', 'teacherID', 'gender', 'phone', 'dateOfBirth'];
                    const firstRow = data[0];
                    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

                    if (missingColumns.length > 0) {
                        showNotification(`Missing required columns: ${missingColumns.join(', ')}`, 'error');
                        setImportLoading(false);
                        return;
                    }

                    // Send to server
                    const response = await axios.post(`${API_URL}/teacher/import`, {
                        teachers: data
                    });

                    if (response.data.success) {
                        showNotification(`Successfully imported ${response.data.data.imported} teachers`, 'success');
                        if (response.data.data.failed > 0) {
                            console.warn('Failed imports:', response.data.data.details.errors);
                            showNotification(`Failed to import ${response.data.data.failed} teachers. Check console for details.`, 'warning');
                        }
                        await fetchTeachers();
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    showNotification(
                        error.response?.data?.message || error.message || 'Error importing teachers',
                        'error'
                    );
                } finally {
                    setImportLoading(false);
                }
            };

            reader.onerror = () => {
                showNotification('Error reading file', 'error');
                setImportLoading(false);
            };

            reader.readAsBinaryString(file);
        } catch (error) {
            console.error('Error importing teachers:', error);
            showNotification('Error importing teachers', 'error');
            setImportLoading(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
        onBeforeGetContent: () => {
            setPrintLoading(true);
        },
        onAfterPrint: () => {
            setPrintLoading(false);
            showNotification('Document printed successfully');
        }
    });

    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedGender('');
        setDateOfBirthRange({
            start: null,
            end: null
        });
        setFilterAnchorEl(null);
    };

    const filteredTeachers = teachers.filter(teacher => {
        // Search term filter
        const matchesSearch =
            teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.teacherID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.phone.toLowerCase().includes(searchTerm.toLowerCase());

        // Gender filter
        const matchesGender = !selectedGender || teacher.gender === selectedGender;

        // Date of birth filter
        let matchesDateOfBirth = true;
        if (dateOfBirthRange.start || dateOfBirthRange.end) {
            const teacherDOB = new Date(teacher.dateOfBirth);
            if (dateOfBirthRange.start) {
                matchesDateOfBirth = matchesDateOfBirth && teacherDOB >= dateOfBirthRange.start;
            }
            if (dateOfBirthRange.end) {
                matchesDateOfBirth = matchesDateOfBirth && teacherDOB <= dateOfBirthRange.end;
            }
        }

        return matchesSearch && matchesGender && matchesDateOfBirth;
    });

    const paginatedTeachers = filteredTeachers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleAddClick = () => {
        if (onAdd) {
            onAdd();
        }
    };

    const handleEditClick = (teacher) => {
        if (onEdit) {
            onEdit(teacher);
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
        <Box sx={{ p: 3 }} ref={componentRef}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{
                    color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                    fontWeight: 600,
                    mb: 3
                }}>
                    Teacher Management
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" className="no-print">
                    <TextField
                        size="small"
                        placeholder="Search teachers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            minWidth: 240,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                                '& fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                '&::placeholder': {
                                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                    opacity: 1,
                                },
                            },
                            '& .MuiInputAdornment-root': {
                                '& .MuiSvgIcon-root': {
                                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchTerm('')}
                                        sx={{
                                            color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                            '&:hover': {
                                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                            },
                                        }}
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Tooltip title="Filter">
                        <IconButton
                            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                            sx={actionButtonStyle}
                        >
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={actionButtonStyle}
                    >
                        Add Teacher
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchTeachers} sx={actionButtonStyle}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export">
                        <IconButton onClick={handleExport} sx={actionButtonStyle}>
                            <ExportIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Import">
                        <IconButton component="label" sx={actionButtonStyle}>
                            <ImportIcon />
                            <input
                                type="file"
                                hidden
                                accept=".xlsx,.xls"
                                onChange={handleImport}
                                onClick={(e) => { e.target.value = null }}
                            />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Print List">
                        <IconButton
                            onClick={() => printTeacherList(teachers)}
                            sx={actionButtonStyle}
                        >
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Help">
                        <IconButton onClick={() => setHelpDialogOpen(true)} sx={actionButtonStyle}>
                            <HelpIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            <TeacherTable
                teachers={paginatedTeachers}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onViewDetails={onViewDetails}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                    setRowsPerPage(newRowsPerPage);
                    setPage(0);
                }}
                totalRows={filteredTeachers.length}
            />

            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => setFilterAnchorEl(null)}
                className="no-print"
            >
                <Box p={2} sx={{ minWidth: 300 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                            label="Gender"
                            size="small"
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={2}>
                            <DatePicker
                                label="Date of Birth From"
                                value={dateOfBirthRange.start}
                                onChange={(date) => setDateOfBirthRange(prev => ({ ...prev, start: date }))}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true
                                    }
                                }}
                            />
                            <DatePicker
                                label="Date of Birth To"
                                value={dateOfBirthRange.end}
                                onChange={(date) => setDateOfBirthRange(prev => ({ ...prev, end: date }))}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                onClick={resetFilters}
                                startIcon={<ClearIcon />}
                                fullWidth
                            >
                                Clear Filters
                            </Button>
                        </Stack>
                    </LocalizationProvider>
                </Box>
            </Menu>

            <Dialog
                open={helpDialogOpen}
                onClose={() => setHelpDialogOpen(false)}
                aria-labelledby="help-dialog-title"
            >
                <DialogTitle id="help-dialog-title">Teacher Management Help</DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        Welcome to the Teacher Management section. Here you can:
                    </Typography>
                    <ul>
                        <li>View all teachers in a paginated list</li>
                        <li>Search for teachers by name, ID, or phone number</li>
                        <li>Filter teachers by gender and date of birth</li>
                        <li>Add new teachers</li>
                        <li>Edit existing teacher information</li>
                        <li>Delete teachers</li>
                        <li>Export teacher data to Excel</li>
                        <li>Import teacher data from Excel</li>
                        <li>Print the teacher list</li>
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={importLoading}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    bgcolor={theme.palette.background.paper}
                    p={3}
                    borderRadius={2}
                >
                    <CircularProgress size={60} />
                    <Typography variant="h6" style={{ marginTop: 16, color: theme.palette.text.primary }}>
                        Importing Teachers...
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                        Please wait while we process your file
                    </Typography>
                </Box>
            </Dialog>

            <Box
                ref={printComponentRef}
                sx={{
                    display: 'none',
                    '@media print': {
                        display: 'block'
                    },
                    '& .MuiSvgIcon-root': {
                        display: 'none !important'
                    }
                }}
            >
                <TeacherPrintView teachers={filteredTeachers} />
            </Box>

            <style>
                {`
                    @media print {
                        .MuiSvgIcon-root {
                            display: none !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        @page {
                            size: A4 portrait;
                            margin: 20mm;
                        }
                    }
                `}
            </style>

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