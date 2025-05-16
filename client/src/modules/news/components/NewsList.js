import React from 'react';
import { Grid, Typography } from '@mui/material';
import NewsCard from './NewsCard';

const NewsList = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" align="center">
        Không có tin tức nào được tìm thấy.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {news.map((newsItem) => (
        <Grid item xs={12} md={6} key={newsItem.id}>
          <NewsCard news={newsItem} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NewsList; 