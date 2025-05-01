import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    Container,
    useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import StudentInfo from './StudentInfo';
import DocumentCard from './DocumentCard';
import ImageViewer from './ImageViewer';
import { processStudentImages } from '../utils/imageUtils';

const StudentDetails = ({ student, onBack }) => {
    const theme = useTheme();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const processedStudent = processStudentImages(student);

    useEffect(() => {
        if (student) {
            setIsLoading(false);
        }
    }, [student]);

    if (!student) return null;

    const handleImageClick = (imageData) => {
        // Use large version for viewing if available
        const imageUrl = imageData?.large || imageData?.medium || imageData;
        setSelectedImage(imageUrl);
        setIsViewerOpen(true);
    };

    const handleCloseViewer = () => {
        setIsViewerOpen(false);
        setSelectedImage(null);
    };

    const getImageUrl = (imageData) => {
        return imageData?.medium || imageData?.original || imageData || '';
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box display="flex" alignItems="center" mb={4}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                        mr: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(52, 152, 219, 0.1)'
                                : 'rgba(41, 128, 185, 0.1)',
                        }
                    }}
                >
                    Back to List
                </Button>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                        fontWeight: 700
                    }}
                >
                    Student Details
                </Typography>
            </Box>

            <Paper
                elevation={theme.palette.mode === 'dark' ? 2 : 1}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                    borderRadius: 2,
                    mb: 4
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <DocumentCard
                            title="Student Photo"
                            imageUrl={getImageUrl(processedStudent?.processedImages?.studentPhoto)}
                            onImageClick={() => handleImageClick(processedStudent?.processedImages?.studentPhoto)}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <StudentInfo student={processedStudent} />
                    </Grid>
                </Grid>
            </Paper>

            <Paper
                elevation={theme.palette.mode === 'dark' ? 2 : 1}
                sx={{
                    p: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                    borderRadius: 2
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                        mb: 3,
                        fontWeight: 600
                    }}
                >
                    Student Documents
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <DocumentCard
                            title="Birth Certificate/Transcript"
                            imageUrl={getImageUrl(processedStudent?.processedImages?.transcriptPhoto)}
                            onImageClick={() => handleImageClick(processedStudent?.processedImages?.transcriptPhoto)}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DocumentCard
                            title="Household Registration"
                            imageUrl={getImageUrl(processedStudent?.processedImages?.householdRegistration)}
                            onImageClick={() => handleImageClick(processedStudent?.processedImages?.householdRegistration)}
                            isLoading={isLoading}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <ImageViewer
                open={isViewerOpen}
                image={selectedImage}
                onClose={handleCloseViewer}
            />
        </Container>
    );
};

export default StudentDetails; 