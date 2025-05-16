import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import NewsList from './components/NewsList';
import NewsSearch from './components/NewsSearch';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('all');
  const [newsTypes, setNewsTypes] = useState(['all']);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/news`);
        const newsData = response.data;
        
        // Extract unique news types
        const types = ['all', ...new Set(newsData.map(item => item.type))];
        setNewsTypes(types);
        
        setNews(newsData);
        setFilteredNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      filterNewsByTab(currentTab);
      return;
    }

    const searchFiltered = news.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (currentTab !== 'all') {
      const tabFiltered = searchFiltered.filter(item => item.type === currentTab);
      setFilteredNews(tabFiltered);
    } else {
      setFilteredNews(searchFiltered);
    }
  };

  const filterNewsByTab = (tab) => {
    if (tab === 'all') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item => item.type === tab);
      setFilteredNews(filtered);
    }
  };

  const handleTabChange = (event, newTab) => {
    setCurrentTab(newTab);
    filterNewsByTab(newTab);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tin tức
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <NewsSearch onSearch={handleSearch} />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="news categories tabs"
        >
          {newsTypes.map((type) => (
            <Tab 
              key={type} 
              value={type} 
              label={type === 'all' ? 'Tất cả' : type}
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : (
        <NewsList news={filteredNews} />
      )}
    </Container>
  );
};

export default News; 