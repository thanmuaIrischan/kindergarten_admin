import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardMedia,
    Skeleton,
    Fade,
    Typography,
    useTheme
} from '@mui/material';
import { Person as PersonIcon, BrokenImage as BrokenImageIcon } from '@mui/icons-material';

const ProfileCard = ({ imageUrl, isLoading, hasError: initialHasError, onImageLoad, onImageError, onImageOpen }) => {
    const theme = useTheme();
    const [hasError, setHasError] = useState(initialHasError);

    useEffect(() => {
        setHasError(initialHasError);
    }, [initialHasError]);

    const handleImageError = () => {
        console.error('Image failed to load:', imageUrl);
        setHasError(true);
        onImageError?.();
    };

    const handleImageLoad = () => {
        console.log('Image loaded successfully:', imageUrl);
        setHasError(false);
        onImageLoad?.();
    };

    const handleImageClick = () => {
        if (imageUrl && !hasError) {
            onImageOpen?.(imageUrl, 'Student Photo');
        }
    };

    const renderPlaceholder = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: 300,
                backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#f8fafc',
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b'
            }}
        >
            {hasError ? (
                <>
                    <BrokenImageIcon sx={{ fontSize: 64, mb: 1, color: theme.palette.error.main }} />
                    <Typography variant="body2" color="error">Image not available</Typography>
                </>
            ) : (
                <>
                    <PersonIcon sx={{ fontSize: 64, mb: 1 }} />
                    <Typography variant="body2">No photo available</Typography>
                </>
            )}
        </Box>
    );

    // Debug log when component renders
    console.log('ProfileCard render:', { imageUrl, isLoading, hasError });

    return (
        <Card
            sx={{
                height: '100%',
                cursor: imageUrl && !hasError ? 'pointer' : 'default',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: imageUrl && !hasError ? 'scale(1.02)' : 'none'
                }
            }}
            onClick={handleImageClick}
        >
            {isLoading ? (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    animation="wave"
                />
            ) : imageUrl && !hasError ? (
                <Fade in={true} timeout={500}>
                    <CardMedia
                        component="img"
                        height={300}
                        image={imageUrl}
                        alt="Student Photo"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        sx={{
                            objectFit: 'cover',
                            width: '100%'
                        }}
                    />
                </Fade>
            ) : (
                renderPlaceholder()
            )}
        </Card>
    );
};

export default ProfileCard; 