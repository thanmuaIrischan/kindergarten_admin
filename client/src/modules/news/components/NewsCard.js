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
import { enUS } from 'date-fns/locale';
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
      return format(date, 'dd MMMM yyyy HH:mm', { locale: enUS });
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

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
        border: 1,
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 4px 20px rgba(0,0,0,0.5)' 
            : '0 4px 20px rgba(0,0,0,0.12)',
          borderColor: 'primary.main',
        }
      }}
    >
      <CardHeader
        title={
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 1,
              color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main'
            }}
          >
            {news.title}
          </Typography>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center">
            <TimeIcon fontSize="small" color="action" />
            <Typography 
              variant="body2" 
              sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? 'grey.400' : 'text.secondary'
              }}
            >
              {formatDate(news.createDate)}
            </Typography>
          </Stack>
        }
      />
      
      <CardContent sx={{ flex: 1, pt: 0 }}>
        {news.subtitles.map((subtitle, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {subtitle.subtitleName !== 'none' && (
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 500, 
                  mb: 1,
                  color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'
                }}
              >
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
                textOverflow: 'ellipsis',
                color: (theme) => theme.palette.mode === 'dark' ? 'grey.400' : 'text.secondary'
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
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
                    }}
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
                    boxShadow: (theme) => theme.palette.mode === 'dark' 
                      ? '0 2px 8px rgba(0,0,0,0.4)' 
                      : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
            )}
          </Box>
        ))}

        {news.tags && news.tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            {news.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.selected' : 'grey.100',
                  color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.200',
                  }
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ 
        borderTop: 1, 
        borderColor: 'divider',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
        px: 2 
      }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(news)}
          sx={{
            color: (theme) => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'primary.50',
            }
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
          sx={{
            color: (theme) => theme.palette.mode === 'dark' ? 'error.light' : 'error.main',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'error.dark' : 'error.50',
            }
          }}
        >
          Delete
        </Button>
      </CardActions>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'background.default'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: (theme) => theme.palette.mode === 'dark' ? 'error.light' : 'error.main'
        }}>
          Delete News
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this news article?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'error.dark' : 'error.main',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'error.main' : 'error.dark',
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default NewsCard; 