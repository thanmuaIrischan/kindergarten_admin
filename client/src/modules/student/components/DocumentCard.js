import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Skeleton,
    IconButton,
    useTheme
} from '@mui/material';
import {
    ZoomIn as ZoomInIcon,
    BrokenImage as BrokenImageIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';

const DocumentCard = ({ title, imageUrl, onImageClick, isLoading = false, error = false }) => {
    const theme = useTheme();

    const renderContent = () => {
        if (isLoading) {
            return (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    animation="wave"
                />
            );
        }

        if (error || !imageUrl) {
            return (
                <Box
                    sx={{
                        height: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    }}
                >
                    {error ? (
                        <>
                            <BrokenImageIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                            <Typography variant="body2" color="error">
                                Failed to load image
                            </Typography>
                        </>
                    ) : (
                        <>
                            <DescriptionIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                No document available
                            </Typography>
                        </>
                    )}
                </Box>
            );
        }

        return (
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height={200}
                    image={imageUrl}
                    alt={title}
                    sx={{
                        objectFit: 'cover',
                        transition: 'filter 0.3s ease-in-out',
                        '&:hover': {
                            filter: 'brightness(0.8)'
                        }
                    }}
                />
                <IconButton
                    onClick={() => onImageClick(imageUrl)}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        },
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                        '.MuiCard-root:hover &': {
                            opacity: 1
                        }
                    }}
                >
                    <ZoomInIcon />
                </IconButton>
            </Box>
        );
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: imageUrl ? 'pointer' : 'default',
                '&:hover': {
                    transform: imageUrl ? 'scale(1.02)' : 'none',
                    transition: 'transform 0.3s ease-in-out'
                }
            }}
            onClick={() => imageUrl && onImageClick(imageUrl)}
        >
            {renderContent()}
            <CardContent>
                <Typography variant="subtitle1" component="div" align="center">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DocumentCard; 