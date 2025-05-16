import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardHeader,
  Avatar,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Tooltip,
  CardActions,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as TimeIcon,
  Label as LabelIcon
} from '@mui/icons-material';

const NewsCard = ({ news, onDelete, onEdit }) => {
  const [imageLoading, setImageLoading] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleImageLoad = (index) => {
    setImageLoading(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handleImageError = (index) => {
    setImageLoading(prev => ({
      ...prev,
      [index]: false
    }));
    // You could also set a fallback image here if needed
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(news.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {news.title}
          </Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center">
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(news.createDate)}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ flex: 1, pt: 0 }}>
        {news.subtitles.map((subtitle, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {subtitle.subtitleName !== 'none' && (
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                {subtitle.subtitleName}
              </Typography>
            )}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              paragraph
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {subtitle.content}
            </Typography>
            {subtitle.imageUrl && subtitle.imageUrl !== 'none' && (
              <Box sx={{ position: 'relative', width: '100%', minHeight: '200px', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                {imageLoading[index] !== false && (
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height={200} 
                    sx={{ position: 'absolute', top: 0, left: 0 }}
                  />
                )}
                <Box
                  component="img"
                  src={subtitle.imageUrl}
                  alt={subtitle.subtitleName || `News image ${index + 1}`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
        
        {news.tags && news.tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LabelIcon fontSize="small" color="action" />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {news.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 1.5 }}
                  />
                ))}
              </Box>
            </Stack>
          </Box>
        )}
      </CardContent>

      <Divider sx={{ mt: 'auto' }} />
      
      <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="Chỉnh sửa">
          <IconButton 
            onClick={() => onEdit(news)} 
            color="primary"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'primary.50' 
              } 
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa">
          <IconButton 
            onClick={handleDeleteClick} 
            color="error"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'error.50' 
              } 
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Xác nhận xóa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tin tức "{news.title}" không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'error.dark'
              }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default NewsCard; 