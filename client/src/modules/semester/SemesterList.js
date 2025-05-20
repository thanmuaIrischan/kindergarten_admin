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
    Visibility as VisibilityIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import SemesterTable from './components/SemesterTable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { printSemesterList } from './services/PrintService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const SemesterList = ({ onEdit, onAdd, onViewDetails }) => {
    const theme = useTheme();
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importLoading, setImportLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [filteredSemesters, setFilteredSemesters] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const componentRef = useRef();

    // Common button style for action buttons
    const actionButtonStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#2980b9' : '#2472a4',
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        filterSemesters();
    }, [semesters, searchTerm, startDate, endDate]);

    const resetFilters = () => {
        setSearchTerm('');
        setStartDate(null);
        setEndDate(null);
        setFilterAnchorEl(null);
    };

    const fetchSemesters = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/semester`);
            setSemesters(response.data.data);
            resetFilters();
            showNotification('Data refreshed successfully');
        } catch (error) {
            console.error('Error fetching semesters:', error);
            showNotification('Error fetching semesters', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterSemesters = () => {
        let filtered = [...semesters];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(semester =>
                semester.semesterName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply date filters
        if (startDate || endDate) {
            filtered = filtered.filter(semester => {
                const semesterStartDate = new Date(semester.startDate);
                const semesterEndDate = new Date(semester.endDate);

                // If only start date is set
                if (startDate && !endDate) {
                    return semesterStartDate >= startDate;
                }

                // If only end date is set
                if (!startDate && endDate) {
                    return semesterEndDate <= endDate;
                }

                // If both dates are set
                if (startDate && endDate) {
                    // Check if the semester period overlaps with the filter period
                    return (
                        // Semester starts within the filter period
                        (semesterStartDate >= startDate && semesterStartDate <= endDate) ||
                        // Semester ends within the filter period
                        (semesterEndDate >= startDate && semesterEndDate <= endDate) ||
                        // Semester spans the entire filter period
                        (semesterStartDate <= startDate && semesterEndDate >= endDate)
                    );
                }

                return true;
            });
        }

        setFilteredSemesters(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this semester?')) {
            try {
                await axios.delete(`${API_URL}/semester/${id}`);
                setSemesters(prevSemesters => prevSemesters.filter(semester => semester.id !== id));
                showNotification('Semester deleted successfully');
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error deleting semester', 'error');
            }
        }
    };

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredSemesters);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Semesters");
        XLSX.writeFile(workbook, "semesters.xlsx");
    };

    const handleImport = (event) => {
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
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // Read the Excel file
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
                const requiredColumns = ['semesterName', 'startDate', 'endDate'];
                const firstRow = data[0];
                const missingColumns = requiredColumns.filter(col => !(col in firstRow));

                if (missingColumns.length > 0) {
                    showNotification(`Missing required columns: ${missingColumns.join(', ')}`, 'error');
                    setImportLoading(false);
                    return;
                }

                // Process and validate each row
                const processedData = data.map((row, index) => {
                    try {
                        // Trim whitespace from semester name
                        const semesterName = (row.semesterName || '').trim();
                        if (!semesterName) {
                            throw new Error('Semester name is required');
                        }

                        // Process dates
                        let startDate = processExcelDate(row.startDate);
                        let endDate = processExcelDate(row.endDate);

                        if (!startDate || !endDate) {
                            throw new Error('Invalid date format. Use DD-MM-YYYY');
                        }

                        // Validate date order
                        if (new Date(startDate) > new Date(endDate)) {
                            throw new Error('Start date must be before end date');
                        }

                        return {
                            semesterName,
                            startDate,
                            endDate
                        };
                    } catch (error) {
                        throw new Error(`Row ${index + 1}: ${error.message}`);
                    }
                });

                // Send to server
                const response = await axios.post(`${API_URL}/semester/import`, {
                    semesters: processedData
                });

                if (response.data.success) {
                    showNotification(`Successfully imported ${response.data.data.imported} semesters`, 'success');
                    if (response.data.data.failed > 0) {
                        console.warn('Failed imports:', response.data.data.details.errors);
                        showNotification(`Failed to import ${response.data.data.failed} semesters. Check console for details.`, 'warning');
                    }
                    await fetchSemesters();
                }
            } catch (error) {
                console.error('Import error:', error);
                showNotification(
                    error.response?.data?.message || error.message || 'Error importing semesters',
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
    };

    // Helper function to process Excel dates
    const processExcelDate = (date) => {
        if (!date) return null;

        // Try parsing as DD-MM-YYYY
        if (typeof date === 'string') {
            const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
            if (ddmmyyyyRegex.test(date)) {
                return date;
            }

            // Try parsing as Excel serial number
            const numDate = parseFloat(date);
            if (!isNaN(numDate)) {
                const jsDate = new Date((numDate - 25569) * 86400 * 1000);
                if (!isNaN(jsDate.getTime())) {
                    return jsDate.toLocaleDateString('en-GB').split('/').join('-');
                }
            }

            // Try parsing as regular date
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toLocaleDateString('en-GB').split('/').join('-');
            }
        }

        // Handle Excel serial number
        if (typeof date === 'number') {
            const jsDate = new Date((date - 25569) * 86400 * 1000);
            return jsDate.toLocaleDateString('en-GB').split('/').join('-');
        }

        return null;
    };

    const handlePrint = () => {
        const printContent = document.getElementById('semesterTable');
        const originalContents = document.body.innerHTML;

        const printStyles = `
            <style>
                @page { 
                    size: auto; 
                    margin: 20mm; 
                }
                body { 
                    margin: 0; 
                    padding: 20px; 
                }
                .no-print { 
                    display: none !important; 
                }
                .print-header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #2c3e50;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px;
                }
                th, td { 
                    border: 1px solid #2c3e50; 
                    padding: 12px; 
                    text-align: left; 
                }
                th { 
                    background-color: #2c3e50; 
                    color: white;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                tr:nth-child(odd) {
                    background-color: #ffffff;
                }
            </style>
        `;

        const printHeader = '<div class="print-header">Semester List</div>';
        document.body.innerHTML = printStyles + printHeader + printContent.outerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // Add pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get current page data
    const getCurrentPageData = () => {
        const startIndex = page * rowsPerPage;
        return filteredSemesters.slice(startIndex, startIndex + rowsPerPage);
    };

    if (loading) {
        return (
            <Box className="semester-list-container" sx={{ width: '100%', maxWidth: '100%' }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box className="semester-list-container" sx={{
            width: '100%',
            maxWidth: '100%',
            '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
            }
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} className="no-print">
                <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Semester List
                </Typography>
                <Stack direction="row" spacing={2}>
                    <TextField
                        size="small"
                        placeholder="Search semesters..."
                        value={searchTerm}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{
                                        color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b'
                                    }} />
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
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                '&::placeholder': {
                                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                },
                            }
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            minWidth: '250px',
                            '& .MuiInputBase-input': {
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                '&::placeholder': {
                                    color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                                    opacity: 1,
                                },
                            },
                        }}
                    />
                    <Tooltip title="Filter">
                        <span>
                            <IconButton
                                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                                sx={actionButtonStyle}
                            >
                                <FilterIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                        sx={{
                            ...actionButtonStyle,
                            textTransform: 'none',
                            '&:hover': {
                                ...actionButtonStyle['&:hover']
                            }
                        }}
                    >
                        Add Semester
                    </Button>
                    <Tooltip title="Refresh List">
                        <span>
                            <IconButton
                                onClick={fetchSemesters}
                                sx={actionButtonStyle}
                    >
                        <RefreshIcon />
                    </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Export">
                        <span>
                            <IconButton
                                onClick={handleExport}
                                sx={actionButtonStyle}
                            >
                                <ExportIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Import">
                        <span>
                            <IconButton
                                component="label"
                                sx={actionButtonStyle}
                            >
                                <ImportIcon />
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
                    <Tooltip title="Print List">
                        <span>
                            <IconButton
                                onClick={() => printSemesterList(filteredSemesters)}
                                sx={actionButtonStyle}
                            >
                                <PrintIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Help">
                        <span>
                            <IconButton
                                onClick={() => setHelpDialogOpen(true)}
                                sx={actionButtonStyle}
                            >
                                <HelpIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Box>

            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => setFilterAnchorEl(null)}
                className="no-print"
            >
                <Box p={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack spacing={2}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={setEndDate}
                                renderInput={(params) => <TextField {...params} size="small" />}
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
                className="no-print"
            >
                <DialogTitle>Help Guide</DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        Welcome to the Semester Management System. Here's how to use the features:
                    </Typography>
                    <Typography paragraph>
                        • Search: Use the search bar to find semesters by name
                    </Typography>
                    <Typography paragraph>
                        • Filter: Click the filter icon to filter semesters by date range
                    </Typography>
                    <Typography paragraph>
                        • Add: Click the "Add Semester" button to create a new semester
                    </Typography>
                    <Typography paragraph>
                        • Export: Download semester data as an Excel file
                    </Typography>
                    <Typography paragraph>
                        • Import: Upload semester data from an Excel file
                    </Typography>
                    <Typography paragraph>
                        • Print: Print the current semester list
                    </Typography>
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
                        Importing Semesters...
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                        Please wait while we process your file
                    </Typography>
                </Box>
            </Dialog>

            <Box sx={{ width: '100%', overflow: 'auto' }}>
            <SemesterTable
                    semesters={getCurrentPageData()}
                onEdit={onEdit}
                onDelete={handleDelete}
                    onViewDetails={onViewDetails}
                />
            </Box>

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
                    count={filteredSemesters.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{
                        '.MuiTablePagination-toolbar': {
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                            '& > *': {
                                color: 'inherit',
                            },
                        },
                        '.MuiTablePagination-select': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
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
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                            marginRight: '8px',
                        },
                        '.MuiTablePagination-displayedRows': {
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                            marginLeft: '8px',
                        },
                        '.MuiTablePagination-actions': {
                            marginLeft: '16px',
                            '& .MuiIconButton-root': {
                                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
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
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                        },
                        '.MuiTablePagination-menuItem': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                            color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                            },
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#3b82f6' : '#2563eb',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#2563eb' : '#1d4ed8',
                                },
                            },
                        },
                        '.MuiMenu-paper': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                            border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#e2e8f0'}`,
                        },
                    }}
                />
            </Box>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                className="no-print"
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

export default SemesterList; 