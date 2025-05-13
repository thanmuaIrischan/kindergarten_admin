import React from 'react';
import { TextField, InputAdornment, useTheme } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { validationHelpers } from './constants';

const InputField = ({ name, value, error, onBlur, ...props }) => {
    const theme = useTheme();
    const isValid = value && !error && !validationHelpers.isEmptyOrWhitespace(value) && !validationHelpers.isOnlySpaces(value);
    const isStudentID = name === 'studentID';

    return (
        <TextField
            {...props}
            name={name}
            value={value}
            error={!!error}
            onBlur={onBlur}
            fullWidth
            variant="outlined"
            InputProps={{
                ...props.InputProps,
                endAdornment: (
                    <InputAdornment position="end">
                        {isValid && !isStudentID && <CheckCircleIcon color="success" />}
                        {props.InputProps?.endAdornment}
                    </InputAdornment>
                )
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                },
            }}
        />
    );
};

export default InputField; 