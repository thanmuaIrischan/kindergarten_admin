import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Grid,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Title as TitleIcon,
  Category as CategoryIcon,
  Label as LabelIcon,
  SubtitlesOutlined as SubtitleIcon,
  Description as DescriptionIcon,
  AddPhotoAlternate as AddPhotoIcon
} from '@mui/icons-material';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_WIDTH = 800; // Maximum width for images
const IMAGE_QUALITY = 0.5; // Image compression quality (0.5 = 50%)
const MAX_INITIAL_FILE_SIZE = 10 * 1024 * 1024; // 10MB for initial file size check

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions if image is too wide
        if (width > MAX_IMAGE_WIDTH) {
          height = Math.round((height * MAX_IMAGE_WIDTH) / width);
          width = MAX_IMAGE_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const NewsForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    type: '',
    tags: [],
    subtitles: [{ subtitleName: '', content: '', imageUrl: 'none' }]
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubtitleChange = (index, field, value) => {
    const newSubtitles = [...formData.subtitles];
    newSubtitles[index] = {
      ...newSubtitles[index],
      [field]: value
    };
    setFormData({
      ...formData,
      subtitles: newSubtitles
    });
  };

  const handleAddSubtitle = () => {
    setFormData({
      ...formData,
      subtitles: [
        ...formData.subtitles,
        { subtitleName: '', content: '', imageUrl: 'none' }
      ]
    });
  };

  const handleRemoveSubtitle = (index) => {
    const newSubtitles = formData.subtitles.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subtitles: newSubtitles
    });
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageSelect = async (e, index) => {
    const file = e.target.files[0];
    setUploadError('');

    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Vui lòng chọn file hình ảnh');
          return;
        }

        // Early file size check
        if (file.size > MAX_INITIAL_FILE_SIZE) {
          setUploadError('File quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 10MB.');
          return;
        }

        // Compress image
        const compressedImage = await compressImage(file);
        
        // Check compressed size
        const base64Size = Math.round((compressedImage.length * 3) / 4);
        if (base64Size > MAX_FILE_SIZE) {
          setUploadError('Kích thước file vẫn quá lớn sau khi nén. Vui lòng chọn ảnh có kích thước nhỏ hơn.');
          return;
        }

        handleSubtitleChange(index, 'imageUrl', compressedImage);
        setImagePreview(compressedImage);
        setSelectedSubtitleIndex(index);
      } catch (error) {
        console.error('Error processing image:', error);
        setUploadError('Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate required fields
    if (!formData.title.trim()) {
      setUploadError('Vui lòng nhập tiêu đề');
      return;
    }
    if (!formData.type.trim()) {
      setUploadError('Vui lòng nhập loại tin tức');
      return;
    }

    // Validate subtitles
    const hasEmptyContent = formData.subtitles.some(
      subtitle => !subtitle.content.trim()
    );
    if (hasEmptyContent) {
      setUploadError('Vui lòng nhập nội dung cho tất cả các phần');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tiêu đề"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Loại tin tức"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            disabled={loading}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <LabelIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Tags
                </Typography>
              </Stack>
              
              <Box component="form" onSubmit={handleAddTag}>
                <TextField
                  fullWidth
                  label="Thêm tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={handleAddTag} 
                          disabled={!tagInput.trim() || loading}
                          color="primary"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.50' 
                            } 
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(formData.tags || []).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => !loading && handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiChip-deleteIcon': {
                        color: 'error.main',
                        '&:hover': { color: 'error.dark' }
                      }
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card 
        variant="outlined" 
        sx={{ 
          borderRadius: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0 // Important for proper scrolling
        }}
      >
        <CardContent 
          sx={{ 
            flex: 1,
            overflowY: 'auto',
            '&:last-child': { pb: 2 } // Override MUI default padding
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <DescriptionIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Nội dung
            </Typography>
          </Stack>

          {formData.subtitles.map((subtitle, index) => (
            <Paper 
              key={index} 
              elevation={0}
              sx={{ 
                mb: 3, 
                p: 3, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 0 0 1px rgba(25, 118, 210, 0.1)'
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Tiêu đề phụ"
                    value={subtitle.subtitleName}
                    onChange={(e) => handleSubtitleChange(index, 'subtitleName', e.target.value)}
                    disabled={loading}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SubtitleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Thêm ảnh">
                    <IconButton
                      component="label"
                      color="primary"
                      disabled={loading}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'primary.50' 
                        } 
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, index)}
                      />
                      <AddPhotoIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa phần này">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveSubtitle(index)}
                      disabled={formData.subtitles.length === 1 || loading}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'error.50' 
                        } 
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nội dung"
                value={subtitle.content}
                onChange={(e) => handleSubtitleChange(index, 'content', e.target.value)}
                required
                disabled={loading}
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              {subtitle.imageUrl && subtitle.imageUrl !== 'none' && (
                <Box sx={{ mt: 2, position: 'relative' }}>
                  <img
                    src={subtitle.imageUrl}
                    alt={`Preview ${index}`}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => !loading && handleSubtitleChange(index, 'imageUrl', 'none')}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      }
                    }}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Paper>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddSubtitle}
            variant="outlined"
            disabled={loading}
            sx={{ 
              mt: 2,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'primary.50'
              }
            }}
          >
            Thêm nội dung
          </Button>
        </CardContent>
      </Card>

      {uploadError && (
        <Alert 
          severity="error" 
          onClose={() => setUploadError('')}
          sx={{ borderRadius: 2, mt: 2 }}
        >
          {uploadError}
        </Alert>
      )}

      <Box 
        sx={{ 
          mt: 2,
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
          mx: -3, // Compensate for parent padding
          width: 'auto',
          marginLeft: -3,
          marginRight: -3
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ 
            height: 48,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            initialData ? 'Cập nhật' : 'Tạo mới'
          )}
        </Button>
      </Box>

      <Dialog
        open={!!imagePreview}
        onClose={() => !loading && setImagePreview(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            Xem trước hình ảnh
          </Typography>
        </DialogTitle>
        <DialogContent>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px'
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => !loading && setImagePreview(null)}
            variant="outlined"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsForm; 