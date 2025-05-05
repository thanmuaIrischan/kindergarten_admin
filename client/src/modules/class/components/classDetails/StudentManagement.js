import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    useTheme,
    Button,
    Stack,
    Tooltip,
    IconButton,
    Collapse,
    Divider,
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    PersonRemove as PersonRemoveIcon,
    SwapHoriz as SwapHorizIcon,
    Group as GroupIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';

const StudentManagement = ({ studentCount, onAction }) => {
    const theme = useTheme();
    const [showDetails, setShowDetails] = useState(false);

    const StudentActionButton = ({ icon, label, onClick, color = 'primary', isCompact = true }) => (
        <Tooltip title={isCompact ? label : ''}>
            <Button
                variant="outlined"
                size={isCompact ? "small" : "medium"}
                startIcon={icon}
                onClick={onClick}
                sx={{
                    height: isCompact ? '32px' : '40px',
                    minWidth: isCompact ? '32px' : '120px',
                    color: theme.palette.mode === 'dark'
                        ? theme.palette[color].light
                        : theme.palette[color].main,
                    borderColor: theme.palette.mode === 'dark'
                        ? theme.palette[color].light
                        : theme.palette[color].main,
                    borderWidth: isCompact ? '1px' : '1.5px',
                    borderRadius: isCompact ? 1.5 : 2,
                    textTransform: 'none',
                    fontSize: isCompact ? '0.8rem' : '0.9rem',
                    fontWeight: 500,
                    px: isCompact ? 1 : 2,
                    '&:hover': {
                        borderColor: theme.palette[color].main,
                        transform: 'translateY(-1px)',
                    },
                }}
            >
                {isCompact ? label.split(' ')[0] : label}
            </Button>
        </Tooltip>
    );

    const CompactView = () => (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon sx={{ fontSize: '1.5rem', mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle2" color="primary" sx={{ mr: 0.5 }}>
                    {studentCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    students
                </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                <StudentActionButton
                    icon={<PersonAddIcon />}
                    label="Add New Student"
                    onClick={() => onAction('addStudent')}
                    color="primary"
                    isCompact={true}
                />
                <StudentActionButton
                    icon={<PersonRemoveIcon />}
                    label="Remove Student"
                    onClick={() => onAction('removeStudent')}
                    color="error"
                    isCompact={true}
                />
                <StudentActionButton
                    icon={<SwapHorizIcon />}
                    label="Transfer Student"
                    onClick={() => onAction('transferStudent')}
                    color="info"
                    isCompact={true}
                />
            </Stack>
        </Stack>
    );

    const DetailedView = () => (
        <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
                Student Management
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GroupIcon sx={{ fontSize: '2rem', mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" color="primary">
                    {studentCount}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    Students
                </Typography>
            </Box>
            <Stack spacing={2}>
                <StudentActionButton
                    icon={<PersonAddIcon />}
                    label="Add New Student"
                    onClick={() => onAction('addStudent')}
                    color="primary"
                    isCompact={false}
                />
                <StudentActionButton
                    icon={<PersonRemoveIcon />}
                    label="Remove Student"
                    onClick={() => onAction('removeStudent')}
                    color="error"
                    isCompact={false}
                />
                <StudentActionButton
                    icon={<SwapHorizIcon />}
                    label="Transfer Student"
                    onClick={() => onAction('transferStudent')}
                    color="info"
                    isCompact={false}
                />
            </Stack>
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

export default StudentManagement; 