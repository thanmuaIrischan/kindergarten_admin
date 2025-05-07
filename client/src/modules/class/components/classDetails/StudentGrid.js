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
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Wc as WcIcon,
} from '@mui/icons-material';

const StudentGrid = ({
    students,
    loading,
    onViewStudent,
    onEditStudent,
    onDeleteStudent,
}) => {
    const theme = useTheme();

    const LoadingSkeleton = () => (
        <Grid item xs={12} sm={6} md={4}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="40%" />
                        </Box>
                    </Box>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="50%" />
                </CardContent>
            </Card>
        </Grid>
    );

    if (loading) {
        return (
            <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                    <LoadingSkeleton key={index} />
                ))}
            </Grid>
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
        <Grid container spacing={3}>
            {students.map((student) => (
                <Grid item xs={12} sm={6} md={4} key={student.id}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
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
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    src={student.avatar}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        mr: 2,
                                        backgroundColor: theme.palette.primary.main,
                                    }}
                                >
                                    {`${student.firstName[0]}${student.lastName[0]}`}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {`${student.firstName} ${student.lastName}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {student.studentID}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Chip
                                    icon={<WcIcon />}
                                    label={student.gender}
                                    size="small"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.1)'
                                            : 'rgba(0, 0, 0, 0.08)',
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                {student.phone && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">{student.phone}</Typography>
                                    </Box>
                                )}
                                {student.email && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EmailIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">{student.email}</Typography>
                                    </Box>
                                )}
                                {student.address && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocationIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">{student.address}</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Tooltip title="View Details">
                                    <IconButton
                                        size="small"
                                        onClick={() => onViewStudent(student)}
                                        sx={{ color: theme.palette.info.main }}
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Student">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEditStudent(student)}
                                        sx={{ color: theme.palette.warning.main }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Student">
                                    <IconButton
                                        size="small"
                                        onClick={() => onDeleteStudent(student)}
                                        sx={{ color: theme.palette.error.main }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default StudentGrid; 