const { db } = require('../../../config/firebase');

const getAllNews = async () => {
  return await db.collection('news').get();
};

const getNewsById = async (id) => {
  return await db.collection('news').doc(id).get();
};

const createNews = async (newsData) => {
  return await db.collection('news').add(newsData);
};

const updateNews = async (id, newsData) => {
  const newsRef = db.collection('news').doc(id);
  await newsRef.update(newsData);
};

const deleteNews = async (id) => {
  await db.collection('news').doc(id).delete();
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
}; 