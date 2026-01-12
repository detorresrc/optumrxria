import React from 'react';
import { Box, Button } from '@mui/material';

/**
 * Props for the NavigationFooter component
 */
export interface NavigationFooterProps {
  /** Callback when Next button is clicked */
  onNext: () => void;
  /** Callback when Go Back button is clicked */
  onBack: () => void;
  /** Label for the Next button. Defaults to "Next" */
  nextLabel?: string;
  /** Label for the Go Back button. Defaults to "Go Back" */
  backLabel?: string;
  /** Whether to show the Go Back button. Defaults to true */
  showBack?: boolean;
  /** Whether to show the Next button. Defaults to true */
  showNext?: boolean;
  /** Whether the Next button is disabled. Defaults to false */
  nextDisabled?: boolean;
}

/**
 * NavigationFooter component displays navigation buttons for multi-step forms.
 * 
 * Requirements:
 * - 9.1: Display "Next" primary button aligned to the right
 * - 9.2: Display "Go Back" tertiary button to the left of Next button
 * - 9.3: Next button has dark blue background (#002677) with white text and 46px border radius
 * - 9.4: Go Back button has white background with dark gray border (#323334) and 46px border radius
 * - 9.7: Footer bar with top border (#CBCCCD) and 4px vertical padding, 84px horizontal padding
 * - 9.8: Button group has 10px gap between buttons
 */
export const NavigationFooter: React.FC<NavigationFooterProps> = ({
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Go Back',
  showBack = true,
  showNext = true,
  nextDisabled = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '10px', // Requirements 9.8: 10px gap between buttons
        borderTop: '1px solid #CBCCCD', // Requirements 9.7: top border
        padding: '4px 84px', // Requirements 9.7: 4px vertical, 84px horizontal padding
        backgroundColor: '#FFFFFF',
        marginTop: 3,
        marginLeft: '-84px', // Extend to full width
        marginRight: '-84px',
        width: 'calc(100% + 168px)', // Account for negative margins
      }}
    >
      {/* Go Back button - Requirements 9.2, 9.4 */}
      {showBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            backgroundColor: '#FFFFFF',
            color: '#323334',
            borderColor: '#323334', // Requirements 9.4: dark gray border
            borderRadius: '46px', // Requirements 9.4: 46px border radius
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#F5F5F5',
              borderColor: '#323334',
            },
          }}
        >
          {backLabel}
        </Button>
      )}

      {/* Next button - Requirements 9.1, 9.3 */}
      {showNext && (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={nextDisabled}
          sx={{
            backgroundColor: '#002677', // Requirements 9.3: dark blue background
            color: '#FFFFFF',
            borderRadius: '46px', // Requirements 9.3: 46px border radius
            padding: '10px 24px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#001a5c',
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: '#CBCCCD',
              color: '#FFFFFF',
            },
          }}
        >
          {nextLabel}
        </Button>
      )}
    </Box>
  );
};

export default NavigationFooter;
