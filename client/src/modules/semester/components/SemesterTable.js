import React from 'react';
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
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';

const SemesterTable = ({ semesters, onEdit, onDelete, onViewDetails }) => {
    const theme = useTheme();

    if (!semesters || semesters.length === 0) {
        return (
            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    minHeight: '200px',
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
                        No semesters found
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#6b7280' : '#94a3b8',
                        }}
                    >
                        Add a new semester or adjust your search filters
                    </Typography>
                </Box>
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
                            }}
                        >
                            Semester Name
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
                            Start Date
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
                            End Date
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
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {semesters.map((semester) => (
                        <TableRow
                            key={semester.id}
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
                                        : '1px solid #e0e0e0'
                                }}
                            >
                                {semester.semesterName}
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '1px solid #1f2937'
                                        : '1px solid #e0e0e0'
                                }}
                            >
                                {semester.startDate}
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '1px solid #1f2937'
                                        : '1px solid #e0e0e0'
                                }}
                            >
                                {semester.endDate}
                            </TableCell>
                            <TableCell
                                className="no-print"
                                sx={{
                                    borderBottom: theme.palette.mode === 'dark'
                                        ? '1px solid #1f2937'
                                        : '1px solid #e0e0e0'
                                }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="View Details">
                                        <span>
                                            <IconButton
                                                onClick={() => onViewDetails(semester)}
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
                                                <VisibilityIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <span>
                                            <IconButton
                                                onClick={() => onEdit(semester)}
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
                                                <EditIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <span>
                                            <IconButton
                                                onClick={() => onDelete(semester.id)}
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
                                                <DeleteIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SemesterTable; 