import React, { useState } from 'react';
import { Box, Typography, IconButton, RadioGroup, FormControlLabel, Radio, TextField, Button, Checkbox } from '@mui/material';
import { ExpandMore, ExpandLess, Search, CalendarToday } from '@mui/icons-material';
import { ClientPagination } from './ClientPagination';

interface AssignCAGsAccordionProps {
  operationalUnit: string;
}

const mockUnassignedCAGs = [
  { id: '1', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
  { id: '2', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
  { id: '3', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
  { id: '4', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
  { id: '5', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
  { id: '6', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
  { id: '7', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx' },
];

export const AssignCAGsAccordion: React.FC<AssignCAGsAccordionProps> = ({ operationalUnit }) => {
  const [expanded, setExpanded] = useState(false);
  const [assignmentLevel, setAssignmentLevel] = useState('carrier');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [carrierId, setCarrierId] = useState('');
  const [selectedCAGs, setSelectedCAGs] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCAGs(mockUnassignedCAGs.map(cag => cag.id));
    } else {
      setSelectedCAGs([]);
    }
  };

  const handleSelectCAG = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCAGs([...selectedCAGs, id]);
    } else {
      setSelectedCAGs(selectedCAGs.filter(cagId => cagId !== id));
    }
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
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.2,
              color: '#002677'
            }}>
              Assign CAGs -
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
          <IconButton onClick={() => setExpanded(!expanded)} sx={{ p: 0 }}>
            {expanded ? <ExpandLess sx={{ fontSize: 19, color: '#0C55B8' }} /> : <ExpandMore sx={{ fontSize: 19, color: '#0C55B8' }} />}
          </IconButton>
        </Box>

        {/* Collapsible Content */}
        {expanded && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Assignment Level Selection */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ 
                fontFamily: '"Optum Sans", sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: 1.25,
                color: '#323334'
              }}>
                Select Assignment Level*
              </Typography>
              <RadioGroup
                value={assignmentLevel}
                onChange={(e) => setAssignmentLevel(e.target.value)}
                sx={{ display: 'flex', flexDirection: 'row', gap: 3.25 }}
              >
                <FormControlLabel 
                  value="carrier" 
                  control={<Radio />} 
                  label="Carrier"
                  sx={{ 
                    '& .MuiFormControlLabel-label': {
                      fontSize: '16px',
                      lineHeight: 1.25,
                      color: '#4B4D4F'
                    }
                  }}
                />
                <FormControlLabel 
                  value="carrier-account" 
                  control={<Radio />} 
                  label="Carrier + Account"
                  sx={{ 
                    '& .MuiFormControlLabel-label': {
                      fontSize: '16px',
                      lineHeight: 1.25,
                      color: '#4B4D4F'
                    }
                  }}
                />
                <FormControlLabel 
                  value="carrier-account-group" 
                  control={<Radio />} 
                  label="Carrier + Account + group"
                  sx={{ 
                    '& .MuiFormControlLabel-label': {
                      fontSize: '16px',
                      lineHeight: 1.25,
                      color: '#4B4D4F'
                    }
                  }}
                />
              </RadioGroup>
            </Box>

            {/* Date Fields */}
            <Box sx={{ display: 'flex', gap: 3.25 }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ 
                  fontFamily: '"Optum Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: 1.25,
                  color: '#323334'
                }}>
                  Start Date*
                </Typography>
                <Box sx={{ display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                  <TextField
                    placeholder="MM/DD/YYYY"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px 0 0 4px',
                        '& fieldset': {
                          borderColor: '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
                        fontFamily: '"Optum Sans", sans-serif',
                        fontWeight: 400,
                        color: '#323334'
                      }
                    }}
                  />
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#002677',
                    px: 1,
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                  }}>
                    <CalendarToday sx={{ fontSize: 20, color: '#FFFFFF' }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ 
                  fontFamily: '"Optum Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: 1.25,
                  color: '#323334'
                }}>
                  End Date
                </Typography>
                <Box sx={{ display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                  <TextField
                    placeholder="MM/DD/YYYY"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px 0 0 4px',
                        '& fieldset': {
                          borderColor: '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
                        fontFamily: '"Optum Sans", sans-serif',
                        fontWeight: 400,
                        color: '#323334'
                      }
                    }}
                  />
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#002677',
                    px: 1,
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                  }}>
                    <CalendarToday sx={{ fontSize: 20, color: '#FFFFFF' }} />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Filter Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ 
                fontFamily: '"Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                lineHeight: 1.4,
                fontWeight: 400,
                color: '#4B4D4F'
              }}>
                Filter by:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2.75 }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ 
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: 1.4,
                    color: '#323334'
                  }}>
                    Carrier Name
                  </Typography>
                  <TextField
                    placeholder="Enter carrier name"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
                        fontFamily: '"Optum Sans", sans-serif',
                        fontWeight: 400,
                        color: '#323334'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ 
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: 1.4,
                    color: '#323334'
                  }}>
                    Carrier ID
                  </Typography>
                  <TextField
                    placeholder="Enter carrier ID"
                    value={carrierId}
                    onChange={(e) => setCarrierId(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
                        fontFamily: '"Optum Sans", sans-serif',
                        fontWeight: 400,
                        color: '#323334'
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.25 }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '46px',
                    padding: '8px 24px 8px 16px',
                    bgcolor: '#002677',
                    fontWeight: 700,
                    fontSize: '16px',
                    '&:hover': {
                      bgcolor: '#001a5c'
                    }
                  }}
                >
                  Search
                </Button>
                <Typography sx={{ 
                  fontFamily: '"Optum Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: 1.25,
                  color: '#0C55B8',
                  cursor: 'pointer'
                }}>
                  Clear
                </Typography>
              </Box>
            </Box>

            {/* Unassigned CAGs Table */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ 
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: 1.71,
                  color: '#000000'
                }}>
                  Number of unassigned CAGs: 40
                </Typography>
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
                  <Box sx={{
                    width: '146px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #4B4D4F',
                    borderRadius: '4px',
                    px: 1.5
                  }}>
                    <Typography sx={{ fontSize: '16px', fontFamily: '"Optum Sans", sans-serif', fontWeight: 400, color: '#323334' }}>
                      Assign
                    </Typography>
                    <ExpandMore sx={{ fontSize: 24 }} />
                  </Box>
                </Box>
              </Box>

              {/* Table */}
              <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: '#FAFAFA',
                  borderBottom: '1px solid #E5E5E6'
                }}>
                  <Checkbox 
                    checked={selectedCAGs.length === mockUnassignedCAGs.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <Typography sx={{ 
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: 1.4,
                    color: '#000000'
                  }}>
                    Carrier Name & ID
                  </Typography>
                </Box>

                {/* Rows */}
                {mockUnassignedCAGs.map((cag, index) => (
                  <Box 
                    key={cag.id}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      bgcolor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                    }}
                  >
                    <Checkbox 
                      checked={selectedCAGs.includes(cag.id)}
                      onChange={(e) => handleSelectCAG(cag.id, e.target.checked)}
                    />
                    <Typography sx={{ 
                      fontFamily: '"Enterprise Sans VF", sans-serif',
                      fontSize: '16px',
                      lineHeight: 1.4,
                      fontWeight: 400,
                      color: '#4B4D4F'
                    }}>
                      {cag.carrierName}<br />{cag.carrierId}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Pagination */}
              <ClientPagination 
                currentPage={1}
                totalPages={127}
                onPageChange={() => {}}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
