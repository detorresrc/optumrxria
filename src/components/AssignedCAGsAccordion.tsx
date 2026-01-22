import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, MenuItem, Select, CircularProgress, Alert } from '@mui/material';
import { ExpandMore, ExpandLess, FilterList } from '@mui/icons-material';
import { CAGAssignedTable } from './CAGAssignedTable';
import { ClientPagination } from './ClientPagination';
import { useAssignedCAGs } from '../hooks/useAssignedCAGs';

interface AssignedCAGsAccordionProps {
  operationalUnit: string;
}

export const AssignedCAGsAccordion: React.FC<AssignedCAGsAccordionProps> = ({ operationalUnit }) => {
  const [expanded, setExpanded] = useState(true);
  const [bulkAction, setBulkAction] = useState('');
  
  // Use the useAssignedCAGs hook
  const {
    assignedCAGs,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    error,
    selectedCAGs,
    setCurrentPage,
    setSelectedCAGs,
    updateCAGStatus,
  } = useAssignedCAGs(operationalUnit);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle bulk action apply
  const handleApplyBulkAction = async () => {
    if (!bulkAction || selectedCAGs.length === 0) return;
    
    const success = await updateCAGStatus(bulkAction);
    if (success) {
      setBulkAction('');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // Convert from 1-indexed to 0-indexed
  };

  return (
    <Box sx={{ 
      border: '1px solid #CBCCCD',
      borderRadius: '12px',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ 
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.2,
              color: '#002677'
            }}>
              List of Assigned CAGs -
            </Typography>
            <Typography sx={{ 
              fontSize: '16px',
              lineHeight: 1.4,
              fontWeight: 400,
              color: '#4B4D4F'
            }}>
              {operationalUnit}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: '46px',
                padding: '10px 24px',
                bgcolor: '#002677',
                fontWeight: 700,
                fontSize: '16px',
                '&:hover': {
                  bgcolor: '#001a5c'
                }
              }}
            >
              Assign more CAGs
            </Button>
            <IconButton onClick={() => setExpanded(!expanded)} sx={{ p: 0 }}>
              {expanded ? <ExpandLess sx={{ fontSize: 19, color: '#0C55B8' }} /> : <ExpandMore sx={{ fontSize: 19, color: '#0C55B8' }} />}
            </IconButton>
          </Box>
        </Box>

        {/* Collapsible Content */}
        {expanded && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Error Display */}
            {error && (
              <Alert severity="error" onClose={() => {}}>
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Content - only show when not loading */}
            {!isLoading && (
              <>
                {/* Table Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ 
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: 1.71,
                    color: '#000000'
                  }}>
                    Number of assigned CAGs: {totalCount}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography 
                        onClick={handleApplyBulkAction}
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: 1.25,
                          color: selectedCAGs.length > 0 && bulkAction ? '#0C55B8' : '#CBCCCD',
                          cursor: selectedCAGs.length > 0 && bulkAction ? 'pointer' : 'not-allowed',
                          pointerEvents: selectedCAGs.length > 0 && bulkAction ? 'auto' : 'none'
                        }}
                      >
                        Apply
                      </Typography>
                      <Select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        displayEmpty
                        disabled={selectedCAGs.length === 0}
                        sx={{
                          width: '146px',
                          height: '40px',
                          bgcolor: '#FFFFFF',
                          border: '1px solid #4B4D4F',
                          borderRadius: '4px',
                          fontSize: '16px',
                          fontWeight: 400,
                          '& .MuiSelect-select': {
                            padding: '12px'
                          }
                        }}
                      >
                        <MenuItem value="">Bulk actions</MenuItem>
                        <MenuItem value="ACTIVE">Set Active</MenuItem>
                        <MenuItem value="INACTIVE">Set Inactive</MenuItem>
                      </Select>
                    </Box>
                    <Button
                      variant="outlined"
                      endIcon={<FilterList />}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '46px',
                        padding: '8px 16px 8px 24px',
                        borderColor: '#323334',
                        color: '#323334',
                        fontWeight: 700,
                        fontSize: '16px'
                      }}
                    >
                      Filters
                    </Button>
                  </Box>
                </Box>

                {/* Empty State */}
                {assignedCAGs.length === 0 && !error && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    py: 8,
                    color: '#6D6F70'
                  }}>
                    <Typography>No CAGs assigned to this operational unit</Typography>
                  </Box>
                )}

                {/* Table */}
                {assignedCAGs.length > 0 && (
                  <>
                    <CAGAssignedTable 
                      assignedCAGs={assignedCAGs}
                      selectedCAGs={selectedCAGs}
                      onSelectionChange={setSelectedCAGs}
                    />

                    {/* Pagination */}
                    <ClientPagination 
                      currentPage={currentPage + 1} // Convert from 0-indexed to 1-indexed
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
