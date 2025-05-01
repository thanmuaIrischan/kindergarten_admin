import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';

const ClassDialog = ({ open, onClose, onSave, classData }) => {
    const [formData, setFormData] = useState({
        name: '',
        teacher: '',
        capacity: '',
    });

    useEffect(() => {
        if (classData) {
            setFormData({
                name: classData.name || '',
                teacher: classData.teacher || '',
                capacity: classData.capacity || '',
            });
        } else {
            setFormData({
                name: '',
                teacher: '',
                capacity: '',
            });
        }
    }, [classData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            capacity: parseInt(formData.capacity, 10)
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {classData ? 'Edit Class' : 'Add New Class'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Class Name"
                        type="text"
                        fullWidth
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="teacher"
                        label="Teacher Name"
                        type="text"
                        fullWidth
                        required
                        value={formData.teacher}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="capacity"
                        label="Capacity"
                        type="number"
                        fullWidth
                        required
                        value={formData.capacity}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {classData ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ClassDialog; 