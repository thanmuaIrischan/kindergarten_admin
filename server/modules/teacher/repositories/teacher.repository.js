const admin = require('../../../config/firebase');
const db = admin.firestore();
const teacherCollection = 'teacher';

class TeacherRepository {
    async findAll() {
        try {
            const snapshot = await db.collection(teacherCollection).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    async findById(id) {
        try {
            const doc = await db.collection(teacherCollection).doc(id).get();
            if (!doc.exists) {
                throw new Error('Teacher not found');
            }
            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            throw error;
        }
    }

    async create(teacherData) {
        try {
            const docRef = await db.collection(teacherCollection).add(teacherData);
            const newDoc = await docRef.get();
            return {
                id: newDoc.id,
                ...newDoc.data()
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id, teacherData) {
        try {
            await db.collection(teacherCollection).doc(id).update(teacherData);
            const updatedDoc = await db.collection(teacherCollection).doc(id).get();
            return {
                id: updatedDoc.id,
                ...updatedDoc.data()
            };
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            await db.collection(teacherCollection).doc(id).delete();
            return { id };
        } catch (error) {
            throw error;
        }
    }

    async search(query) {
        try {
            const snapshot = await db.collection(teacherCollection).get();
            const teachers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return teachers.filter(teacher =>
                teacher.firstName.toLowerCase().includes(query.toLowerCase()) ||
                teacher.lastName.toLowerCase().includes(query.toLowerCase()) ||
                teacher.teacherID.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TeacherRepository(); 