const express = require('express');
const router = express.Router();
const { db } = require('../../config/firebase');
const newsRoutes = require('./routes/newsRoutes');

// Get all news
router.get('/', async (req, res) => {
  try {
    const newsSnapshot = await db.collection('news').get();
    const news = [];
    newsSnapshot.forEach(doc => {
      news.push({
        id: doc.id,
        ...doc.data()
      });
    });
    res.json(news);
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Error getting news' });
  }
});

// Get single news item
router.get('/:id', async (req, res) => {
  try {
    const newsDoc = await db.collection('news').doc(req.params.id).get();
    if (!newsDoc.exists) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json({
      id: newsDoc.id,
      ...newsDoc.data()
    });
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Error getting news' });
  }
});

// Create news
router.post('/', async (req, res) => {
  try {
    const newsData = req.body;
    const newsRef = await db.collection('news').add(newsData);
    res.json({ id: newsRef.id, ...newsData });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Error creating news' });
  }
});

// Update news
router.put('/:id', async (req, res) => {
  try {
    const newsRef = db.collection('news').doc(req.params.id);
    await newsRef.update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Error updating news' });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('news').doc(req.params.id).delete();
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Error deleting news' });
  }
});

module.exports = newsRoutes; 