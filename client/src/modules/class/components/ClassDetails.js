import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Stack,
    useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ClassDetails = ({ classData, onBack }) => {
    const theme = useTheme();

    return (
        <Box className="class-details-container" sx={{ width: '100%', maxWidth: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                }}
            >
                <Box display="flex" alignItems="center" mb={3}>
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
                    <Typography variant="h6" color="primary">
                        Class Details
                    </Typography>
                </Box>

                <Stack spacing={3} sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Class Name
                        </Typography>
                        <Typography variant="body1" sx={{
                            p: 1.5,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        }}>
                            {classData.className}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Teacher Name
                        </Typography>
                        <Typography variant="body1" sx={{
                            p: 1.5,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        }}>
                            {classData.teacherName}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{
                            p: 1.5,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        }}>
                            {classData.description || 'No description available'}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Number of Students
                        </Typography>
                        <Typography variant="body1" sx={{
                            p: 1.5,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        }}>
                            {classData.studentsCount || 0}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ClassDetails; 