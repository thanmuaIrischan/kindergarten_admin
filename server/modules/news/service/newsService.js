const newsRepository = require('../repository/newsRepository');

const getAllNews = async () => {
  const newsSnapshot = await newsRepository.getAllNews();
  const news = [];
  newsSnapshot.forEach(doc => {
    news.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return news;
};

const getNewsById = async (id) => {
  const newsDoc = await newsRepository.getNewsById(id);
  if (!newsDoc.exists) {
    return null;
  }
  return {
    id: newsDoc.id,
    ...newsDoc.data()
  };
};

const createNews = async (newsData) => {
  const newsRef = await newsRepository.createNews(newsData);
  return { id: newsRef.id, ...newsData };
};

const updateNews = async (id, newsData) => {
  await newsRepository.updateNews(id, newsData);
  return { id, ...newsData };
};

const deleteNews = async (id) => {
  await newsRepository.deleteNews(id);
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
}; 