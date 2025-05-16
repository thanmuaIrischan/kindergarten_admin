import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Button, Dialog, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import NewsList from './components/NewsList';
import NewsSearch from './components/NewsSearch';
import NewsForm from './components/NewsForm';
import { Add as AddIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const News = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('all');
  const [newsTypes, setNewsTypes] = useState(['all']);
  const [openForm, setOpenForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/news`);
      const newsData = response.data;
      
      // Extract unique news types
      const types = ['all', ...new Set(newsData.map(item => item.type))];
      setNewsTypes(types);
      
      setNews(newsData);
      setFilteredNews(newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
      showSnackbar('Không thể tải tin tức. Vui lòng thử lại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      filterNewsByTab(currentTab);
      return;
    }

    const searchFiltered = news.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCreateNews = async (formData) => {
    try {
      setFormLoading(true);

      // Validate required fields
      if (!formData.title || !formData.type) {
        showSnackbar('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
      }

      // Process subtitles
      const processedSubtitles = formData.subtitles.map(subtitle => ({
        ...subtitle,
        subtitleName: subtitle.subtitleName || 'none',
        imageUrl: subtitle.imageUrl || 'none'
      }));

      const newsData = {
        ...formData,
        subtitles: processedSubtitles,
        createDate: new Date().toISOString(),
        tags: formData.tags || []
      };

      await axios.post(`${API_URL}/news`, newsData);
      await fetchNews();
      setOpenForm(false);
      showSnackbar('Tạo tin tức thành công!');
    } catch (error) {
      console.error('Error creating news:', error);
      showSnackbar(
        error.response?.data?.message || 'Không thể tạo tin tức. Vui lòng thử lại!',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`${API_URL}/news/${id}`);
      await fetchNews();
      showSnackbar('Xóa tin tức thành công!');
    } catch (error) {
      console.error('Error deleting news:', error);
      showSnackbar(
        error.response?.data?.message || 'Không thể xóa tin tức. Vui lòng thử lại!',
        'error'
      );
    }
  };

  const handleEditNews = async (formData) => {
    try {
      setFormLoading(true);

      // Validate required fields
      if (!formData.title || !formData.type) {
        showSnackbar('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
      }

      // Process subtitles
      const processedSubtitles = formData.subtitles.map(subtitle => ({
        ...subtitle,
        subtitleName: subtitle.subtitleName || 'none',
        imageUrl: subtitle.imageUrl || 'none'
      }));

      const newsData = {
        ...formData,
        subtitles: processedSubtitles,
        tags: formData.tags || []
      };

      await axios.put(`${API_URL}/news/${editingNews.id}`, newsData);
      await fetchNews();
      setOpenForm(false);
      setEditingNews(null);
      showSnackbar('Cập nhật tin tức thành công!');
    } catch (error) {
      console.error('Error updating news:', error);
      showSnackbar(
        error.response?.data?.message || 'Không thể cập nhật tin tức. Vui lòng thử lại!',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenEdit = (news) => {
    setEditingNews(news);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    if (!formLoading) {
      setOpenForm(false);
      setEditingNews(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tin tức
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Thêm tin tức
        </Button>
      </Box>
      
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
        <NewsList 
          news={filteredNews} 
          onDelete={handleDeleteNews}
          onEdit={handleOpenEdit}
        />
      )}

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            height: 'calc(100vh - 64px)',
            margin: '32px 0'
          }
        }}
      >
        <Box 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editingNews ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            p: 3
          }}>
            <NewsForm 
              onSubmit={editingNews ? handleEditNews : handleCreateNews}
              initialData={editingNews}
              loading={formLoading}
            />
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default News; 