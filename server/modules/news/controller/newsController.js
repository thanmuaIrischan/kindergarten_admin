const newsService = require('../service/newsService');

const getAllNews = async (req, res) => {
  try {
    const news = await newsService.getAllNews();
    res.json(news);
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Error getting news' });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await newsService.getNewsById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error getting news:', error);
    res.status(500).json({ error: 'Error getting news' });
  }
};

const createNews = async (req, res) => {
  try {
    const news = await newsService.createNews(req.body);
    res.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Error creating news' });
  }
};

const updateNews = async (req, res) => {
  try {
    const news = await newsService.updateNews(req.params.id, req.body);
    res.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Error updating news' });
  }
};

const deleteNews = async (req, res) => {
  try {
    await newsService.deleteNews(req.params.id);
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Error deleting news' });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
}; 