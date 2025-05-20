import React, { useState, useEffect } from 'react';
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
import { getStudentDisplayName } from '../../services/StudentDisplayService';

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

    useEffect(() => {
        console.log('StudentTable - Received students:', students);
    }, [students]);

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

    // Calculate the current page's students
    const currentPageStudents = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    console.log('Current page students:', currentPageStudents);

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                border: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 2,
                backgroundColor: theme => theme.palette.mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.02)',
            }}
        >
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
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
                        ) : !Array.isArray(students) || students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="text.secondary">
                                        No students found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPageStudents.map((student) => {
                                if (!student || !student.studentID) {
                                    console.error('Invalid student data:', student);
                                    return null;
                                }

                                const isSelected = selectedStudents.some(s => s.studentID === student.studentID);
                                console.log('Rendering student row:', student);

                                return (
                                    <TableRow
                                        hover
                                        key={student.studentID}
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
                                        <TableCell>{getStudentDisplayName(student)}</TableCell>
                                        <TableCell>{student.gender}</TableCell>
                                        <TableCell>{student.dateOfBirth}</TableCell>
                                        <TableCell align="center">
                                            <ActionButtons student={student} />
                                        </TableCell>
                                    </TableRow>
                                );
                            }).filter(Boolean)
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