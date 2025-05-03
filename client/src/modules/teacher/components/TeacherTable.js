import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    useTheme,
    Tooltip,
    Stack,
    Typography,
    Box,
    Avatar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';

const TeacherTable = ({
    teachers,
    onEdit,
    onDelete,
    onViewDetails,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    totalRows
}) => {
    const theme = useTheme();

    const handleChangePage = (event, newPage) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        onRowsPerPageChange(parseInt(event.target.value, 10));
    };

    if (!teachers || teachers.length === 0) {
        return (
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    minHeight: '150px',
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'auto',
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="200px"
                    flexDirection="column"
                    gap={2}
                >
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#9ca3af' : '#64748b',
                        }}
                    >
                        No teachers found
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#6b7280' : '#94a3b8',
                        }}
                    >
                        Add a new teacher or adjust your search filters
                    </Typography>
                </Box>
                <TablePagination
                    component="div"
                    count={totalRows}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            color: theme.palette.mode === 'dark' ? '#9ca3af' : 'inherit',
                        },
                        '.MuiTablePagination-select': {
                            color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                        }
                    }}
                />
            </TableContainer>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                    : '0 2px 4px rgba(0, 0, 0, 0.1)',
                minHeight: '150px',
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto',
                '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                }
            }}
        >
            <Table sx={{
                minWidth: 900,
                tableLayout: 'fixed',
                '& .MuiTableCell-root': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    px: 2
                }
            }}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                width: '80px',
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db',
                            }}
                        >
                            Profile
                        </TableCell>
                        <TableCell
                            sx={{
                                width: '120px',
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
                                width: '200px',
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db',
                            }}
                        >
                            Name
                        </TableCell>
                        <TableCell
                            sx={{
                                width: '100px',
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db',
                            }}
                        >
                            Gender
                        </TableCell>
                        <TableCell
                            sx={{
                                width: '150px',
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db',
                            }}
                        >
                            Phone
                        </TableCell>
                        <TableCell
                            sx={{
                                width: '150px',
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db',
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teachers.map((teacher) => (
                        <TableRow
                            key={teacher.id}
                            sx={{
                                '&:nth-of-type(odd)': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8f9fa',
                                },
                                '&:nth-of-type(even)': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#ffffff',
                                },
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#e9ecef',
                                },
                                transition: 'background-color 0.2s ease-in-out',
                            }}
                        >
                            <TableCell>
                                <Avatar
                                    src={teacher.avatar}
                                    alt={`${teacher.firstName} ${teacher.lastName}`}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9'
                                    }}
                                >
                                    {teacher.firstName[0]}{teacher.lastName[0]}
                                </Avatar>
                            </TableCell>
                            <TableCell>{teacher.teacherID}</TableCell>
                            <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                            <TableCell>{teacher.gender}</TableCell>
                            <TableCell>{teacher.phone}</TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            onClick={() => onViewDetails(teacher)}
                                            size="small"
                                            sx={{
                                                color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                            }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            onClick={() => onEdit(teacher)}
                                            size="small"
                                            sx={{
                                                color: theme.palette.mode === 'dark' ? '#10b981' : '#059669',
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() => onDelete(teacher.id)}
                                            size="small"
                                            sx={{
                                                color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626',
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                sx={{
                    color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                        color: theme.palette.mode === 'dark' ? '#9ca3af' : 'inherit',
                    },
                    '.MuiTablePagination-select': {
                        color: theme.palette.mode === 'dark' ? '#ffffff' : 'inherit',
                    }
                }}
            />
        </TableContainer>
    );
};

export default TeacherTable; 