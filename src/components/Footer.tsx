import React from 'react';
import { Box, Typography } from '@mui/material';

interface FooterProps {
  copyrightYear?: number;
}

export const Footer: React.FC<FooterProps> = ({
  copyrightYear = new Date().getFullYear(),
}) => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E5E6',
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: '84px',
          py: 2,
        }}
      >
        {/* Copyright */}
        <Typography
          sx={{
            fontFamily: '"Enterprise Sans VF", sans-serif',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.2,
            color: '#6E7072',
          }}
        >
          © {copyrightYear} Optum, Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
