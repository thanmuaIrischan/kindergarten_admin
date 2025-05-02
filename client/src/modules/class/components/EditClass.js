import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClassById, updateClass } from '../api/class.api';
import ClassForm from './ClassForm';

const EditClass = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const data = await getClassById(id);
                setClassData(data);
            } catch (error) {
                console.error('Error fetching class:', error);
                navigate('/');
            }
        };

        fetchClass();
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            await updateClass(id, formData);
            navigate('/');
        } catch (error) {
            console.error('Error updating class:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (!classData) {
        return null; // or a loading spinner
    }

    return (
        <ClassForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialData={classData}
            onBack={handleBack}
        />
    );
};

export default EditClass; 