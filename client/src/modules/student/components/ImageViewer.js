import React from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageViewer = ({ open, image, onClose }) => {
    const theme = useTheme();

    if (!image) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{
                position: 'relative',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                p: 2
            }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                        zIndex: 1,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ p: 0 }}>
                    <Box
                        component="img"
                        src={image}
                        alt="Full size view"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    />
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default ImageViewer; 