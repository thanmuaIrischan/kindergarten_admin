import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    IconButton,
    Tooltip,
    Chip,
    useTheme,
    Skeleton,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Wc as WcIcon,
    SwapHoriz as TransferIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const StudentGrid = ({
    students,
    loading,
    onViewStudent,
    onEditStudent,
    onDeleteStudent,
    onAction,
}) => {
    const theme = useTheme();

    const handleTransferStudent = (student) => {
        if (onAction) {
            onAction('transferStudent', student);
        }
    };

    const handleDeleteStudent = (student) => {
        if (onAction) {
            onAction('removeStudent', student);
        }
    };

    const LoadingSkeleton = () => (
        <Grid item xs={12} sm={6} md={3} sx={{ minWidth: '280px' }}>
            <Card
                elevation={0}
                sx={{
                    height: '180px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="40%" />
                        </Box>
                    </Box>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                </CardContent>
            </Card>
        </Grid>
    );

    if (loading) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                minHeight: '400px',
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto',
                position: 'relative',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    '&:hover': {
                        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    },
                },
            }}>
                <Grid container spacing={1.5} sx={{ p: 1.5, width: '100%', margin: 0 }}>
                    {[...Array(8)].map((_, index) => (
                        <LoadingSkeleton key={index} />
                    ))}
                </Grid>
            </Box>
        );
    }

    if (students.length === 0) {
        return (
            <Box
                sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 2,
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No students found
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            position: 'relative',
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                },
            },
        }}>
            <Grid container spacing={1.5} sx={{ p: 1.5, width: '100%', margin: 0 }}>
                {students.map((student) => (
                    <Grid item xs={12} sm={6} md={3} key={student.id} sx={{ minWidth: '280px' }}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '150px',
                                width: '100%',
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            <CardContent sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                p: 1.5,
                                width: '100%',
                                boxSizing: 'border-box'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 1,
                                    width: '100%',
                                    minWidth: 0
                                }}>
                                    <Avatar
                                        src={student.avatar}
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            mr: 1.5,
                                            flexShrink: 0,
                                            backgroundColor: theme.palette.primary.main,
                                        }}
                                    >
                                        {`${student.firstName[0]}${student.lastName[0]}`}
                                    </Avatar>
                                    <Box sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        width: '100%',
                                        overflow: 'hidden'
                                    }}>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            sx={{
                                                wordBreak: 'break-word',
                                                lineHeight: 1.2,
                                                mb: 0.25,
                                                fontWeight: 600,
                                                width: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                maxWidth: '100%',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {`${student.lastName} ${student.firstName}`}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            noWrap
                                            sx={{
                                                width: '100%',
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            ID: {student.studentID}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ mb: 1, width: '100%' }}>
                                    <Chip
                                        icon={<WcIcon />}
                                        label={student.gender}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            '& .MuiChip-label': { px: 0.75 },
                                            '& .MuiChip-icon': { fontSize: '0.875rem' },
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(0, 0, 0, 0.08)',
                                        }}
                                    />
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.25,
                                    mb: 1,
                                    flex: 1,
                                    width: '100%',
                                    minWidth: 0
                                }}>
                                    {student.phone && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            minWidth: 0
                                        }}>
                                            <PhoneIcon sx={{
                                                fontSize: '0.75rem',
                                                mr: 0.5,
                                                color: 'text.secondary',
                                                flexShrink: 0
                                            }} />
                                            <Typography
                                                variant="caption"
                                                noWrap
                                                sx={{
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {student.phone}
                                            </Typography>
                                        </Box>
                                    )}
                                    {student.email && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            minWidth: 0
                                        }}>
                                            <EmailIcon sx={{
                                                fontSize: '0.75rem',
                                                mr: 0.5,
                                                color: 'text.secondary',
                                                flexShrink: 0
                                            }} />
                                            <Typography
                                                variant="caption"
                                                noWrap
                                                sx={{
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {student.email}
                                            </Typography>
                                        </Box>
                                    )}
                                    {student.address && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            minWidth: 0
                                        }}>
                                            <LocationIcon sx={{
                                                fontSize: '0.75rem',
                                                mr: 0.5,
                                                color: 'text.secondary',
                                                flexShrink: 0
                                            }} />
                                            <Typography
                                                variant="caption"
                                                noWrap
                                                sx={{
                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {student.address}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 0.5,
                                    mt: 'auto',
                                    width: '100%'
                                }}>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => onViewStudent(student)}
                                            sx={{ color: theme.palette.info.main, p: 0.5 }}
                                        >
                                            <VisibilityIcon sx={{ fontSize: '1.125rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Transfer to Another Class">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleTransferStudent(student)}
                                            sx={{ color: theme.palette.warning.main, p: 0.5 }}
                                        >
                                            <TransferIcon sx={{ fontSize: '1.125rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Student">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteStudent(student)}
                                            sx={{ color: theme.palette.error.main, p: 0.5 }}
                                        >
                                            <DeleteIcon sx={{ fontSize: '1.125rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default StudentGrid; 