import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Stack,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Divider,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Class as ClassIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ClassDetails = ({ classData, onBack, onEditStudent }) => {
    const theme = useTheme();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [teacherDetails, setTeacherDetails] = useState(null);

    useEffect(() => {
        fetchStudents();
        if (classData?.teacherID) {
            fetchTeacherDetails();
        }
    }, [classData]);

    const fetchTeacherDetails = async () => {
        try {
            // Query the teachers table to find the teacher with matching teacherID
            const response = await axios.get(`${API_URL}/teacher`, {
                params: {
                    teacherID: classData.teacherID
                }
            });

            // Find the teacher with matching teacherID from the response
            const teacher = response.data.data.find(t => t.teacherID === classData.teacherID);
            if (teacher) {
                setTeacherDetails(teacher);
            } else {
                console.error('Teacher not found with ID:', classData.teacherID);
            }
        } catch (error) {
            console.error('Error fetching teacher details:', error);
        }
    };

    const fetchStudents = async () => {
        if (!classData?.id) return;

        setLoading(true);
        try {
            // First get the students array from the class
            const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
            const classStudents = classResponse.data.data.students || [];

            // Then fetch full student details for each student ID
            const studentPromises = classStudents.map(studentId =>
                axios.get(`${API_URL}/student/${studentId}`)
            );

            const studentResponses = await Promise.all(studentPromises);
            const studentDetails = studentResponses.map(response => response.data.data);

            // Sort students by name
            const sortedStudents = studentDetails.sort((a, b) =>
                `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
            );

            setStudents(sortedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const InfoCard = ({ icon, label, value, subtitle }) => (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    {icon}
                    <Typography variant="subtitle2" color="textSecondary">
                        {label}
                    </Typography>
                </Stack>
                <Typography variant="h6" sx={{ mb: subtitle ? 1 : 0 }}>
                    {value || 'N/A'}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="textSecondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box className="class-details-container" sx={{ width: '100%', maxWidth: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Header */}
                <Box display="flex" alignItems="center" mb={4}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{
                            mr: 2,
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(44, 62, 80, 0.08)',
                            }
                        }}
                    >
                        Back to List
                    </Button>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                        Class Details
                    </Typography>
                </Box>

                {/* Class Information */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6} lg={3}>
                        <InfoCard
                            icon={<ClassIcon sx={{ color: theme.palette.primary.main }} />}
                            label="Class Name"
                            value={classData.className}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <InfoCard
                            icon={<PersonIcon sx={{ color: theme.palette.secondary.main }} />}
                            label="Teacher"
                            value={teacherDetails ? `${teacherDetails.firstName} ${teacherDetails.lastName}` : 'Loading...'}
                            subtitle={`ID: ${classData.teacherID}`}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <InfoCard
                            icon={<CalendarIcon sx={{ color: theme.palette.success.main }} />}
                            label="Semester"
                            value={classData.semesterName}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <InfoCard
                            icon={<GroupIcon sx={{ color: theme.palette.info.main }} />}
                            label="Total Students"
                            value={students.length}
                            subtitle="Enrolled Students"
                        />
                    </Grid>
                </Grid>

                {teacherDetails && (
                    <>
                        <Typography variant="h6" color="primary" sx={{ mb: 2, mt: 4 }}>
                            Teacher Information
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    bgcolor: theme.palette.secondary.main,
                                                }}
                                            >
                                                {`${teacherDetails.firstName[0]}${teacherDetails.lastName[0]}`}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6">
                                                    {`${teacherDetails.firstName} ${teacherDetails.lastName}`}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                    {teacherDetails.teacherID}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {teacherDetails.email}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {teacherDetails.phone}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}

                <Divider sx={{ my: 4 }} />

                {/* Students List */}
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    Students in this Class
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Student ID</TableCell>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Name</TableCell>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Gender</TableCell>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Date of Birth</TableCell>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Parent Name</TableCell>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Contact</TableCell>
                                        <TableCell sx={{
                                            backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#f8fafc',
                                            fontWeight: 'bold'
                                        }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.length > 0 ? (
                                        students
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>{student.studentID}</TableCell>
                                                    <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                                                    <TableCell>{student.gender}</TableCell>
                                                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                                                    <TableCell>{student.parentName}</TableCell>
                                                    <TableCell>{student.phone}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="View Details">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => onEditStudent(student.id)}
                                                                    sx={{
                                                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                                                        '&:hover': {
                                                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <VisibilityIcon sx={{ fontSize: '1.2rem' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => onEditStudent(student.id)}
                                                                    sx={{
                                                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(41, 128, 185, 0.1)',
                                                                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                                                                        '&:hover': {
                                                                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.3)' : 'rgba(41, 128, 185, 0.2)',
                                                                        }
                                                                    }}
                                                                >
                                                                    <EditIcon sx={{ fontSize: '1.2rem' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No students in this class
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component="div"
                            count={students.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                            sx={{
                                '.MuiTablePagination-select': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                                }
                            }}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default ClassDetails; 