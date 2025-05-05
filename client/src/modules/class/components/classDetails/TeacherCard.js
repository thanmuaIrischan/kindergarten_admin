import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    useTheme,
    Button,
    CircularProgress,
    Stack,
    Tooltip,
    IconButton,
    Collapse,
    Divider,
} from '@mui/material';
import {
    SwapHorizontalCircle as SwapTeacherIcon,
    AssignmentInd as AssignmentIndIcon,
    Person as PersonIcon,
    Call as CallIcon,
    Wc as WcIcon,
    CalendarToday as CalendarIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

const TeacherCard = ({ teacherDetails, teacherLoading, onTeacherAction }) => {
    const theme = useTheme();
    const [showDetails, setShowDetails] = useState(false);

    const TeacherActionButton = ({ hasTeacher, isCompact = true }) => (
        <Button
            variant="outlined"
            size={isCompact ? "small" : "medium"}
            startIcon={hasTeacher ? <SwapTeacherIcon /> : <AssignmentIndIcon />}
            onClick={onTeacherAction}
            sx={{
                height: isCompact ? '32px' : '40px',
                color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderColor: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderWidth: isCompact ? '1px' : '1.5px',
                borderRadius: isCompact ? 1.5 : 2,
                textTransform: 'none',
                fontSize: isCompact ? '0.8rem' : '0.9rem',
                fontWeight: 500,
                ml: isCompact ? 1 : 0,
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)',
                },
            }}
        >
            {hasTeacher ? (isCompact ? 'Change' : 'Change Teacher') : (isCompact ? 'Assign' : 'Assign Teacher')}
        </Button>
    );

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {icon}
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                {label}:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
                {value || 'Not provided'}
            </Typography>
        </Box>
    );

    const CompactView = () => (
        <Stack direction="row" alignItems="center" spacing={1}>
            {teacherLoading ? (
                <CircularProgress size={24} />
            ) : teacherDetails ? (
                <>
                    <Tooltip title={`${teacherDetails.firstName} ${teacherDetails.lastName}`}>
                        <Avatar
                            src={teacherDetails.avatar}
                            sx={{ width: 32, height: 32 }}
                        >
                            {`${teacherDetails.firstName[0]}${teacherDetails.lastName[0]}`}
                        </Avatar>
                    </Tooltip>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                            {`${teacherDetails.firstName} ${teacherDetails.lastName}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            ID: {teacherDetails.teacherID}
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.500' }}>
                        <PersonIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            No Teacher
                        </Typography>
                    </Box>
                </>
            )}
            <TeacherActionButton hasTeacher={!!teacherDetails} isCompact={true} />
        </Stack>
    );

    const DetailedView = () => (
        <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            {teacherDetails && (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={teacherDetails.avatar}
                            sx={{ width: 64, height: 64, mr: 2 }}
                        >
                            {`${teacherDetails.firstName[0]}${teacherDetails.lastName[0]}`}
                        </Avatar>
                        <Box>
                            <Typography variant="h6">
                                {`${teacherDetails.firstName} ${teacherDetails.lastName}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {teacherDetails.teacherID}
                            </Typography>
                        </Box>
                    </Box>
                    <InfoItem
                        icon={<PersonIcon fontSize="small" />}
                        label="Full Name"
                        value={`${teacherDetails.firstName} ${teacherDetails.lastName}`}
                    />
                    <InfoItem
                        icon={<CallIcon fontSize="small" />}
                        label="Phone"
                        value={teacherDetails.phone}
                    />
                    <InfoItem
                        icon={<WcIcon fontSize="small" />}
                        label="Gender"
                        value={teacherDetails.gender}
                    />
                    <InfoItem
                        icon={<CalendarIcon fontSize="small" />}
                        label="Date of Birth"
                        value={teacherDetails.dateOfBirth}
                    />
                    <Box sx={{ mt: 2 }}>
                        <TeacherActionButton hasTeacher={!!teacherDetails} isCompact={false} />
                    </Box>
                </>
            )}
        </Box>
    );

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 2,
            }}
        >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CompactView />
                    <Tooltip title={showDetails ? "Show less" : "View details"}>
                        <IconButton
                            size="small"
                            onClick={() => setShowDetails(!showDetails)}
                            sx={{ ml: 1 }}
                        >
                            {showDetails ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
                <Collapse in={showDetails}>
                    <DetailedView />
                </Collapse>
            </CardContent>
        </Card>
    );
};

export default TeacherCard; 