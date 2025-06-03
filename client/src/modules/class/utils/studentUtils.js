import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchStudents = async (classId) => {
    try {
        // Get the class data first to get the current list of student IDs
        const classResponse = await axios.get(`${API_URL}/class/${classId}`);
        const classData = classResponse.data.data;
        console.log("classData", classData)
        
        if (!classData || !classData.students || !Array.isArray(classData.students)) {
            console.log('No students found in class or invalid class data');
            return [];
        }

        // Get all students
        const studentsResponse = await axios.get(`${API_URL}/student?limit=0`);
        const allStudents = studentsResponse.data.data || [];
        console.log("allStudents", allStudents)

        // Filter students that are actually in the class based on the class's student list
        const classStudents = allStudents.filter(student => 
            classData.students.includes(student.studentID)
        );

        console.log('Fetched students for class:', {
            classId,
            totalStudentsInClass: classData.students.length,
            matchedStudents: classStudents.length
        });

        return classStudents;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

export const addStudentToClass = async (student, classId, onSuccess) => {
    try {
        if (!classId) {
            throw new Error('Class ID is required');
        }

        // Get current class data
        const classResponse = await axios.get(`${API_URL}/class/${classId}`);
        const currentClass = classResponse.data.data;
        console.log("currentClass", currentClass)

        // Get current student IDs
        const currentStudents = currentClass.students || [];
        const newStudents = Array.isArray(student) ? student : [student];

        // Check for duplicates with detailed information
        const duplicateStudents = newStudents.filter(s => 
            currentStudents.includes(s.studentID)
        );
        console.log("currentStudents", currentStudents)
        console.log("New students", newStudents)
        console.log("duplicateStudents", duplicateStudents)

        if (duplicateStudents.length > 0) {
            const duplicateNames = duplicateStudents
                .map(s => `${s.firstName} ${s.lastName} (${s.studentID})`)
                .join(', ');
            throw new Error(`The following students are already in this class: ${duplicateNames}`);
        }

        // Update class with new students
        const updatedStudents = [...newStudents];
        
        // Update the class
        const response = await axios.put(`${API_URL}/class/${classId}`, {
            ...currentClass,
            students: updatedStudents
        });

        if (response.data.success) {
            const addedCount = newStudents.length;
            console.log('Successfully added students:', {
                added: newStudents,
                addedCount,
                total: updatedStudents.length
            });
            await onSuccess();
        } else {
            throw new Error('Failed to update class with new students');
        }
    } catch (error) {
        console.error('Error in addStudentToClass:', error);
        // Enhance error message for UI display
        if (error.response?.data?.message) {
            throw new Error(`Server Error: ${error.response.data.message}`);
        } else {
            throw error;
        }
    }
};

export const removeStudentFromClass = async (student, classId, onSuccess) => {
    try {
        if (!classId) {
            throw new Error('Class ID is required');
        }

        // Get current class data
        const classResponse = await axios.get(`${API_URL}/class/${classId}`);
        const currentClass = classResponse.data.data;

        // Get current student IDs
        const currentStudents = currentClass.students || [];
        const studentsToRemove = Array.isArray(student) ? student : [student];
        const studentIdsToRemove = studentsToRemove.map(s => s.studentID);

        // Remove the students
        const updatedStudents = currentStudents.filter(
            studentId => !studentIdsToRemove.includes(studentId)
        );

        // Update the class
        const response = await axios.put(`${API_URL}/class/${classId}`, {
            ...currentClass,
            students: updatedStudents
        });

        if (response.data.success) {
            console.log('Successfully removed students:', {
                removed: studentIdsToRemove,
                remaining: updatedStudents.length
            });
            await onSuccess();
        } else {
            throw new Error('Failed to remove students from class');
        }
    } catch (error) {
        console.error('Error in removeStudentFromClass:', error);
        throw error;
    }
};

export const transferStudentsToClass = async (students, targetClass, classId, onSuccess) => {
    try {
        console.log('Students transferred:', { students, targetClass });
        await onSuccess();
    } catch (error) {
        console.error('Error in transferStudentsToClass:', error);
    }
}; 