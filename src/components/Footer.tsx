import React from 'react';
import { Box, Typography, Link } from '@mui/material';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
  copyrightYear?: number;
}

const defaultLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Contact Us', href: '/contact' },
];

export const Footer: React.FC<FooterProps> = ({
  links = defaultLinks,
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
          justifyContent: 'space-between',
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

        {/* Links */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {links.map((link, index) => (
            <React.Fragment key={link.label}>
              <Link
                href={link.href}
                underline="hover"
                sx={{
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: 1.2,
                  color: '#0C55B8',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {link.label}
              </Link>
              {index < links.length - 1 && (
                <Box
                  sx={{
                    width: '1px',
                    height: 12,
                    backgroundColor: '#CBCCCD',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
