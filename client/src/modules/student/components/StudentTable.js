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
    Stack,
    TablePagination,
    useTheme,
} from '@mui/material';
import {
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';

const StudentTable = ({
    students,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onViewDetails,
}) => {
    const theme = useTheme();

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
                '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                }
            }}
        >
            <Table sx={{
                width: '100%',
                tableLayout: 'fixed',
                '& .MuiTableCell-root': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    px: 1.5,
                    '&:nth-of-type(1)': { width: '60px' },  // No. column
                    '&:nth-of-type(2)': { width: '120px' }, // Student ID column
                    '&:nth-of-type(3)': { width: '200px' }, // Name column
                    '&:nth-of-type(4)': { width: '180px' }, // School column
                    '&:nth-of-type(5)': { width: '180px' }, // Parent Name column
                    '&:nth-of-type(6)': { width: '100px' }, // Actions column
                }
            }}>
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
                                width: '60px'
                            }}
                        >
                            No.
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db'
                            }}
                        >
                            Student ID
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db'
                            }}
                        >
                            Name
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db'
                            }}
                        >
                            School
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db'
                            }}
                        >
                            Parent Name
                        </TableCell>
                        <TableCell
                            sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#111827' : '#2c3e50',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                borderBottom: theme.palette.mode === 'dark'
                                    ? '2px solid #1f2937'
                                    : '2px solid #3498db'
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {students.length > 0 ? (
                        students
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student, index) => (
                                <TableRow
                                    key={student.id}
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
                                        {page * rowsPerPage + index + 1}
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
                                        {student.studentID}
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
                                        {student.lastName} {student.firstName}
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
                                        {student.school}
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
                                        {student.parentName}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderBottom: theme.palette.mode === 'dark'
                                                ? '1px solid #1f2937'
                                                : '1px solid #e0e0e0'
                                        }}
                                    >
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(student.id)}
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
                                            <IconButton
                                                size="small"
                                                onClick={() => onViewDetails(student.id)}
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
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No students found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                sx={{
                    color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                    '.MuiTablePagination-select': {
                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                    },
                    '.MuiTablePagination-selectIcon': {
                        color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
                    }
                }}
            />
        </TableContainer>
    );
};

export default StudentTable; 