import React, { useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import DocumentCard from './DocumentCard';
import ImageViewer from './ImageViewer';

const StudentDocuments = ({ student }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const documents = [
        {
            title: 'Student Photo',
            imageUrl: student?.studentPhoto || '',
            type: 'photo'
        },
        {
            title: 'Transcript',
            imageUrl: student?.transcriptPhoto || '',
            type: 'document'
        },
        {
            title: 'Household Registration',
            imageUrl: student?.householdRegistration || '',
            type: 'document'
        }
    ];

    const handleImageOpen = (url, title) => {
        setSelectedImage({ url, title });
    };

    const handleImageClose = () => {
        setSelectedImage(null);
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Student Documents
            </Typography>
            <Grid container spacing={3}>
                {documents.map((doc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <DocumentCard
                            title={doc.title}
                            imageUrl={doc.imageUrl}
                            imageType={doc.type}
                            onImageOpen={handleImageOpen}
                        />
                    </Grid>
                ))}
            </Grid>
            <ImageViewer
                image={selectedImage}
                onClose={handleImageClose}
            />
        </Box>
    );
};

export default StudentDocuments; 