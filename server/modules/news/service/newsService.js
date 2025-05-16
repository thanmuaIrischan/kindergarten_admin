const newsRepository = require('../repository/newsRepository');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'kindergarten/news',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

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
  // Handle image uploads for each subtitle
  const processedSubtitles = await Promise.all(newsData.subtitles.map(async (subtitle) => {
    if (subtitle.imageUrl && subtitle.imageUrl !== 'none' && subtitle.imageUrl.startsWith('data:')) {
      // Upload image to Cloudinary if it's a base64 string
      const cloudinaryUrl = await uploadToCloudinary(subtitle.imageUrl);
      return { ...subtitle, imageUrl: cloudinaryUrl };
    }
    return subtitle;
  }));

  const processedNewsData = {
    ...newsData,
    subtitles: processedSubtitles,
    createDate: new Date().toISOString()
  };

  const newsRef = await newsRepository.createNews(processedNewsData);
  return { id: newsRef.id, ...processedNewsData };
};

const updateNews = async (id, newsData) => {
  // Handle image uploads for updated subtitles
  const processedSubtitles = await Promise.all(newsData.subtitles.map(async (subtitle) => {
    if (subtitle.imageUrl && subtitle.imageUrl !== 'none' && subtitle.imageUrl.startsWith('data:')) {
      // Upload image to Cloudinary if it's a base64 string
      const cloudinaryUrl = await uploadToCloudinary(subtitle.imageUrl);
      return { ...subtitle, imageUrl: cloudinaryUrl };
    }
    return subtitle;
  }));

  const processedNewsData = {
    ...newsData,
    subtitles: processedSubtitles,
    updateDate: new Date().toISOString()
  };

  await newsRepository.updateNews(id, processedNewsData);
  return { id, ...processedNewsData };
};

const deleteNews = async (id) => {
  // Get the news item first to clean up Cloudinary images
  const news = await getNewsById(id);
  if (news) {
    // Delete images from Cloudinary
    await Promise.all(news.subtitles.map(async (subtitle) => {
      if (subtitle.imageUrl && subtitle.imageUrl !== 'none' && subtitle.imageUrl.includes('cloudinary.com')) {
        try {
          const publicId = subtitle.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`kindergarten/news/${publicId}`);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }));
  }
  
  await newsRepository.deleteNews(id);
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
}; 