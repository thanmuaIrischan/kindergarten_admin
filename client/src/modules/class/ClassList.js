import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Stack,
    TextField,
    InputAdornment,
    Tooltip,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    useTheme,
    TablePagination,
    Select,
    FormControl,
    InputLabel,
    Paper,
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    ImportExport as ImportExportIcon,
    Print as PrintIcon,
    Help as HelpIcon,
    FileDownload as ExportIcon,
    FileUpload as ImportIcon,
    Clear as ClearIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { getAllClasses, deleteClass } from './api/class.api';
import ClassTable from './components/ClassTable';
import { useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ClassList = ({ onEdit, onAdd, onViewDetails }) => {
    const theme = useTheme();
    const location = useLocation();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importLoading, setImportLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [selectedSemester, setSelectedSemester] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const componentRef = useRef();
    const [classesWithSemester, setClassesWithSemester] = useState([]);

    // Common button style for action buttons
    const actionButtonStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
        color: '#ffffff',
        padding: '8px',
        borderRadius: '50%',
        minWidth: 'unset',
        width: '40px',
        height: '40px',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchSemesters();

        // Handle notification from AddClass component
        if (location.state?.notification) {
            const { type, message } = location.state.notification;
            showNotification(message, type);
            // Clear the notification from location state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (classes.length > 0 && semesters.length > 0) {
            console.log('Raw Classes Data:', classes);
            console.log('Raw Semesters Data:', semesters);

            // Combine class data with semester data
            const enrichedClasses = classes.map(classItem => {
                const semester = semesters.find(sem => sem.id === classItem.semesterID);
                console.log('Mapping class:', {
                    classId: classItem.id,
                    className: classItem.className,
                    semesterID: classItem.semesterID,
                    foundSemester: semester
                });

                return {
                    ...classItem,
                    semesterName: semester ? semester.semesterName : 'Unknown Semester'
                };
            });

            console.log('Final Enriched Classes:', enrichedClasses);
            setClassesWithSemester(enrichedClasses);
            setFilteredClasses(enrichedClasses); // Initialize filtered classes with enriched data
        }
    }, [classes, semesters]);

    useEffect(() => {
        filterClasses();
    }, [searchTerm, selectedSemester, classesWithSemester]);

    const resetFilters = () => {
        setSearchTerm('');
        setFilterAnchorEl(null);
    };

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const response = await getAllClasses();
            console.log('Classes API Response:', response);
            const classesData = response.data.data || [];
            console.log('Processed Classes Data:', classesData);
            setClasses(classesData);
            resetFilters();
            showNotification('Data refreshed successfully');
        } catch (error) {
            console.error('Error fetching classes:', error);
            showNotification('Error fetching classes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSemesters = async () => {
        try {
            const response = await axios.get(`${API_URL}/semester`);
            console.log('Semesters API Response:', response);
            const semestersData = response.data.data || [];
            console.log('Processed Semesters Data:', semestersData);
            setSemesters(semestersData);
        } catch (error) {
            console.error('Error fetching semesters:', error);
            showNotification('Error fetching semesters', 'error');
        }
    };

    const filterClasses = () => {
        if (!classesWithSemester) return;

        console.log('Filtering classes with:', {
            searchTerm,
            selectedSemester,
            classesWithSemester
        });

        let filtered = [...classesWithSemester];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(classItem =>
                classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (classItem.semesterName && classItem.semesterName.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply semester filter
        if (selectedSemester) {
            filtered = filtered.filter(classItem => classItem.semesterID === selectedSemester);
        }

        console.log('Filtered classes:', filtered);
        setFilteredClasses(filtered);
        setPage(0); // Reset to first page when filters change
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await deleteClass(id);
                setClasses(prevClasses => prevClasses.filter(classItem => classItem.id !== id));
                showNotification('Class deleted successfully');
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error deleting class', 'error');
            }
        }
    };

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredClasses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Classes");
        XLSX.writeFile(workbook, "classes.xlsx");
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) {
            showNotification('Please select a file to import', 'error');
            return;
        }

        const fileType = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileType)) {
            showNotification('Please upload an Excel file (.xlsx or .xls)', 'error');
            return;
        }

        setImportLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                const response = await axios.post(`${API_URL}/class/import`, { classes: data });
                await fetchClasses();
                showNotification('Classes imported successfully');
            } catch (error) {
                console.error('Error importing classes:', error);
                showNotification('Error importing classes', 'error');
            } finally {
                setImportLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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

    const getCurrentPageData = () => {
        const startIndex = page * rowsPerPage;
        return filteredClasses.slice(startIndex, startIndex + rowsPerPage);
    };

    if (loading) {
        return (
            <Box className="class-list-container" sx={{ width: '100%', maxWidth: '100%' }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box className="class-list-container" sx={{
            width: '100%',
            maxWidth: '100%',
            '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
            }
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} className="no-print">
                <Typography variant="h4" component="h1" sx={{
                    color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                    fontWeight: 600,
                    fontSize: '2rem',
                    letterSpacing: '-0.025em'
                }}>
                    Class List
                </Typography>
                <Stack direction="row" spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Semester</InputLabel>
                        <Select
                            value={selectedSemester}
                            label="Semester"
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                },
                            }}
                        >
                            <MenuItem value="">All Semesters</MenuItem>
                            {semesters.map((semester) => (
                                <MenuItem key={semester.id} value={semester.id}>
                                    {semester.semesterName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        placeholder="Search classes..."
                        value={searchTerm}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{
                                        color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                                        fontSize: '1.2rem'
                                    }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                                        <ClearIcon sx={{
                                            color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                                            fontSize: '1.2rem'
                                        }} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
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
                                '&::placeholder': {
                                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                },
                            }
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            minWidth: '250px',
                            '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                '&::placeholder': {
                                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                    opacity: 1,
                                },
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                        sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                            color: '#ffffff',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
                            }
                        }}
                    >
                        Add Class
                    </Button>
                    <Tooltip title={viewMode === 'list' ? 'Grid View' : 'List View'}>
                        <IconButton
                            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            size="small"
                            sx={actionButtonStyle}
                        >
                            {viewMode === 'list' ? (
                                <ViewModuleIcon sx={{ fontSize: '1.2rem' }} />
                            ) : (
                                <ViewListIcon sx={{ fontSize: '1.2rem' }} />
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh">
                        <span>
                            <IconButton
                                onClick={fetchClasses}
                                size="small"
                                sx={actionButtonStyle}
                            >
                                <RefreshIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Export">
                        <span>
                            <IconButton
                                onClick={handleExport}
                                size="small"
                                sx={actionButtonStyle}
                            >
                                <ExportIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Import">
                        <span>
                            <IconButton
                                component="label"
                                size="small"
                                sx={actionButtonStyle}
                            >
                                <ImportIcon sx={{ fontSize: '1.2rem' }} />
                                <input
                                    type="file"
                                    hidden
                                    accept=".xlsx,.xls"
                                    onChange={handleImport}
                                    onClick={(e) => { e.target.value = null }}
                                />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Print">
                        <span>
                            <IconButton
                                onClick={handlePrint}
                                size="small"
                                sx={actionButtonStyle}
                            >
                                <PrintIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Help">
                        <span>
                            <IconButton
                                onClick={() => setHelpDialogOpen(true)}
                                size="small"
                                sx={actionButtonStyle}
                            >
                                <HelpIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Box>

            {viewMode === 'list' ? (
                <Box sx={{
                    width: '100%',
                    overflow: 'auto',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}>
                    <ClassTable
                        classes={getCurrentPageData()} // Use getCurrentPageData to get the paginated filtered classes
                        onEdit={onEdit}
                        onDelete={handleDelete}
                        onViewDetails={onViewDetails}
                        ref={componentRef}
                    />
                </Box>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 2,
                    p: 2,
                }}>
                    {getCurrentPageData().map((classItem) => (
                        <Paper
                            key={classItem.id}
                            sx={{
                                p: 2,
                                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                                borderRadius: '8px',
                                border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {classItem.className}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Semester: {classItem.semesterName}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Teacher: {classItem.teacherID}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Students: {classItem.studentCount || 0}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    onClick={() => onViewDetails(classItem)}
                                    size="small"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                                        },
                                    }}
                                >
                                    <VisibilityIcon sx={{ fontSize: '1.2rem' }} />
                                </IconButton>
                                <IconButton
                                    onClick={() => onEdit(classItem)}
                                    size="small"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                                        },
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: '1.2rem' }} />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleDelete(classItem.id)}
                                    size="small"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(192, 57, 43, 0.1)',
                                        color: theme.palette.mode === 'dark' ? '#e74c3c' : '#c0392b',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(231, 76, 60, 0.3)' : 'rgba(192, 57, 43, 0.2)',
                                        },
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                                </IconButton>
                            </Stack>
                        </Paper>
                    ))}
                </Box>
            )}

            <Box
                display="flex"
                justifyContent="flex-end"
                mt={2}
                className="no-print"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                    padding: '8px',
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                    width: '100%',
                }}
            >
                <TablePagination
                    component="div"
                    count={filteredClasses.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{
                        '.MuiTablePagination-toolbar': {
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            '& > *': {
                                color: 'inherit',
                            },
                        },
                        '.MuiTablePagination-select': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#4b5563' : '#f1f5f9',
                            },
                            '&:focus': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#4b5563' : '#f1f5f9',
                                outline: 'none',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 0 0 2px rgba(59, 130, 246, 0.5)'
                                    : '0 0 0 2px rgba(37, 99, 235, 0.5)',
                            },
                        },
                        '.MuiTablePagination-selectLabel': {
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            marginRight: '8px',
                        },
                        '.MuiTablePagination-displayedRows': {
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                            marginLeft: '8px',
                        },
                        '.MuiTablePagination-actions': {
                            marginLeft: '16px',
                            '& .MuiIconButton-root': {
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                                backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                                border: `1px solid ${theme.palette.mode === 'dark' ? '#4b5563' : '#e2e8f0'}`,
                                margin: '0 4px',
                                padding: '4px',
                                '&.Mui-disabled': {
                                    color: theme.palette.mode === 'dark' ? '#6b7280' : '#cbd5e1',
                                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f1f5f9',
                                    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                                },
                                '&:hover:not(.Mui-disabled)': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#4b5563' : '#e2e8f0',
                                },
                            },
                        },
                        '.MuiSelect-icon': {
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                        },
                    }}
                />
            </Box>

            <Dialog
                open={helpDialogOpen}
                onClose={() => setHelpDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8fafc',
                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                }}>
                    Help Guide
                </DialogTitle>
                <DialogContent sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8fafc',
                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                }}>
                    <Typography paragraph sx={{ mt: 2 }}>
                        Welcome to the Class Management System. Here's how to use the features:
                    </Typography>
                    <Typography paragraph>
                        • Search: Use the search bar to find classes by name
                    </Typography>
                    <Typography paragraph>
                        • Add: Click the "Add Class" button to create a new class
                    </Typography>
                    <Typography paragraph>
                        • Export: Download class data as an Excel file
                    </Typography>
                    <Typography paragraph>
                        • Import: Upload class data from an Excel file
                    </Typography>
                    <Typography paragraph>
                        • Print: Print the current class list
                    </Typography>
                </DialogContent>
                <DialogActions sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8fafc',
                }}>
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
                    bgcolor={theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff'}
                    p={3}
                    borderRadius={2}
                >
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{
                        mt: 2,
                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#1f2937',
                    }}>
                        Importing Classes...
                    </Typography>
                    <Typography variant="body2" sx={{
                        mt: 1,
                        color: theme.palette.mode === 'dark' ? '#9ca3af' : '#6b7280',
                    }}>
                        Please wait while we process your file
                    </Typography>
                </Box>
            </Dialog>

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

export default ClassList; 