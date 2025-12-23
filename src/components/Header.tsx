import React from 'react';
import { Box, Typography, Badge, Avatar } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import optumLogo from '../assets/optum-logo.svg';

interface NavItem {
  label: string;
  active?: boolean;
  href?: string;
}

interface HeaderProps {
  userName?: string;
  lastUpdated?: string;
  notificationCount?: number;
  navItems?: NavItem[];
  activeNavItem?: string;
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Clients', href: '/clients', active: true },
  { label: 'Products', href: '/products' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Invoices', href: '/invoices' },
  { label: 'Reports', href: '/reports' },
  { label: 'File Center', href: '/file-center' },
];

export const Header: React.FC<HeaderProps> = ({
  userName = 'Mr. Smith',
  lastUpdated = '11/02/2025',
  notificationCount = 1,
  navItems = defaultNavItems,
  activeNavItem = 'Clients',
}) => {
  // Get user initials for avatar
  const getInitials = (name: string): string => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px 10px 0 0',
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '84px',
          py: '14px',
          pb: '12px',
          borderBottom: '1px solid #E5E5E6',
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            component="img"
            src={optumLogo}
            alt="Optum Logo"
            sx={{
              width: 127,
              height: 25,
            }}
          />
          <Box
            sx={{
              width: '1px',
              height: 30,
              backgroundColor: '#CBCCCD',
            }}
          />
          <Typography
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.2,
              color: '#002677',
            }}
          >
            Centralized Operations & Revenue Engine
          </Typography>
        </Box>

        {/* User Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Badge
            badgeContent={notificationCount}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#C40000',
                color: '#FFFFFF',
                fontFamily: '"UHC2020 Sans", sans-serif',
                fontWeight: 700,
                fontSize: 12,
                minWidth: 18,
                height: 18,
                borderRadius: '100px',
              },
            }}
          >
            <Avatar
              sx={{
                width: 52,
                height: 52,
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBCCCD',
                color: '#889599',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {getInitials(userName)}
            </Avatar>
          </Badge>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: '#0C55B8',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {userName}
              </Typography>
              <KeyboardArrowRightIcon
                sx={{
                  fontSize: 24,
                  color: '#4B4D4F',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: 1.2,
                color: '#6E7072',
              }}
            >
              Last Updated: {lastUpdated}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          px: '84px',
          pt: '18px',
          borderBottom: '1px solid #E5E5E6',
        }}
      >
        {navItems.map((item) => {
          const isActive = item.active || item.label === activeNavItem;
          return (
            <Box
              key={item.label}
              component="a"
              href={item.href}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pb: '18px',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #002677' : '2px solid transparent',
                cursor: 'pointer',
                '&:hover': {
                  borderBottom: isActive ? '2px solid #002677' : '2px solid #CBCCCD',
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: '#4B4D4F',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Header;
