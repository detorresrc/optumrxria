import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import optumLogo from '../assets/optum-logo.svg';

const SingleSignOn: React.FC = () => {
  const handleSignIn = () => {
    // Handle SSO sign-in logic here
    console.log('Sign in with Single Sign On clicked');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '10px',
          width: '100%',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '68px',
            padding: '14px 84px 12px 28px',
            borderBottom: '1px solid',
            borderBottomColor: 'grey.200',
            minHeight: '50px', // Ensure consistent header height
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '24px',
              }}
            >
              <img
                src={optumLogo}
                alt="Optum Logo"
                style={{
                  width: '123px',
                  height: '24px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Divider
              orientation="vertical"
              sx={{
                height: '30px',
                borderColor: 'grey.300',
                margin: '0 7px', // Add margin for better spacing
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'primary.main',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Centralized Operations & Revenue Engine
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          minHeight: 'calc(100vh - 200px)', // Account for header and footer
        }}
      >
        {/* Card Container with proper positioning */}
        <Box
          sx={{
            position: 'relative',
            width: '509px',
            maxWidth: '100%',
          }}
        >
          <Card
            sx={{
              width: '100%',
              minHeight: '254px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent
              sx={{
                padding: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                '&:last-child': {
                  paddingBottom: 0,
                },
              }}
            >
              {/* Heading Section - matches Figma layout_1MY3NA */}
              <Box
                sx={{
                  padding: '32px 24px 16px 24px', // Top padding 32px, sides 24px, bottom 16px
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '23px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: 'text.primary',
                    textAlign: 'left',
                    margin: 0,
                  }}
                >
                  Welcome to Centralized Operations & Revenue Engine
                </Typography>
              </Box>

              {/* Body Content Section - matches Figma layout_P9UN6Z */}
              <Box
                sx={{
                  padding: '0 24px 32px 24px', // Sides 24px, bottom 32px for gap
                  flex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: 'text.secondary',
                    margin: 0,
                  }}
                >
                  Authenticate using single sign on to get access to CORE application and its features.
                </Typography>
              </Box>

              {/* Sign In Button Section - matches Figma button positioning */}
              <Box
                sx={{
                  padding: '0 24px 32px 24px', // Bottom padding 32px to match card padding
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSignIn}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '999px',
                    padding: '12px 24px', // Increased padding for better proportion
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    minHeight: '48px', // Ensure consistent button height
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Sign in with Single Sign On
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 16px',
          minHeight: '60px', // Ensure consistent footer height
          backgroundColor: 'transparent',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: '12.64px',
            fontWeight: 400,
            lineHeight: 1.27,
            color: 'grey.700',
            textAlign: 'center',
            margin: 0,
          }}
        >
          © 2025 Optum, Inc. All rights reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default SingleSignOn;