class Student {
    constructor(id, name, dateOfBirth, gender, address, parentId, classId) {
        this.id = id;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.parentId = parentId;
        this.classId = classId;
    }

    static fromFirestore(data) {
        return new Student(
            data.id,
            data.name,
            data.dateOfBirth,
            data.gender,
            data.address,
            data.parentId,
            data.classId
        );
    }

    toFirestore() {
        return {
            name: this.name,
            dateOfBirth: this.dateOfBirth,
            gender: this.gender,
            address: this.address,
            parentId: this.parentId,
            classId: this.classId
        };
    }
}

export default Student; 