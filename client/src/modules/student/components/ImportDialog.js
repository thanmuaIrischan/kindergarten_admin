import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from '@mui/material';
import {
    Description as JsonIcon,
    TableChart as ExcelIcon,
} from '@mui/icons-material';

const ImportDialog = ({ open, onClose, onImportClick }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2c3e50' : '#ffffff',
                    boxShadow: theme.palette.mode === 'dark' ? '0 0 20px rgba(0, 0, 0, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50',
                    fontWeight: 600
                }}
            >
                Import Students
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Choose import format:
                </Typography>
                <List>
                    <ListItem
                        button
                        onClick={() => onImportClick('json')}
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(41, 128, 185, 0.1)',
                            }
                        }}
                    >
                        <ListItemIcon>
                            <JsonIcon sx={{ color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="JSON Format"
                            secondary="Import from a JSON file"
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50'
                                },
                                '& .MuiListItemText-secondary': {
                                    color: theme.palette.mode === 'dark' ? '#b2bec3' : '#7f8c8d'
                                }
                            }}
                        />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => onImportClick('excel')}
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(41, 128, 185, 0.1)',
                            }
                        }}
                    >
                        <ListItemIcon>
                            <ExcelIcon sx={{ color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Excel Format"
                            secondary="Import from an Excel file"
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#2c3e50'
                                },
                                '& .MuiListItemText-secondary': {
                                    color: theme.palette.mode === 'dark' ? '#b2bec3' : '#7f8c8d'
                                }
                            }}
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(41, 128, 185, 0.1)',
                        }
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImportDialog; 