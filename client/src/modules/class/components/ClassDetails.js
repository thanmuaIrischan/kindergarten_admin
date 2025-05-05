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
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Assessment as AssessmentIcon,
    Message as MessageIcon,
    EventNote as EventNoteIcon,
    PostAdd as PostAddIcon,
    ImportContacts as ImportContactsIcon,
    VideoCall as VideoCallIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    PersonAdd as PersonAddIcon,
    PersonRemove as PersonRemoveIcon,
    SwapHoriz as SwapHorizIcon,
    ManageAccounts as ManageAccountsIcon,
    AssignmentInd as AssignmentIndIcon,
    SwapHorizontalCircle as SwapTeacherIcon,
} from '@mui/icons-material';
import axios from 'axios';

import TeacherCard from './classDetails/TeacherCard';
import StudentManagement from './classDetails/StudentManagement';
import ActionButtons from './classDetails/ActionButtons';
import StudentTable from './classDetails/StudentTable';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ClassDetails = ({ classData, onBack, onEditStudent }) => {
    const theme = useTheme();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [teacherDetails, setTeacherDetails] = useState(null);
    const [teacherLoading, setTeacherLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [showActions, setShowActions] = useState(true);

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

            const response = await axios.get(`${API_URL}/teacher/by-teacher-id/${teacherId}`);
            console.log('Full API Response:', response);

            if (response.data) {
                console.log('Response data:', response.data);
                const teacher = response.data;
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
            const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
            const classStudents = classResponse.data.data.students || [];

            const studentPromises = classStudents.map(studentId =>
                axios.get(`${API_URL}/student/${studentId}`)
            );

            const studentResponses = await Promise.all(studentPromises);
            const studentDetails = studentResponses.map(response => response.data.data);

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

    const handleActionClick = (action) => {
        setDialogType(action);
        setOpenDialog(true);
    };

    const handleTeacherAction = () => {
        handleActionClick(teacherDetails ? 'changeTeacher' : 'assignTeacher');
    };

    const handleStudentAction = (action) => {
        handleActionClick(action);
    };

    const TeacherActionButton = ({ hasTeacher }) => (
        <Button
            variant="outlined"
            startIcon={hasTeacher ? <SwapTeacherIcon /> : <AssignmentIndIcon />}
            onClick={handleTeacherAction}
            sx={{
                mt: 2,
                width: '100%',
                height: '48px',
                color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderColor: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderWidth: '1.5px',
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease'
            }}
        >
            {hasTeacher ? 'Change Teacher' : 'Assign Teacher'}
        </Button>
    );

    const InfoCard = ({ icon, label, value, subtitle, sx = {} }) => {
        const IconComponent = React.cloneElement(icon, {
            sx: {
                fontSize: '1.75rem',
                ...icon.props.sx
            }
        });

        return (
            <Card
                elevation={0}
                sx={{
                    height: '140px',  // Fixed height for all cards
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
                    p: 2.5,
                    '&:last-child': { pb: 2.5 } // Ensure consistent padding
                }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 'auto' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.03)',
                            width: '44px',  // Fixed width for icon container
                            height: '44px',  // Fixed height for icon container
                            flexShrink: 0    // Prevent icon container from shrinking
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
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap'  // Prevent label from wrapping
                            }}
                        >
                            {label}
                        </Typography>
                    </Stack>
                    <Box sx={{ mt: 'auto' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: subtitle ? 0.5 : 0,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: theme.palette.mode === 'dark' ? '#fff' : '#2c3e50',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'  // Prevent value from wrapping
                            }}
                        >
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
                                    fontSize: '0.75rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'  // Prevent subtitle from wrapping
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

    const ActionButton = ({ icon, label, color, onClick }) => (
        <Button
            variant="contained"
            startIcon={icon}
            onClick={onClick}
            sx={{
                width: '100%',
                height: '56px', // Fixed height for all buttons
                backgroundColor: theme.palette.mode === 'dark'
                    ? `${color}.dark`
                    : theme.palette[color].main,
                color: '#fff',
                p: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1.5,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)',
                '& .MuiButton-startIcon': {
                    position: 'relative',
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    marginRight: 1.5,
                    transition: 'all 0.3s ease',
                    minWidth: '32px', // Fixed width for icon container
                    height: '32px', // Fixed height for icon container
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette[color].main
                        : theme.palette[color].dark,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                        : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    '& .MuiButton-startIcon': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'scale(1.1)',
                    }
                },
                '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 2px 4px rgba(0, 0, 0, 0.4)'
                        : '0 2px 4px rgba(0, 0, 0, 0.2)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {label}
        </Button>
    );

    const StudentActionButton = ({ icon, label, onClick, color = 'primary' }) => (
        <Button
            variant="outlined"
            startIcon={icon}
            onClick={onClick}
            sx={{
                width: '100%',
                height: '48px',
                color: theme.palette.mode === 'dark'
                    ? theme.palette[color].light
                    : theme.palette[color].main,
                borderColor: theme.palette.mode === 'dark'
                    ? theme.palette[color].light
                    : theme.palette[color].main,
                borderWidth: '1.5px',
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1.5,
                mb: 1.5,
                '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                        ? `${theme.palette[color].main}22`
                        : `${theme.palette[color].main}11`,
                    borderColor: theme.palette[color].main,
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease'
            }}
        >
            {label}
        </Button>
    );

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

                {/* Main Content */}
                <Grid container spacing={3}>
                    {/* Teacher and Student Management Cards */}
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TeacherCard
                                    teacherDetails={teacherDetails}
                                    teacherLoading={teacherLoading}
                                    onTeacherAction={handleTeacherAction}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <StudentManagement
                                    studentCount={students.length}
                                    onAction={handleStudentAction}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Action Buttons and Student Table */}
                    <Grid item xs={12} md={8}>
                        <ActionButtons
                            showActions={showActions}
                            onToggleActions={() => setShowActions(!showActions)}
                            onActionClick={handleActionClick}
                        />
                        <Box sx={{ mt: 3 }}>
                            <StudentTable
                                students={students}
                                loading={loading}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                onViewStudent={(student) => handleActionClick('viewStudent', student)}
                                onEditStudent={onEditStudent}
                                onDeleteStudent={(student) => handleActionClick('deleteStudent', student)}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default ClassDetails; 