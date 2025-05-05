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

const ClassTable = React.forwardRef(({ classes, onEdit, onDelete, onViewDetails }, ref) => {
    const theme = useTheme();

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
                                {classItem.students ? classItem.students.length : 0}
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
                                                console.log('View class details:', classItem);
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
                                            onClick={() => onEdit(classItem)}
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
    );
});

export default ClassTable; 