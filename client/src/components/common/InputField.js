import React from 'react';
import { TextField, FormControl } from '@mui/material';

const InputField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false,
    multiline = false,
    rows,
    select = false,
    SelectProps,
    InputLabelProps,
    children
}) => {
    return (
        <FormControl fullWidth>
            <TextField
                label={label}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                error={!!error}
                helperText={error}
                required={required}
                disabled={disabled}
                multiline={multiline}
                rows={rows}
                select={select}
                SelectProps={SelectProps}
                InputLabelProps={InputLabelProps}
                variant="outlined"
                margin="normal"
            >
                {children}
            </TextField>
        </FormControl>
    );
};

export default InputField; 