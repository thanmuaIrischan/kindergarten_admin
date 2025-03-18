import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Optional: Add some basic styling

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [students, setStudents] = useState([]);

  // Fetch students from backend
  const fetchStudents = async () => {
    const response = await axios.get('http://localhost:5000/api/students');
    setStudents(response.data);
  };

  // Add a student
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/students', {
      firstName,
      lastName,
      age: Number(age),
      parentContact,
    });
    setFirstName('');
    setLastName('');
    setAge('');
    setParentContact('');
    fetchStudents(); // Refresh list
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="App">
      <h1>Kindergarten Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Parent Contact"
          value={parentContact}
          onChange={(e) => setParentContact(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>
      <h2>Student List</h2>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.firstName} {student.lastName} - Age: {student.age}, Contact: {student.parentContact}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;