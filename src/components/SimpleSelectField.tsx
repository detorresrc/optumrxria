import React from 'react';
import { Box, Typography, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SimpleSelectFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  sx?: object;
}

export const SimpleSelectField: React.FC<SimpleSelectFieldProps> = ({
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  children,
  sx = {}
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ...sx }}>
      <Typography sx={{ 
        fontFamily: '"Enterprise Sans VF", sans-serif',
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: 1.4,
        color: '#323334'
      }}>
        {label}
        {required && <Typography component="span" sx={{ color: '#C40000', ml: 0.5 }}>*</Typography>}
      </Typography>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          bgcolor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4B4D4F',
            borderWidth: '1px'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4B4D4F'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4B4D4F',
            borderWidth: '1px'
          },
          '& .MuiSelect-select': {
            padding: '10px 12px',
            fontSize: '16px',
            lineHeight: 1.4,
            fontFamily: '"Enterprise Sans VF", sans-serif',
            fontWeight: 400,
            color: '#323334'
          },
          borderRadius: '4px',
          height: '40px'
        }}
      >
        {children}
      </Select>
    </Box>
  );
};
