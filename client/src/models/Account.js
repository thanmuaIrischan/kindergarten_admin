class Account {
    constructor(id, username, password, role, fullName, phoneNumber, actor) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.actor = actor;
    }

    static fromFirestore(data) {
        return new Account(
            data.id,
            data.username,
            data.password,
            data.role,
            data.fullName,
            data.phoneNumber,
            data.actor
        );
    }

    toFirestore() {
        return {
            username: this.username,
            password: this.password,
            role: this.role,
            fullName: this.fullName,
            phoneNumber: this.phoneNumber,
            actor: this.actor
        };
    }
}

export default Account; 