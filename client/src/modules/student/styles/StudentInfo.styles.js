import { alpha } from '@mui/material/styles';

export const getStyles = (theme) => ({
    detailRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&:last-child': {
            borderBottom: 'none'
        }
    },
    label: {
        width: '200px',
        flexShrink: 0,
        color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
        fontWeight: 600
    },
    value: {
        flex: 1,
        color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#1e293b'
    },
    sectionTitle: {
        color: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9',
        marginBottom: theme.spacing(3),
        fontWeight: 600,
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: '40px',
            height: '2px',
            backgroundColor: theme.palette.mode === 'dark' ? '#3498db' : '#2980b9'
        }
    },
    section: {
        marginBottom: theme.spacing(4)
    }
}); 