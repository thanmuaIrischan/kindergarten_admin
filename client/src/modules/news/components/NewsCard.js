import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardHeader,
  Avatar
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card sx={{ mb: 2, height: '100%' }}>
      <CardHeader
        title={news.title}
        subheader={formatDate(news.createDate)}
      />
      <CardContent>
        {news.subtitles.map((subtitle, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {subtitle.subtitleName !== 'none' && (
              <Typography variant="h6" gutterBottom>
                {subtitle.subtitleName}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" paragraph>
              {subtitle.content}
            </Typography>
            {subtitle.imageUrl !== 'none' && (
              <Box
                component="img"
                src={subtitle.imageUrl}
                alt={subtitle.subtitleName}
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  mt: 1,
                  mb: 1
                }}
              />
            )}
          </Box>
        ))}
        
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {news.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsCard; 