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
import StudentGrid from './classDetails/StudentGrid';
import ChangeTeacher from './teacherActions/ChangeTeacher';
import SemesterCard from './classDetails/SemesterCard';
import ChangeSemester from './semesterActions/ChangeSemester';
import { AddStudent, RemoveStudent, TransferStudent } from './studentActions';

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
    const [changeTeacherOpen, setChangeTeacherOpen] = useState(false);
    const [changeSemesterOpen, setChangeSemesterOpen] = useState(false);
    const [semester, setSemester] = useState(null);
    const [semesterLoading, setSemesterLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [addStudentOpen, setAddStudentOpen] = useState(false);
    const [removeStudentOpen, setRemoveStudentOpen] = useState(false);
    const [transferStudentOpen, setTransferStudentOpen] = useState(false);
    const [selectedStudentsForTransfer, setSelectedStudentsForTransfer] = useState([]);

    useEffect(() => {
        console.log('ClassDetails - classData changed:', {
            classData,
            id: classData?.id,
            teacherID: classData?.teacherID,
            fullData: JSON.stringify(classData)
        });

        if (!classData?.id) {
            console.error('Invalid class data - missing ID:', classData);
            return;
        }

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
        if (!classData?.id) {
            console.error('Cannot fetch students - missing class ID');
            return;
        }

        setLoading(true);
        try {
            // Get fresh class data to get the latest student IDs
            const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
            const freshClassData = classResponse.data.data;
            const studentIDs = freshClassData.students || []; // Using students array that contains studentIDs

            console.log('Fresh class data:', freshClassData);
            console.log('Student IDs:', studentIDs);

            // Update the class data in state
            Object.assign(classData, freshClassData);

            if (!studentIDs || studentIDs.length === 0) {
                console.log('No students found in class');
                setStudents([]);
                return;
            }

            // Fetch each student's details from the student table
            const studentPromises = studentIDs.map(async (studentId) => {
                try {
                    // Get student details from student table using studentId
                    const response = await axios.get(`${API_URL}/student/${studentId}`);
                    const studentData = response.data.data;
                    console.log('Fetched student data:', studentData);
                    return {
                        id: studentData.id,
                        studentID: studentData.studentID,
                        firstName: studentData.firstName,
                        lastName: studentData.lastName,
                        gender: studentData.gender,
                        dateOfBirth: studentData.dateOfBirth,
                        phone: studentData.phone,
                        email: studentData.email,
                        address: studentData.address,
                        avatar: studentData.avatar
                    };
                } catch (error) {
                    console.error(`Failed to fetch student ${studentId}:`, error);
                    return null;
                }
            });

            const studentResponses = await Promise.all(studentPromises);
            const validStudents = studentResponses.filter(Boolean);

            console.log('Fetched student details:', validStudents);
            setStudents(validStudents);
        } catch (error) {
            console.error('Error in fetchStudents:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSemesterDetails = async () => {
        if (!classData?.semesterID) {
            console.log('No semesterID provided');
            setSemester(null);
            return;
        }

        setSemesterLoading(true);
        try {
            console.log('Fetching semester details for ID:', classData.semesterID);
            const response = await axios.get(`${API_URL}/semester/${classData.semesterID}`);

            if (response.data && response.data.data) {
                console.log('Fetched semester details:', response.data.data);
                setSemester(response.data.data);
            } else {
                console.error('Invalid semester response:', response.data);
                setSemester(null);
            }
        } catch (error) {
            console.error('Error fetching semester details:', error);
            setSemester(null);
        } finally {
            setSemesterLoading(false);
        }
    };

    useEffect(() => {
        if (classData?.semesterID) {
            fetchSemesterDetails();
        } else {
            setSemester(null);
        }
    }, [classData?.semesterID]);

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
        if (!classData?.id) {
            console.error('Cannot change teacher - missing class ID');
            return;
        }

        console.log('Opening teacher change dialog with:', {
            classId: classData.id,
            currentTeacherId: teacherDetails?.teacherID
        });
        setChangeTeacherOpen(true);
    };

    const handleStudentAction = (action, student = null, selectedStudents = []) => {
        if (action === 'transferStudent' && selectedStudents.length > 0) {
            // For multiple student transfer, we don't need to set selectedStudent
            setSelectedStudent(null);
            setSelectedStudentsForTransfer(selectedStudents);
        } else if (action === 'transferStudent' && student) {
            // For single student transfer
            setSelectedStudent(student);
            setSelectedStudentsForTransfer([]);
        } else {
            setSelectedStudent(student);
            setSelectedStudentsForTransfer([]);
        }

        switch (action) {
            case 'addStudent':
                setAddStudentOpen(true);
                break;
            case 'removeStudent':
                setRemoveStudentOpen(true);
                break;
            case 'transferStudent':
                setTransferStudentOpen(true);
                break;
            default:
                console.error('Unknown action:', action);
        }
    };

    const handleTeacherChange = async (newTeacher, updatedClass) => {
        if (!newTeacher) return;

        try {
            console.log('Handling teacher change:', { newTeacher, updatedClass });

            // Update teacher details
            setTeacherDetails({
                firstName: newTeacher.firstName || '',
                lastName: newTeacher.lastName || '',
                teacherID: newTeacher.teacherID || '',
                gender: newTeacher.gender || '',
                phone: newTeacher.phone || '',
                dateOfBirth: newTeacher.dateOfBirth || '',
                avatar: newTeacher.avatar || ''
            });

            // Update class data while preserving existing data
            if (updatedClass && classData) {
                Object.assign(classData, {
                    ...classData,
                    ...updatedClass,
                    students: updatedClass.students || classData.students || [], // Preserve students array
                    semesterID: updatedClass.semesterID || classData.semesterID
                });
                console.log('Updated class data:', classData);
            }

            // Fetch fresh student data
            await fetchStudents();

            // Close the dialog
            setChangeTeacherOpen(false);
        } catch (error) {
            console.error('Error in handleTeacherChange:', error);
        }
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handleReloadStudents = () => {
        fetchStudents();
    };

    const handleChangeSemester = () => {
        setChangeSemesterOpen(true);
    };

    const handleSemesterChange = async (newSemester, updatedClass) => {
        try {
            if (!newSemester || !updatedClass) {
                console.error('Invalid semester change data:', { newSemester, updatedClass });
                return;
            }

            setSemester(newSemester);
            // Update the class data with the new information
            Object.assign(classData, updatedClass);
            // Refresh the semester details
            await fetchSemesterDetails();
            // Refresh students list as it might be affected by semester change
            await fetchStudents();
        } catch (error) {
            console.error('Error in handleSemesterChange:', error);
        }
    };

    const handleStudentAdd = async (student, updatedClass) => {
        console.log('Student added:', student);
        await fetchStudents();
        setAddStudentOpen(false);
    };

    const handleStudentRemove = async (student, updatedClass) => {
        console.log('Student removed:', student);
        await fetchStudents();
        setRemoveStudentOpen(false);
        setSelectedStudent(null);
    };

    const handleStudentTransfer = async (students, targetClass, updatedClass) => {
        try {
            console.log('Students transferred:', { students, targetClass });
            await fetchStudents();
            setTransferStudentOpen(false);
            setSelectedStudent(null);
            setSelectedStudentsForTransfer([]);
        } catch (error) {
            console.error('Error in handleStudentTransfer:', error);
        }
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
                    {/* Teacher, Student Management, and Semester Cards */}
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
                                    selectedStudentCount={selectedStudentsForTransfer.length}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <SemesterCard
                                    semester={semester}
                                    loading={semesterLoading}
                                    onViewChange={handleViewChange}
                                    onReload={handleReloadStudents}
                                    onChangeSemester={handleChangeSemester}
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
                            {viewMode === 'list' ? (
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
                                    onAction={handleStudentAction}
                                />
                            ) : (
                                <StudentGrid
                                    students={students}
                                    loading={loading}
                                    onViewStudent={(student) => handleActionClick('viewStudent', student)}
                                    onEditStudent={onEditStudent}
                                    onDeleteStudent={(student) => handleActionClick('deleteStudent', student)}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <ChangeTeacher
                open={changeTeacherOpen}
                onClose={() => setChangeTeacherOpen(false)}
                currentTeacherId={teacherDetails?.teacherID}
                classId={classData?.id}
                onTeacherChange={handleTeacherChange}
            />

            <ChangeSemester
                open={changeSemesterOpen}
                onClose={() => setChangeSemesterOpen(false)}
                currentSemesterId={semester?.id}
                classId={classData?.id}
                onSemesterChange={handleSemesterChange}
            />

            {/* Student Action Dialogs */}
            <AddStudent
                open={addStudentOpen}
                onClose={() => setAddStudentOpen(false)}
                classId={classData?.id}
                currentStudentIds={students.map(s => s.studentID)}
                onStudentAdd={handleStudentAdd}
            />

            <RemoveStudent
                open={removeStudentOpen}
                onClose={() => setRemoveStudentOpen(false)}
                classId={classData?.id}
                student={selectedStudent}
                students={students}
                onStudentRemove={handleStudentRemove}
                mode={selectedStudent ? 'single' : 'multiple'}
            />

            <TransferStudent
                open={transferStudentOpen}
                onClose={() => {
                    setTransferStudentOpen(false);
                    setSelectedStudent(null);
                    setSelectedStudentsForTransfer([]);
                }}
                currentClassId={classData?.id}
                student={selectedStudent}
                students={selectedStudentsForTransfer.length > 0 ? selectedStudentsForTransfer : (selectedStudent ? [selectedStudent] : [])}
                onStudentTransfer={handleStudentTransfer}
                mode={selectedStudentsForTransfer.length > 0 ? 'multiple' : 'single'}
            />
        </Box>
    );
};

export default ClassDetails; 