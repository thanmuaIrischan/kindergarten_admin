import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from '@mui/material';
import {
    TableChart as ExcelIcon,
    Description as JsonIcon,
} from '@mui/icons-material';

const ExportDialog = ({ open, onClose, onExport }) => {
    const theme = useTheme();

    const handleExport = (format) => {
        onExport(format);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
            }}>
                Export Students
            </DialogTitle>
            <DialogContent sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
            }}>
                <List>
                    <ListItem
                        button
                        onClick={() => handleExport('xlsx')}
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
                            primary="Excel Format (.xlsx)"
                            secondary="Export to Excel spreadsheet"
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                                },
                                '& .MuiListItemText-secondary': {
                                    color: theme.palette.mode === 'dark' ? '#b2bec3' : '#7f8c8d'
                                }
                            }}
                        />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => handleExport('json')}
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
                            primary="JSON Format (.json)"
                            secondary="Export to JSON file"
                            sx={{
                                '& .MuiListItemText-primary': {
                                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                                },
                                '& .MuiListItemText-secondary': {
                                    color: theme.palette.mode === 'dark' ? '#b2bec3' : '#7f8c8d'
                                }
                            }}
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions sx={{
                backgroundColor: theme.palette.mode === 'dark' ? '#1a1f2c' : '#ffffff',
                color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#000000',
            }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDialog; 