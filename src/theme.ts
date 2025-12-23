import { createTheme } from '@mui/material/styles';

// Create a custom theme matching the Figma design
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#002677', // button/color/primary/base from Figma
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF612B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAFCFF', // fill_HL91RE from Figma
      paper: '#FFFFFF', // card/color/background/base
    },
    text: {
      primary: '#323334', // card/color/text/heading
      secondary: '#4B4D4F', // card/color/text/content
    },
    grey: {
      200: '#E5E5E6', // Neutral/neutral-20
      300: '#CBCCCD', // stroke color
      700: '#4B4D4F', // Text Colors/Body (Neutral 70)
    },
  },
  typography: {
    fontFamily: '"Enterprise Sans VF", "Optum Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '23px',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#323334',
    },
    h2: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#002677',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#4B4D4F',
    },
    body2: {
      fontSize: '12.64px',
      fontWeight: 400,
      lineHeight: 1.27,
      color: '#4B4D4F',
    },
    button: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: 1.4,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
          padding: '8px 24px',
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #CBCCCD',
          borderRadius: '8px',
          boxShadow: 'none',
        },
      },
    },
  },
});