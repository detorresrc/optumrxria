import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface InfoBannerProps {
  title: string;
  message: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ title, message }) => {
  return (
    <Alert
      severity="info"
      icon={
        <InfoOutlinedIcon
          sx={{
            color: '#002677',
            fontSize: '24px',
          }}
        />
      }
      sx={{
        backgroundColor: '#E5F8FB',
        border: '1px solid #002677',
        borderRadius: '12px',
        padding: '16px',
        '& .MuiAlert-icon': {
          marginRight: '8px',
          padding: 0,
          alignItems: 'flex-start',
          paddingTop: '2px',
        },
        '& .MuiAlert-message': {
          padding: '2px 0',
        },
      }}
    >
      <Box>
        <AlertTitle
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#002677',
            marginBottom: '4px',
            lineHeight: 1.4,
          }}
        >
          {title}
        </AlertTitle>
        <Box
          component="span"
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4,
          }}
        >
          {message}
        </Box>
      </Box>
    </Alert>
  );
};

export default InfoBanner;
