import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';

interface BulkActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  itemCount?: number;
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes, Assign',
  cancelText = 'No, Cancel',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
        }
      }}
    >
      {/* Header with Title and Close Button */}
      <DialogTitle sx={{ 
        p: 0, 
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <Typography sx={{
          fontFamily: '"Enterprise Sans VF", sans-serif',
          fontWeight: 700,
          fontSize: '20px',
          lineHeight: 1.2,
          color: '#002677',
          pr: 2
        }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            p: 0,
            color: '#4B4D4F',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 0, mb: 3 }}>
        <Typography sx={{
          fontFamily: '"Enterprise Sans VF", sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: 1.4,
          color: '#4B4D4F'
        }}>
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 0, gap: 1.5 }}>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: '46px',
            padding: '10px 24px',
            bgcolor: '#002677',
            fontFamily: '"Enterprise Sans VF", sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: 1.4,
            color: '#FBF9F4',
            '&:hover': {
              bgcolor: '#001a5c'
            }
          }}
        >
          {confirmText}
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: '46px',
            padding: '10px 24px',
            borderColor: '#323334',
            color: '#323334',
            fontFamily: '"Enterprise Sans VF", sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: 1.4,
            '&:hover': {
              borderColor: '#323334',
              bgcolor: 'rgba(50, 51, 52, 0.04)'
            }
          }}
        >
          {cancelText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
