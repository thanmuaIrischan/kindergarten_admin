import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import NewsCard from './NewsCard';

const NewsList = ({ news, onDelete, onEdit }) => {
  if (!news || news.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 500
          }}
        >
          No news found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {news.map((newsItem) => (
        <Grid item xs={12} md={6} key={newsItem.id}>
          <NewsCard 
            news={newsItem} 
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default NewsList; 