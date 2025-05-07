import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    useTheme,
    Skeleton,
    IconButton,
    Collapse,
    Divider,
    ButtonGroup,
    Tooltip
} from '@mui/material';
import {
    CalendarToday as CalendarTodayIcon,
    Event as EventIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    School as SchoolIcon,
    DateRange as DateRangeIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    Refresh as RefreshIcon,
    SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';

const SemesterCard = ({ semester, loading, onViewChange, onReload, onChangeSemester }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    console.log('Semester data in SemesterCard:', semester);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    // Helper function to parse DD-MM-YYYY format
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Helper function to format date
    const formatDate = (dateStr) => {
        const date = parseDate(dateStr);
        if (!date) return 'Not set';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    // Calculate duration in weeks
    const calculateDuration = () => {
        const startDate = parseDate(semester.startDate);
        const endDate = parseDate(semester.endDate);

        if (!startDate || !endDate) return 'N/A';

        const durationInWeeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
        return `${durationInWeeks} weeks`;
    };

    const buttonGroupStyles = {
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        flexDirection: 'column',
        '& .MuiButtonGroup-grouped': {
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            '&:not(:last-of-type)': {
                borderBottomColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
        }
    };

    if (loading) {
        return (
            <Card sx={{
                width: '100%',
                mb: 3,
                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                    : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="text" width="60%" height={40} />
                        <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="40%" />
                </CardContent>
            </Card>
        );
    }

    if (!semester) {
        return (
            <Card sx={{
                width: '100%',
                mb: 3,
                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                    : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SchoolIcon sx={{ mr: 2, color: 'text.secondary' }} />
                        <Typography variant="h6" color="text.secondary">
                            No semester information available
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Card sx={{
                width: '100%',
                mb: 2,
                backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#ffffff',
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 6px 12px rgba(0, 0, 0, 0.6)'
                        : '0 6px 12px rgba(0, 0, 0, 0.1)'
                }
            }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.05)'
                                    : 'rgba(0, 0, 0, 0.03)',
                                borderRadius: 1.5,
                                p: 0.75,
                                mr: 1.5
                            }}>
                                <SchoolIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.main }} />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Change Semester">
                                <IconButton
                                    onClick={onChangeSemester}
                                    size="small"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.05)'
                                            : 'rgba(0, 0, 0, 0.03)',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(0, 0, 0, 0.06)',
                                        }
                                    }}
                                >
                                    <SwapHorizIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                onClick={handleExpandClick}
                                size="small"
                                sx={{
                                    transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                            </IconButton>
                        </Box>
                    </Box>

                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" component="div">
                                    {semester.semesterName}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.03)',
                                    borderRadius: 1,
                                    p: 0.75,
                                    mr: 1.5
                                }}>
                                    <CalendarTodayIcon sx={{ fontSize: '1.25rem', color: 'text.secondary' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Start Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(semester.startDate)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.03)',
                                    borderRadius: 1,
                                    p: 0.75,
                                    mr: 1.5
                                }}>
                                    <EventIcon sx={{ fontSize: '1.25rem', color: 'text.secondary' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        End Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatDate(semester.endDate)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.03)',
                                    borderRadius: 1,
                                    p: 0.75,
                                    mr: 1.5
                                }}>
                                    <DateRangeIcon sx={{ fontSize: '1.25rem', color: 'text.secondary' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Duration
                                    </Typography>
                                    <Typography variant="body2">
                                        {calculateDuration()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>

            <ButtonGroup
                variant="contained"
                size="small"
                sx={{
                    ...buttonGroupStyles,
                    right: '-40px',
                }}
            >
                <Tooltip title="List View" placement="right">
                    <IconButton onClick={() => onViewChange('list')} size="small">
                        <ViewListIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Grid View" placement="right">
                    <IconButton onClick={() => onViewChange('grid')} size="small">
                        <ViewModuleIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Reload Students" placement="right">
                    <IconButton onClick={onReload} size="small">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};

export default SemesterCard; 