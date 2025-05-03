import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Avatar,
    Grid,
    Divider,
    useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const TeacherDetails = ({ teacher, onBack }) => {
    const theme = useTheme();

    if (!teacher) {
        return null;
    }

    const detailStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 6px rgba(0, 0, 0, 0.4)'
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        p: 3,
    };

    const labelStyle = {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        mb: 1,
    };

    const valueStyle = {
        color: theme.palette.text.primary,
        fontWeight: 400,
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{ mb: 3 }}
                variant="outlined"
            >
                Back to List
            </Button>

            <Paper sx={detailStyle}>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={teacher.avatar}
                            alt={`${teacher.firstName} ${teacher.lastName}`}
                            sx={{ width: 100, height: 100 }}
                        />
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                {`${teacher.firstName} ${teacher.lastName}`}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Teacher ID: {teacher.teacherID}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Stack spacing={2}>
                                <Box>
                                    <Typography sx={labelStyle}>Gender</Typography>
                                    <Typography sx={valueStyle}>{teacher.gender}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={labelStyle}>Date of Birth</Typography>
                                    <Typography sx={valueStyle}>
                                        {new Date(teacher.dateOfBirth).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography sx={labelStyle}>Phone</Typography>
                                    <Typography sx={valueStyle}>{teacher.phone}</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    );
};

export default TeacherDetails; 