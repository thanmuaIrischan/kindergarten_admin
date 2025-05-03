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
    Call as CallIcon,
    Wc as WcIcon,
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
    const [teacherLoading, setTeacherLoading] = useState(false);

    useEffect(() => {
        console.log('ClassData changed:', classData);
        fetchStudents();
        if (classData?.teacherID) {
            console.log('Initiating teacher fetch for ID:', classData.teacherID);
            fetchTeacherDetails();
        } else {
            setTeacherDetails(null);
        }
    }, [classData]);

    const fetchTeacherDetails = async () => {
        try {
            if (!classData?.teacherID) {
                console.log('No teacherID provided');
                return;
            }

            setTeacherLoading(true);
            const teacherId = classData.teacherID.trim();
            console.log('Fetching teacher details for ID:', teacherId);

            // Get teacher by teacherID using the correct endpoint
            const response = await axios.get(`${API_URL}/teacher/by-teacher-id/${teacherId}`);
            console.log('Full API Response:', response);

            if (response.data) {
                console.log('Response data:', response.data);
                const teacher = response.data;  // The data is directly in response.data
                console.log('Found teacher:', teacher);

                if (teacher) {
                    setTeacherDetails({
                        firstName: teacher.firstName || '',
                        lastName: teacher.lastName || '',
                        teacherID: teacher.teacherID || '',
                        gender: teacher.gender || '',
                        phone: teacher.phone || '',
                        dateOfBirth: teacher.dateOfBirth || '',
                        avatar: teacher.avatar || ''
                    });
                } else {
                    console.error('No teacher data in response');
                    setTeacherDetails(null);
                }
            } else {
                console.error('Invalid response format:', response);
                setTeacherDetails(null);
            }
        } catch (error) {
            console.error('Error fetching teacher details:', {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                teacherID: classData.teacherID,
                error: error
            });
            setTeacherDetails(null);
        } finally {
            setTeacherLoading(false);
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

    const InfoCard = ({ icon, label, value, subtitle, sx = {} }) => {
        const IconComponent = React.cloneElement(icon, {
            sx: {
                fontSize: '1.75rem',  // Reduced from 2rem
                ...icon.props.sx
            }
        });

        return (
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    minHeight: '140px',  // Reduced from 180px
                    width: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 4px 8px rgba(0, 0, 0, 0.4)'
                            : '0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                    ...sx
                }}
            >
                <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2.5  // Reduced from 4
                }}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>  {/* Reduced spacing and margin */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1.5,  // Reduced from 2
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.03)',
                            minWidth: '40px',  // Reduced from 48px
                            minHeight: '40px'   // Reduced from 48px
                        }}>
                            {IconComponent}
                        </Box>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '0.8rem'  // Reduced from 0.875rem
                            }}
                        >
                            {label}
                        </Typography>
                    </Stack>
                    <Box>
                        <Typography variant="h6" sx={{
                            mb: subtitle ? 0.5 : 0,  // Reduced from 1
                            fontSize: '1.1rem',  // Reduced from 1.25rem
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? '#fff' : '#2c3e50'
                        }}>
                            {value || 'N/A'}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.7)'
                                        : 'rgba(0, 0, 0, 0.6)',
                                    fontWeight: 500,
                                    fontSize: '0.75rem'  // Added smaller font size
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box className="class-details-container" sx={{ width: '100%', maxWidth: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },  // Reduced padding
                    backgroundColor: theme.palette.background.paper,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <Box
                    display="flex"
                    alignItems="center"
                    mb={3}  // Reduced from 4
                    sx={{
                        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        pb: 2
                    }}
                >
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
                <Grid
                    container
                    spacing={3}  // Reduced from 4
                    sx={{
                        mb: 3,  // Reduced from 4
                        width: '100%',
                        mx: 'auto',
                        px: { xs: 0, sm: 0.5, md: 1 },  // Reduced padding
                        '& .MuiGrid-item': {
                            display: 'flex'
                        }
                    }}
                >
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<ClassIcon sx={{ color: theme.palette.primary.main }} />}
                            label="Class Name"
                            value={classData.className}
                            sx={{ flex: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<PersonIcon sx={{ color: theme.palette.secondary.main }} />}
                            label="Teacher"
                            value={teacherLoading
                                ? 'Loading...'
                                : teacherDetails
                                    ? `${teacherDetails.lastName} ${teacherDetails.firstName}`
                                    : 'Not Found'}
                            subtitle={classData?.teacherID ? `ID: ${classData.teacherID}` : 'No teacher assigned'}
                            sx={{ flex: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<CalendarIcon sx={{ color: theme.palette.success.main }} />}
                            label="Semester"
                            value={classData.semesterName}
                            sx={{ flex: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<GroupIcon sx={{ color: theme.palette.info.main }} />}
                            label="Total Students"
                            value={students.length}
                            subtitle="Enrolled Students"
                            sx={{ flex: 1 }}
                        />
                    </Grid>
                </Grid>

                {!teacherLoading && teacherDetails && (
                    <>
                        <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                                mb: 2,
                                mt: 3,  // Reduced from 4
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '1.1rem',  // Reduced from default
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    width: 3,  // Reduced from 4
                                    height: 20,  // Reduced from 24
                                    backgroundColor: theme.palette.primary.main,
                                    marginRight: 1.5,  // Reduced from 2
                                    borderRadius: 1
                                }
                            }}
                        >
                            Teacher Information
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.palette.mode === 'dark'
                                                ? '0 4px 8px rgba(0, 0, 0, 0.4)'
                                                : '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <Avatar
                                                src={teacherDetails.avatar}
                                                sx={{
                                                    width: 90,
                                                    height: 90,
                                                    bgcolor: theme.palette.secondary.main,
                                                    fontSize: '2rem'
                                                }}
                                            >
                                                {`${teacherDetails.lastName[0]}${teacherDetails.firstName[0]}`}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? '#fff' : '#2c3e50' }}>
                                                    {`${teacherDetails.lastName} ${teacherDetails.firstName}`}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                                                    Teacher ID: {teacherDetails.teacherID}
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                                                    <CallIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                                                    Phone: {teacherDetails.phone || 'Not provided'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                                                    <WcIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                                                    Gender: {teacherDetails.gender || 'Not specified'}
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
                                                    <TableCell>{` ${student.lastName} ${student.firstName}`}</TableCell>
                                                    <TableCell>{student.gender}</TableCell>
                                                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                                                    <TableCell>{student.parentName}</TableCell>
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