const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();
const app = express();

app.use(cors());
app.use(express.json());

// Add a student
app.post("/api/students", async (req, res) => {
  try {
    const { firstName, lastName, age, parentContact } = req.body;
    const docRef = await db.collection("students").add({
      firstName,
      lastName,
      age,
      parentContact,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const snapshot = await db.collection("students").get();
    const students = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Kindergarten Admin Server running on port ${PORT}`)
);
