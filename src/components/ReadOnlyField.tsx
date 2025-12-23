import React from 'react';
import { Box, Typography } from '@mui/material';

interface ReadOnlyFieldProps {
  label: string;
  value: string | undefined | null;
  placeholder?: string;
}

export const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({
  label,
  value,
  placeholder = '-',
}) => {
  const displayValue = value && value.trim() !== '' ? value : placeholder;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Typography
        component="span"
        sx={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.4,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#4B4D4F',
          lineHeight: 1.4,
        }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

export default ReadOnlyField;
