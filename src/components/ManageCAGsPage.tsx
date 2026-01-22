import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { Header } from './Header';
import { SimpleSelectField } from './SimpleSelectField';
import { AssignedCAGsAccordion } from './AssignedCAGsAccordion';
import { AssignCAGsAccordion } from './AssignCAGsAccordion';
import { useClientData } from '../hooks/useClientData';
import { calculateContractStatus } from '../utils/contractStatus';

export const ManageCAGsPage: React.FC = () => {
  const {
    clients,
    contracts,
    operationalUnits,
    selectedClient,
    selectedContract,
    selectedOperationalUnit,
    isLoadingClients,
    isLoadingContracts,
    isLoadingOUs,
    error,
    setSelectedClient,
    setSelectedContract,
    setSelectedOperationalUnit,
  } = useClientData();

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get the selected contract object for status display
  const selectedContractObj = contracts.find(c => c.contractInternalId === selectedContract);
  const contractStatus = selectedContractObj ? calculateContractStatus(selectedContractObj) : null;

  // Callback to refresh assigned CAGs after successful assignment
  const handleAssignmentSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
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
          {/* Error Display */}
          {error && (
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 3.25 }}>
            <SimpleSelectField
              name="client"
              label="Client"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
              disabled={isLoadingClients}
              sx={{ flex: 1 }}
            >
              {isLoadingClients ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography>Loading clients...</Typography>
                  </Box>
                </MenuItem>
              ) : clients.length === 0 ? (
                <MenuItem disabled>No clients available</MenuItem>
              ) : (
                clients.map((client) => (
                  <MenuItem key={client.clientId} value={client.clientId}>
                    {client.clientName}
                  </MenuItem>
                ))
              )}
            </SimpleSelectField>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SimpleSelectField
                name="contract"
                label="Contract"
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                required
                disabled={!selectedClient || isLoadingContracts}
                sx={{ flex: 1 }}
              >
                {isLoadingContracts ? (
                  <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography>Loading contracts...</Typography>
                    </Box>
                  </MenuItem>
                ) : !selectedClient ? (
                  <MenuItem disabled>Select a client first</MenuItem>
                ) : contracts.length === 0 ? (
                  <MenuItem disabled>No contracts available</MenuItem>
                ) : (
                  contracts.map((contract) => (
                    <MenuItem key={contract.contractInternalId} value={contract.contractInternalId}>
                      {contract.contractId} ({contract.effectiveDate} - {contract.terminateDate || 'Ongoing'})
                    </MenuItem>
                  ))
                )}
              </SimpleSelectField>
              {selectedContractObj && contractStatus && (
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Box
                    component="img"
                    src="/src/assets/check-circle-icon.svg"
                    alt="Contract status"
                    sx={{ width: '16px', height: '16px' }}
                  />
                  <Typography sx={{ 
                    fontSize: '14px',
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: '#6D6F70'
                  }}>
                    Contract status : <Box 
                      component="span" 
                      sx={{ 
                        color: contractStatus === 'Active' ? '#007000' : '#D32F2F', 
                        fontWeight: 400 
                      }}
                    >
                      {contractStatus}
                    </Box>
                  </Typography>
                </Box>
              )}
            </Box>

            <SimpleSelectField
              name="operationalUnit"
              label="Operational Unit"
              value={selectedOperationalUnit}
              onChange={(e) => setSelectedOperationalUnit(e.target.value)}
              required
              disabled={!selectedContract || isLoadingOUs}
              sx={{ flex: 1 }}
            >
              {isLoadingOUs ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography>Loading operational units...</Typography>
                  </Box>
                </MenuItem>
              ) : !selectedContract ? (
                <MenuItem disabled>Select a contract first</MenuItem>
              ) : operationalUnits.length === 0 ? (
                <MenuItem disabled>No operational units available</MenuItem>
              ) : (
                operationalUnits.map((ou) => (
                  <MenuItem key={ou.operationUnitInternalId} value={ou.operationUnitInternalId}>
                    {ou.operationUnitId} - {ou.operationUnitName}
                  </MenuItem>
                ))
              )}
            </SimpleSelectField>
          </Box>

          <Box sx={{ height: '3px', bgcolor: '#CBCCCD' }} />

          {/* Accordions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AssignedCAGsAccordion 
              operationalUnit={selectedOperationalUnit} 
              key={refreshTrigger}
            />
            <AssignCAGsAccordion 
              operationalUnit={selectedOperationalUnit}
              onAssignmentSuccess={handleAssignmentSuccess}
            />
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
          fontSize: '12.64px',
          lineHeight: 1.27,
          fontWeight: 400,
          color: '#4B4D4F'
        }}>
          © 2025 Optum, Inc. All rights reserved
        </Typography>
      </Box>
    </Box>
  );
};
