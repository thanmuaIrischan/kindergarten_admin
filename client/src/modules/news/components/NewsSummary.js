import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Link,
  Paper,
  Chip
} from '@mui/material';
import {
  Summarize as SummarizeIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const NewsSummary = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [newsGroups, setNewsGroups] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const generateSummary = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get today's news
      const response = await axios.get(`${API_URL}/news`);
      const today = new Date();
      const todayNews = response.data.filter(news => {
        const newsDate = new Date(news.createDate);
        return newsDate.toDateString() === today.toDateString();
      });

      if (todayNews.length === 0) {
        setSummary('No news articles found for today.');
        setNewsGroups([]);
        return;
      }

      // Group news by type
      const newsByType = todayNews.reduce((acc, news) => {
        if (!acc[news.type]) {
          acc[news.type] = [];
        }
        acc[news.type].push(news);
        return acc;
      }, {});

      // Format news groups for display
      const formattedGroups = Object.entries(newsByType).map(([type, news]) => ({
        type,
        news: news.map(item => ({
          id: item.id,
          title: item.title,
          description: item.subtitles?.[0]?.content?.substring(0, 100) + (item.subtitles?.[0]?.content?.length > 100 ? '...' : '') || ''
        }))
      }));

      setNewsGroups(formattedGroups);

      // Generate summary text
      let summaryText = `Daily News Summary (${format(today, 'MMMM dd, yyyy', { locale: enUS })})\n\n`;
      formattedGroups.forEach(({ type, news }) => {
        summaryText += `${type.toUpperCase()}:\n`;
        news.forEach(item => {
          summaryText += `- ${item.title}\n`;
          if (item.description) {
            summaryText += `  ${item.description}\n`;
          }
          summaryText += '\n';
        });
      });

      setSummary(summaryText);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate news summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    setOpen(true);
    if (!summary) {
      generateSummary();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewsClick = async (newsId) => {
    try {
      const response = await axios.get(`${API_URL}/news/${newsId}`);
      setSelectedNews(response.data);
      setDetailOpen(true);
    } catch (error) {
      console.error('Error fetching news details:', error);
      setError('Failed to load news details. Please try again.');
    }
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedNews(null);
  };

  return (
    <>
      <Tooltip title="Generate Daily News Summary">
        <Button
          variant="contained"
          startIcon={<SummarizeIcon />}
          onClick={handleOpen}
          sx={{
            ml: 1,
            borderRadius: 2,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 3,
            }
          }}
        >
          Daily Summary
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <SummarizeIcon />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Daily News Summary
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={generateSummary}
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                mr: 1
              }}
            >
              Refresh Summary
            </Button>
            {summary && (
              <Button
                variant="outlined"
                startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                onClick={handleCopy}
                sx={{ 
                  borderRadius: 2
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : newsGroups.length > 0 ? (
            <Stack spacing={3}>
              {newsGroups.map(({ type, news }) => (
                <Paper key={type} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 500 }}>
                    {type.toUpperCase()}
                  </Typography>
                  <Stack spacing={2}>
                    {news.map((item) => (
                      <Paper 
                        key={item.id} 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'primary.50',
                            cursor: 'pointer'
                          }
                        }}
                        onClick={() => handleNewsClick(item.id)}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <ArticleIcon color="primary" sx={{ mt: 0.5 }} />
                          <Box>
                            <Link
                              component="button"
                              variant="subtitle1"
                              underline="hover"
                              color="inherit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNewsClick(item.id);
                              }}
                              sx={{ 
                                textAlign: 'left',
                                fontWeight: 500,
                                display: 'block',
                                mb: 0.5
                              }}
                            >
                              {item.title}
                            </Link>
                            {item.description && (
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary" align="center">
              Click "Refresh Summary" to generate a summary of today's news.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailOpen}
        onClose={handleDetailClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleIcon />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              News Detail
            </Typography>
          </Stack>
          <IconButton
            onClick={handleDetailClose}
            sx={{ color: 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedNews && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {selectedNews.title}
                </Typography>
                <Typography variant="subtitle1" color="primary.main" gutterBottom>
                  {selectedNews.type}
                </Typography>
                {selectedNews.tags && selectedNews.tags.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {selectedNews.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Stack>
                )}
              </Box>

              <Stack spacing={2}>
                {selectedNews.subtitles.map((subtitle, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    {subtitle.subtitleName !== 'none' && (
                      <Typography variant="h6" gutterBottom>
                        {subtitle.subtitleName}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {subtitle.content}
                    </Typography>
                    {subtitle.imageUrl && subtitle.imageUrl !== 'none' && (
                      <Box
                        component="img"
                        src={subtitle.imageUrl}
                        alt={subtitle.subtitleName || `Image ${index + 1}`}
                        sx={{
                          mt: 2,
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: 1
                        }}
                      />
                    )}
                  </Paper>
                ))}
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Published on: {new Date(selectedNews.createDate).toLocaleString()}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsSummary; 