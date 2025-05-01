import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Typography,
    Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import ClassDialog from './ClassDialog';
import { useSnackbar } from 'notistack';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const fetchClasses = async () => {
        try {
            const response = await axios.get(`${API_URL}/classes`);
            setClasses(response.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch classes', { variant: 'error' });
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleAdd = () => {
        setSelectedClass(null);
        setOpenDialog(true);
    };

    const handleEdit = (classData) => {
        setSelectedClass(classData);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await axios.delete(`${API_URL}/classes/${id}`);
                enqueueSnackbar('Class deleted successfully', { variant: 'success' });
                fetchClasses();
            } catch (error) {
                enqueueSnackbar(error.response?.data?.error || 'Failed to delete class', { variant: 'error' });
            }
        }
    };

    const handleSave = async (classData) => {
        try {
            if (selectedClass) {
                await axios.put(`${API_URL}/classes/${selectedClass.id}`, classData);
                enqueueSnackbar('Class updated successfully', { variant: 'success' });
            } else {
                await axios.post(`${API_URL}/classes`, classData);
                enqueueSnackbar('Class created successfully', { variant: 'success' });
            }
            setOpenDialog(false);
            fetchClasses();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Failed to save class', { variant: 'error' });
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Classes
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAdd}
                >
                    Add New Class
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Teacher</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Current Students</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.map((cls) => (
                            <TableRow key={cls.id}>
                                <TableCell>{cls.name}</TableCell>
                                <TableCell>{cls.teacher}</TableCell>
                                <TableCell>{cls.capacity}</TableCell>
                                <TableCell>{cls.studentCount}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(cls)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(cls.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ClassDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSave}
                classData={selectedClass}
            />
        </Box>
    );
};

export default ClassList; 