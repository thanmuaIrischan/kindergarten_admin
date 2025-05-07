import React, { useState } from 'react';
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
    Tooltip,
    Box,
    Typography,
    CircularProgress,
    Stack,
    Checkbox,
    Button,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';

const StudentTable = ({
    students,
    loading,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    onViewStudent,
    onEditStudent,
    onDeleteStudent,
    onAction,
}) => {
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelectedStudents(students);
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudents(prev => {
            const isSelected = prev.some(s => s.studentID === student.studentID);
            if (isSelected) {
                return prev.filter(s => s.studentID !== student.studentID);
            } else {
                return [...prev, student];
            }
        });
    };

    const ActionButtons = ({ student }) => (
        <Stack direction="row" spacing={1}>
            <Tooltip title="Edit Student">
                <IconButton
                    size="small"
                    onClick={() => onEditStudent(student)}
                    sx={{
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.lighter' }
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Transfer Student">
                <IconButton
                    size="small"
                    onClick={() => onAction('transferStudent', student)}
                    sx={{
                        color: 'info.main',
                        '&:hover': { backgroundColor: 'info.lighter' }
                    }}
                >
                    <SwapHorizIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Remove Student">
                <IconButton
                    size="small"
                    onClick={() => onAction('removeStudent', student)}
                    sx={{
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'error.lighter' }
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 2,
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.02)',
                '& .MuiTable-root': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                },
                '& .MuiTable-root.MuiTable-stickyHeader': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                },
                '& .MuiTableCell-root': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'inherit',
                    borderBottom: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(224, 224, 224, 1)'}`,
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'inherit',
                    fontWeight: 600,
                },
                '& .MuiTableRow-root:hover': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                },
                '& .MuiTableRow-root.Mui-selected': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.08)',
                },
                '& .MuiTablePagination-root': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'inherit',
                    borderTop: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(224, 224, 224, 1)'}`,
                },
                '& .MuiTablePagination-select': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'inherit',
                },
                '& .MuiTablePagination-selectIcon': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.54)' : 'inherit',
                },
                '& .MuiIconButton-root': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.54)' : 'inherit',
                    '&:hover': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    },
                },
                '& .MuiCheckbox-root': {
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.54)' : 'inherit',
                },
                '& .MuiTooltip-tooltip': {
                    backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(97, 97, 97, 0.92)',
                    color: theme => theme.palette.mode === 'dark' ? '#fff' : '#fff',
                },
            }}
        >
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader sx={{
                    '&.MuiTable-root': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    },
                    '&.MuiTable-stickyHeader': {
                        backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                    }
                }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                                    checked={students.length > 0 && selectedStudents.length === students.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell>Student ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="text.secondary">
                                        No students found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            students
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((student) => {
                                    const isSelected = selectedStudents.some(s => s.studentID === student.studentID);
                                    return (
                                    <TableRow
                                        hover
                                        key={student.id}
                                            selected={isSelected}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isSelected}
                                                    onChange={() => handleSelectStudent(student)}
                                                />
                                            </TableCell>
                                        <TableCell>{student.studentID}</TableCell>
                                        <TableCell>{` ${student.lastName} ${student.firstName} `}</TableCell>
                                        <TableCell>{student.gender}</TableCell>
                                        <TableCell>{student.dateOfBirth}</TableCell>
                                        <TableCell align="center">
                                                <ActionButtons student={student} />
                                        </TableCell>
                                    </TableRow>
                                    );
                                })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                {selectedStudents.length > 0 && (
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<SwapHorizIcon />}
                        onClick={() => onAction('transferStudent', null, selectedStudents)}
                    >
                        Transfer Selected ({selectedStudents.length})
                    </Button>
                )}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />
            </Box>
        </Paper>
    );
};

export default StudentTable; 