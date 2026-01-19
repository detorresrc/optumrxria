import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { Header } from './Header';
import { SimpleSelectField } from './SimpleSelectField';
import { AssignedCAGsAccordion } from './AssignedCAGsAccordion';
import { BulkActionModal } from './BulkActionModal';
import { AssignCAGsAccordion } from './AssignCAGsAccordion';

export const ManageCAGsPage: React.FC = () => {
  const [client, setClient] = useState('Client A');
  const [contract, setContract] = useState('U1V2W3X4Y5 (05/01/2023 - 05/31/2023)');
  const [operationalUnit, setOperationalUnit] = useState('OU-1');
  const [showModal, setShowModal] = useState(true); // Set to true to show by default

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    // Handle the assign action here
    console.log('Assigning items...');
    setShowModal(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      <Header />
      
      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, px: 10.5, py: 4 }}>
        {/* Title Bar */}
        <Box sx={{ 
          width: '1272px',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 3,
          borderBottom: '1px solid #CBCCCD'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ChevronLeft sx={{ fontSize: 19, color: '#0C55B8' }} />
            <Typography variant="h4" sx={{ 
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontWeight: 700,
              fontSize: '29px',
              lineHeight: 1.2,
              color: '#002677'
            }}>
              Manage CAGs
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: '46px',
              padding: '10px 24px',
              borderColor: '#323334',
              color: '#323334',
              fontWeight: 700,
              fontSize: '16px',
              '&:hover': {
                borderColor: '#323334',
                bgcolor: 'rgba(50, 51, 52, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
        </Box>

        {/* Filter Section */}
        <Box sx={{ width: '1272px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Box sx={{ display: 'flex', gap: 3.25 }}>
            <SimpleSelectField
              name="client"
              label="Client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
              sx={{ flex: 1 }}
            >
              <MenuItem value="Client A">Client A</MenuItem>
            </SimpleSelectField>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SimpleSelectField
                name="contract"
                label="Contract"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                required
                sx={{ flex: 1 }}
              >
                <MenuItem value="U1V2W3X4Y5 (05/01/2023 - 05/31/2023)">
                  U1V2W3X4Y5 (05/01/2023 - 05/31/2023)
                </MenuItem>
              </SimpleSelectField>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <Box
                  component="img"
                  src="/src/assets/check-circle-icon.svg"
                  alt="Active status"
                  sx={{ width: '16px', height: '16px' }}
                />
                <Typography sx={{ 
                  fontSize: '14px',
                  lineHeight: 1.4,
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontWeight: 400,
                  color: '#6D6F70'
                }}>
                  Contract status : <Box component="span" sx={{ color: '#007000', fontWeight: 400 }}>Active</Box>
                </Typography>
              </Box>
            </Box>

            <SimpleSelectField
              name="operationalUnit"
              label="Operational Unit"
              value={operationalUnit}
              onChange={(e) => setOperationalUnit(e.target.value)}
              required
              sx={{ flex: 1 }}
            >
              <MenuItem value="OU-1">OU-1</MenuItem>
            </SimpleSelectField>
          </Box>

          <Box sx={{ height: '3px', bgcolor: '#CBCCCD' }} />

          {/* Accordions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AssignedCAGsAccordion operationalUnit={operationalUnit} />
            <AssignCAGsAccordion operationalUnit={operationalUnit} />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        mt: 'auto',
        display: 'flex', 
        justifyContent: 'center',
        py: 2
      }}>
        <Typography sx={{ 
          fontFamily: '"Optum Sans", sans-serif',
          fontSize: '12.64px',
          lineHeight: 1.27,
          fontWeight: 400,
          color: '#4B4D4F'
        }}>
          © 2025 Optum, Inc. All rights reserved
        </Typography>
      </Box>

      {/* Bulk Action Modal */}
      <BulkActionModal
        open={showModal}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Bulk actions: Assign"
        message="You are about to assign 07 row items. Do it, doesn't give you back to undo it?"
        confirmText="Yes, Assign"
        cancelText="No, Cancel"
      />
    </Box>
  );
};
