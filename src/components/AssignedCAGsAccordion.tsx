import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, MenuItem, Select } from '@mui/material';
import { ExpandMore, ExpandLess, FilterList } from '@mui/icons-material';
import { CAGAssignedTable } from './CAGAssignedTable';
import { ClientPagination } from './ClientPagination';

interface AssignedCAGsAccordionProps {
  operationalUnit: string;
}

export const AssignedCAGsAccordion: React.FC<AssignedCAGsAccordionProps> = ({ operationalUnit }) => {
  const [expanded, setExpanded] = useState(true);
  const [bulkAction, setBulkAction] = useState('');

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
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.2,
              color: '#002677'
            }}>
              List of Assigned CAGs -
            </Typography>
            <Typography sx={{ 
              fontFamily: '"Enterprise Sans VF", sans-serif',
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
            {/* Table Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ 
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: 1.71,
                color: '#000000'
              }}>
                Number of assigned CAGs: 40
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography sx={{ 
                    fontFamily: '"Optum Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: 1.25,
                    color: '#0C55B8',
                    cursor: 'pointer'
                  }}>
                    Apply
                  </Typography>
                  <Select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    displayEmpty
                    sx={{
                      width: '146px',
                      height: '40px',
                      bgcolor: '#FFFFFF',
                      border: '1px solid #4B4D4F',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontFamily: '"Optum Sans", sans-serif',
                      fontWeight: 400,
                      '& .MuiSelect-select': {
                        padding: '12px'
                      }
                    }}
                  >
                    <MenuItem value="">Bulk actions</MenuItem>
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

            {/* Table */}
            <CAGAssignedTable />

            {/* Pagination */}
            <ClientPagination 
              currentPage={1}
              totalPages={127}
              onPageChange={() => {}}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
