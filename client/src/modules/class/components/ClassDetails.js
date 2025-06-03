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
import { printStudentList } from '../utils/printUtils';
import { fetchStudents, addStudentToClass, removeStudentFromClass, transferStudentsToClass } from '../utils/studentUtils';
import { fetchTeacherDetails, updateTeacher } from '../utils/teacherUtils';
import { fetchSemesterDetails, updateSemester } from '../utils/semesterUtils';

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
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        console.log('ClassDetails - classData changed:', {
            classData,
            id: classData?.id,
            teacherID: classData?.teacherID,
            students: classData?.students,
            fullData: JSON.stringify(classData)
        });

        if (!classData?.id) {
            console.error('Invalid class data - missing ID:', classData);
            return;
        }

        // Update student count based on class data
        setStudentCount(classData.students?.length || 0);
        loadStudents();
        
        if (classData?.teacherID) {
            console.log('Initiating teacher fetch for ID:', classData.teacherID);
            loadTeacherDetails();
        } else {
            setTeacherDetails(null);
        }
    }, [classData]);

    const loadStudents = async () => {
        console.log('Loading students for class:', classData.id);
        setLoading(true);
        try {
            const fetchedStudents = await fetchStudents(classData.id);
            console.log('Loaded students:', fetchedStudents);
            
            // Update student count based on actual fetched students
            setStudentCount(fetchedStudents.length);
            setStudents(fetchedStudents);

            // If the class data shows more students than we could fetch, there might be inconsistency
            if (classData.students?.length > fetchedStudents.length) {
                console.warn('Some students in class list could not be found:', {
                    classStudentCount: classData.students.length,
                    fetchedStudentCount: fetchedStudents.length
                });
                
                // Optional: Update class data to remove non-existent students
                try {
                    const updatedStudents = fetchedStudents.map(s => s.studentID);
                    await axios.put(`${API_URL}/class/${classData.id}`, {
                        ...classData,
                        students: updatedStudents
                    });
                    console.log('Updated class with correct student list');
                } catch (updateError) {
                    console.error('Failed to update class with correct student list:', updateError);
                }
            }
        } catch (error) {
            console.error('Error loading students:', error);
            setStudents([]);
            setStudentCount(0);
        } finally {
            setLoading(false);
        }
    };

    const loadTeacherDetails = async () => {
        setTeacherLoading(true);
        const teacher = await fetchTeacherDetails(classData.teacherID);
        setTeacherDetails(teacher);
        setTeacherLoading(false);
    };

    const loadSemesterDetails = async () => {
        if (!classData?.semesterID) {
            setSemester(null);
            return;
        }

        setSemesterLoading(true);
        const semesterData = await fetchSemesterDetails(classData.semesterID);
        setSemester(semesterData);
        setSemesterLoading(false);
    };

    useEffect(() => {
        if (classData?.semesterID) {
            loadSemesterDetails();
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
            setSelectedStudent(null);
            setSelectedStudentsForTransfer(selectedStudents);
        } else if (action === 'transferStudent' && student) {
            setSelectedStudent(student);
            setSelectedStudentsForTransfer([]);
        } else if (action === 'printStudents') {
            printStudentList(classData, students, teacherDetails, semester);
            return;
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
        await updateTeacher(newTeacher, updatedClass, classData, async () => {
            setTeacherDetails({
                firstName: newTeacher.firstName || '',
                lastName: newTeacher.lastName || '',
                teacherID: newTeacher.teacherID || '',
                gender: newTeacher.gender || '',
                phone: newTeacher.phone || '',
                dateOfBirth: newTeacher.dateOfBirth || '',
                avatar: newTeacher.avatar || ''
            });
            await loadStudents();
            setChangeTeacherOpen(false);
        });
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handleReloadStudents = () => {
        loadStudents();
    };

    const handleChangeSemester = () => {
        setChangeSemesterOpen(true);
    };

    const handleSemesterChange = async (newSemester, updatedClass) => {
        await updateSemester(newSemester, updatedClass, classData, async () => {
            setSemester(newSemester);
            await loadSemesterDetails();
            await loadStudents();
        });
    };

    const handleStudentAdd = async (student, updatedClass) => {
        try {
            await addStudentToClass(student, classData.id, async () => {
                console.log('Student added successfully, reloading students...');
                // Get fresh class data to update student count
                const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
                const freshClassData = classResponse.data.data;
                setStudentCount(freshClassData.students?.length || 0);
                await loadStudents();
                setAddStudentOpen(false);
            });
        } catch (error) {
            console.error('Error adding student:', error);
            setAddStudentOpen(true);
        }
    };

    const handleStudentRemove = async (student, updatedClass) => {
        try {
            await removeStudentFromClass(student, classData.id, async () => {
                console.log('Student removed successfully, reloading students...');
                // Get fresh class data to update student count
                const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
                const freshClassData = classResponse.data.data;
                setStudentCount(freshClassData.students?.length || 0);
                await loadStudents();
                setRemoveStudentOpen(false);
                setSelectedStudent(null);
            });
        } catch (error) {
            console.error('Error removing student:', error);
            setRemoveStudentOpen(true);
        }
    };

    const handleStudentTransfer = async (students, targetClass, updatedClass) => {
        try {
            await transferStudentsToClass(students, targetClass, classData.id, async () => {
                console.log('Students transferred successfully, reloading students...');
                // Get fresh class data to update student count
                const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
                const freshClassData = classResponse.data.data;
                setStudentCount(freshClassData.students?.length || 0);
                await loadStudents();
                setTransferStudentOpen(false);
                setSelectedStudent(null);
                setSelectedStudentsForTransfer([]);
            });
        } catch (error) {
            console.error('Error transferring students:', error);
            setTransferStudentOpen(true);
        }
    };

    // Add useEffect to update student count whenever classData changes
    useEffect(() => {
        if (classData?.id) {
            const updateStudentCount = async () => {
                try {
                    const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
                    const freshClassData = classResponse.data.data;
                    setStudentCount(freshClassData.students?.length || 0);
                } catch (error) {
                    console.error('Error updating student count:', error);
                }
            };
            updateStudentCount();
        }
    }, [classData]);

    // Add function to refresh student count
    const refreshStudentCount = async () => {
        if (classData?.id) {
            try {
                const classResponse = await axios.get(`${API_URL}/class/${classData.id}`);
                const freshClassData = classResponse.data.data;
                setStudentCount(freshClassData.students?.length || 0);
            } catch (error) {
                console.error('Error refreshing student count:', error);
            }
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
                                    studentCount={studentCount}
                                    onAction={handleStudentAction}
                                    selectedStudents={selectedStudentsForTransfer}
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
                        {/* <ActionButtons
                            showActions={showActions}
                            onToggleActions={() => setShowActions(!showActions)}
                            onActionClick={handleActionClick}
                        /> */}
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
                                    onAction={handleStudentAction}
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