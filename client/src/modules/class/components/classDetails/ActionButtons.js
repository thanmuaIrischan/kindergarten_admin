import React from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    useTheme,
    IconButton,
} from '@mui/material';
import {
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
} from '@mui/icons-material';

const ActionButtons = ({ showActions, onToggleActions, onActionClick }) => {
    const theme = useTheme();

    const ActionButton = ({ icon, label, onClick }) => (
        <Button
            variant="outlined"
            startIcon={icon}
            onClick={onClick}
            sx={{
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
            {label}
        </Button>
    );

    const actions = [
        { icon: <AssignmentIcon />, label: 'Assignments', action: 'assignments' },
        { icon: <ScheduleIcon />, label: 'Schedule', action: 'schedule' },
        { icon: <AssessmentIcon />, label: 'Assessments', action: 'assessments' },
        { icon: <MessageIcon />, label: 'Messages', action: 'messages' },
        { icon: <EventNoteIcon />, label: 'Attendance', action: 'attendance' },
        { icon: <ImportContactsIcon />, label: 'Learning Materials', action: 'materials' },
        { icon: <PostAddIcon />, label: 'Progress Reports', action: 'reports' },
        { icon: <VideoCallIcon />, label: 'Virtual Class', action: 'virtual' },
    ];

    return (
        <Box sx={{ mt: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}
            >
                <Typography variant="h6">
                    Class Actions
                </Typography>
                <IconButton
                    onClick={onToggleActions}
                    size="small"
                    sx={{
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.05)',
                        }
                    }}
                >
                    {showActions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            {showActions && (
                <Grid container spacing={2}>
                    {actions.map((action, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <ActionButton
                                icon={action.icon}
                                label={action.label}
                                onClick={() => onActionClick(action.action)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ActionButtons; 