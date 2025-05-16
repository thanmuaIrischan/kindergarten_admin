import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Fab,
  Drawer,
  Avatar,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const NewsChat = ({ todayNews }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatNewsContext = () => {
    if (!todayNews || todayNews.length === 0) return '';

    let context = 'Today\'s news summary:\n';
    const newsByType = todayNews.reduce((acc, news) => {
      if (!acc[news.type]) acc[news.type] = [];
      acc[news.type].push(news);
      return acc;
    }, {});

    Object.entries(newsByType).forEach(([type, news]) => {
      context += `\n${type.toUpperCase()}:\n`;
      news.forEach(item => {
        context += `- ${item.title}\n`;
        if (item.subtitles?.[0]?.content) {
          context += `  ${item.subtitles[0].content.substring(0, 100)}...\n`;
        }
      });
    });

    return context;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const newsContext = formatNewsContext();
      const response = await axios.post(`${API_URL}/news/chat`, {
        messages: [
          {
            role: 'system',
            content: `You are a helpful news assistant. You help discuss and analyze news articles. 
            Here is the context of today's news:\n\n${newsContext}\n\nPlease help discuss these news items, 
            answer questions about them, and provide insights. If asked about news not in the context, 
            politely explain that you can only discuss today's news articles listed above.`
          },
          ...messages,
          { role: 'user', content: userMessage }
        ]
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Tooltip title="Chat about today's news" placement="left">
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000
          }}
        >
          <ChatIcon />
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 400,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <BotIcon />
              </Avatar>
              <Typography variant="h6">News Assistant</Typography>
            </Stack>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                    ...(message.role === 'assistant' && {
                      borderTopLeftRadius: 0,
                    }),
                    ...(message.role === 'user' && {
                      borderTopRightRadius: 0,
                    }),
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                  }}
                >
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about today's news..."
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                ),
                sx: { 
                  alignItems: 'flex-end',
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NewsChat; 