import React from 'react';
import { Paper, Typography, Stack, useTheme, alpha } from '@mui/material';

const FormSection = ({ title, children }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                mb: 3,
                backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.1)
                    : alpha(theme.palette.background.paper, 0.9),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '4px 0 0 4px'
                }
            }}
        >
            <Typography
                variant="h6"
                color="primary"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    mb: 3,
                    pl: 1
                }}
            >
                {title}
            </Typography>
            <Stack spacing={3}>
                {children}
            </Stack>
        </Paper>
    );
};

export default FormSection; 