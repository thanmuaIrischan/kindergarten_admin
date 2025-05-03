import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Box,
    Divider,
    Paper,
} from '@mui/material';
import { format } from 'date-fns';

const TeacherPrintView = ({ teachers }) => {
    const currentDate = new Date();

    const formatDate = (date) => {
        try {
            return format(new Date(date), 'dd-MM-yyyy');
        } catch (error) {
            return 'N/A';
        }
    };

    return (
        <Paper sx={{
            p: 4,
            minWidth: '100%',
            backgroundColor: '#ffffff',
            boxShadow: 'none',
            '@media print': {
                padding: '20mm',
                margin: 0,
                boxShadow: 'none',
                backgroundColor: '#ffffff !important',
                color: '#000000 !important'
            }
        }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: '#2c3e50',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: '24pt !important'
                        }
                    }}
                >
                    Teacher List Report
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: '#64748b',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: '12pt !important'
                        }
                    }}
                >
                    Generated on: {format(currentDate, 'dd-MM-yyyy HH:mm:ss')}
                </Typography>
            </Box>

            <Divider sx={{
                mb: 4,
                borderColor: '#000000',
                '@media print': {
                    borderColor: '#000000 !important'
                }
            }} />

            {/* Summary */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                        color: '#2c3e50',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: '14pt !important'
                        }
                    }}
                >
                    Summary
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Typography variant="body1" sx={{
                        color: '#475569',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: '12pt !important'
                        }
                    }}>
                        Total Teachers: {teachers.length}
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: '#475569',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: '12pt !important'
                        }
                    }}>
                        Male Teachers: {teachers.filter(t => t.gender === 'Male').length}
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: '#475569',
                        '@media print': {
                            color: '#000000 !important',
                            fontSize: '12pt !important'
                        }
                    }}>
                        Female Teachers: {teachers.filter(t => t.gender === 'Female').length}
                    </Typography>
                </Box>
            </Box>

            {/* Table */}
            <Table sx={{
                mb: 4,
                minWidth: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #000000',
                '@media print': {
                    pageBreakInside: 'auto',
                    borderColor: '#000000 !important'
                },
                '& .MuiTableCell-root': {
                    border: '1px solid #000000',
                    py: 1.5,
                    px: 2,
                    '@media print': {
                        color: '#000000 !important',
                        borderColor: '#000000 !important',
                        backgroundColor: 'transparent !important',
                        fontSize: '11pt !important',
                        padding: '8pt 12pt'
                    }
                }
            }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#f8fafc',
                            color: '#2c3e50',
                            '@media print': {
                                backgroundColor: 'transparent !important',
                                color: '#000000 !important',
                                fontSize: '12pt !important',
                                fontWeight: 'bold !important'
                            }
                        }}>
                            No.
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#f8fafc',
                            color: '#2c3e50',
                            '@media print': {
                                backgroundColor: 'transparent !important',
                                color: '#000000 !important',
                                fontSize: '12pt !important',
                                fontWeight: 'bold !important'
                            }
                        }}>
                            Teacher ID
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#f8fafc',
                            color: '#2c3e50',
                            '@media print': {
                                backgroundColor: 'transparent !important',
                                color: '#000000 !important',
                                fontSize: '12pt !important',
                                fontWeight: 'bold !important'
                            }
                        }}>
                            Full Name
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#f8fafc',
                            color: '#2c3e50',
                            '@media print': {
                                backgroundColor: 'transparent !important',
                                color: '#000000 !important',
                                fontSize: '12pt !important',
                                fontWeight: 'bold !important'
                            }
                        }}>
                            Gender
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#f8fafc',
                            color: '#2c3e50',
                            '@media print': {
                                backgroundColor: 'transparent !important',
                                color: '#000000 !important',
                                fontSize: '12pt !important',
                                fontWeight: 'bold !important'
                            }
                        }}>
                            Phone
                        </TableCell>
                        <TableCell sx={{
                            fontWeight: 'bold',
                            backgroundColor: '#f8fafc',
                            color: '#2c3e50',
                            '@media print': {
                                backgroundColor: 'transparent !important',
                                color: '#000000 !important',
                                fontSize: '12pt !important',
                                fontWeight: 'bold !important'
                            }
                        }}>
                            Date of Birth
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teachers.map((teacher, index) => (
                        <TableRow key={teacher.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{teacher.teacherID}</TableCell>
                            <TableCell>{`${teacher.firstName} ${teacher.lastName}`}</TableCell>
                            <TableCell>{teacher.gender}</TableCell>
                            <TableCell>{teacher.phone}</TableCell>
                            <TableCell>{formatDate(teacher.dateOfBirth)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Footer */}
            <Box sx={{
                mt: 4,
                textAlign: 'right',
                '@media print': {
                    position: 'fixed',
                    bottom: '20mm',
                    right: '20mm'
                }
            }}>
                <Typography variant="body2" sx={{
                    color: '#64748b',
                    '@media print': {
                        color: '#000000 !important',
                        fontSize: '10pt !important'
                    }
                }}>
                    End of Report
                </Typography>
            </Box>
        </Paper>
    );
};

export default TeacherPrintView; 