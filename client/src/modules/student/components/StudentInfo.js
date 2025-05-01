import React from 'react';
import {
    Box,
    Typography,
    Stack,
    useTheme
} from '@mui/material';
import { getStyles } from '../styles/StudentInfo.styles';

const DetailRow = ({ label, value, sx }) => (
    <Box sx={sx.detailRow}>
        <Typography variant="subtitle1" sx={sx.label}>
            {label}
        </Typography>
        <Typography variant="body1" sx={sx.value}>
            {value || 'N/A'}
        </Typography>
    </Box>
);

const SectionTitle = ({ title, sx }) => (
    <Typography variant="h6" sx={sx.sectionTitle}>
        {title}
    </Typography>
);

const StudentInfo = ({ student }) => {
    const theme = useTheme();
    const sx = getStyles(theme);

    return (
        <Stack spacing={4}>
            {/* Personal Information Section */}
            <Box sx={sx.section}>
                <SectionTitle title="Personal Information" sx={sx} />
                <DetailRow label="Student ID" value={student.studentID} sx={sx} />
                <DetailRow label="Full Name" value={`${student.lastName} ${student.firstName}`} sx={sx} />
                <DetailRow label="Gender" value={student.gender} sx={sx} />
                <DetailRow label="Date of Birth" value={student.dateOfBirth} sx={sx} />
                <DetailRow label="Class" value={student.class} sx={sx} />
                <DetailRow label="School" value={student.school} sx={sx} />
                <DetailRow label="Grade Level" value={student.gradeLevel} sx={sx} />
                <DetailRow label="Education System" value={student.educationSystem} sx={sx} />
            </Box>

            {/* Parent Information Section */}
            <Box sx={sx.section}>
                <SectionTitle title="Parent Information" sx={sx} />
                <DetailRow label="Father's Name" value={student.parentName} sx={sx} />
                <DetailRow label="Father's Occupation" value={student.fatherOccupation} sx={sx} />
                <DetailRow label="Mother's Name" value={student.motherName} sx={sx} />
                <DetailRow label="Mother's Occupation" value={student.motherOccupation} sx={sx} />
            </Box>
        </Stack>
    );
};

export default StudentInfo; 