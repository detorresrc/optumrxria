import React, { useState } from 'react';
import { Box, Typography, IconButton, RadioGroup, FormControlLabel, Radio, TextField, Button, Checkbox, CircularProgress, Alert, Snackbar } from '@mui/material';
import { ExpandMore, ExpandLess, Search, CalendarToday } from '@mui/icons-material';
import { ClientPagination } from './ClientPagination';
import { BulkActionModal } from './BulkActionModal';
import { useCAGSearch } from '../hooks/useCAGSearch';

interface AssignCAGsAccordionProps {
  operationalUnit: string;
  onAssignmentSuccess?: () => void;
}

export const AssignCAGsAccordion: React.FC<AssignCAGsAccordionProps> = ({ 
  operationalUnit,
  onAssignmentSuccess 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dateErrors, setDateErrors] = useState<{ startDate?: string; endDate?: string }>({});

  // Use the useCAGSearch hook
  const {
    searchResults,
    isSearching,
    error,
    selectedCAGs,
    searchParams,
    setSearchParams,
    performSearch,
    clearSearch,
    setSelectedCAGs,
    assignSelectedCAGs,
  } = useCAGSearch();

  // Date validation function
  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return true; // Empty is valid (optional field for end date)
    
    // Check MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateStr)) {
      return false;
    }
    
    // Validate it's a real date
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getMonth() === month - 1 && date.getDate() === day;
  };

  // Handle assignment level change
  const handleAssignmentLevelChange = (level: string) => {
    setSearchParams({ ...searchParams, assignmentLevel: level as 'carrier' | 'account' | 'group' });
  };

  // Handle search field changes
  const handleSearchFieldChange = (field: string, value: string) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  // Handle date field changes with validation
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    handleSearchFieldChange(field, value);
    
    // Validate on blur or when complete
    if (value && value.length === 10) {
      if (!validateDate(value)) {
        setDateErrors(prev => ({ ...prev, [field]: 'Invalid date format. Use MM/DD/YYYY' }));
      } else {
        setDateErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    // Validate dates before searching
    const startDateValid = !searchParams.startDate || validateDate(searchParams.startDate);
    const endDateValid = !searchParams.endDate || validateDate(searchParams.endDate);
    
    if (!startDateValid || !endDateValid) {
      setDateErrors({
        startDate: !startDateValid ? 'Invalid date format. Use MM/DD/YYYY' : undefined,
        endDate: !endDateValid ? 'Invalid date format. Use MM/DD/YYYY' : undefined,
      });
      return;
    }
    
    await performSearch();
  };

  // Handle clear button click
  const handleClear = () => {
    clearSearch();
    setDateErrors({});
  };

  // Handle assign button click
  const handleAssignClick = () => {
    if (selectedCAGs.length === 0) return;
    setShowConfirmModal(true);
  };

  // Handle assignment confirmation
  const handleConfirmAssignment = async () => {
    if (!operationalUnit || !searchParams.assignmentLevel) {
      return;
    }

    // Map assignment level to assignment type
    const assignmentTypeMap: Record<string, 'Carrier' | 'Account' | 'Group'> = {
      'carrier': 'Carrier',
      'account': 'Account',
      'group': 'Group',
      'carrier-account': 'Account',
      'carrier-account-group': 'Group',
    };

    const assignmentType = assignmentTypeMap[searchParams.assignmentLevel];
    
    const success = await assignSelectedCAGs(operationalUnit, assignmentType);
    
    if (success) {
      setShowConfirmModal(false);
      setShowSuccessMessage(true);
      
      // Trigger parent refresh if callback provided
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }
    } else {
      setShowConfirmModal(false);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCAGs(searchResults.map(cag => cag.cagId));
    } else {
      setSelectedCAGs([]);
    }
  };

  // Handle individual CAG selection
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
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: 1.2,
              color: '#002677'
            }}>
              Assign CAGs -
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
          <IconButton onClick={() => setExpanded(!expanded)} sx={{ p: 0 }}>
            {expanded ? <ExpandLess sx={{ fontSize: 19, color: '#0C55B8' }} /> : <ExpandMore sx={{ fontSize: 19, color: '#0C55B8' }} />}
          </IconButton>
        </Box>

        {/* Collapsible Content */}
        {expanded && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Error Display */}
            {error && (
              <Alert severity="error" onClose={() => {}}>
                {error}
              </Alert>
            )}

            {/* Assignment Level Selection */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ 
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: 1.25,
                color: '#323334'
              }}>
                Select Assignment Level*
              </Typography>
              <RadioGroup
                value={searchParams.assignmentLevel || 'carrier'}
                onChange={(e) => handleAssignmentLevelChange(e.target.value)}
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
                  value="account" 
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
                  value="group" 
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
                    value={searchParams.startDate || ''}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    error={!!dateErrors.startDate}
                    helperText={dateErrors.startDate}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px 0 0 4px',
                        '& fieldset': {
                          borderColor: dateErrors.startDate ? '#D32F2F' : '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
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
                    value={searchParams.endDate || ''}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    error={!!dateErrors.endDate}
                    helperText={dateErrors.endDate}
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px 0 0 4px',
                        '& fieldset': {
                          borderColor: dateErrors.endDate ? '#D32F2F' : '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
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
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: 1.4,
                    color: '#323334'
                  }}>
                    Carrier Name
                  </Typography>
                  <TextField
                    placeholder="Enter carrier name"
                    value={searchParams.carrierName || ''}
                    onChange={(e) => handleSearchFieldChange('carrierName', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#323334'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ 
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: 1.4,
                    color: '#323334'
                  }}>
                    Carrier ID
                  </Typography>
                  <TextField
                    placeholder="Enter carrier ID"
                    value={searchParams.carrierId || ''}
                    onChange={(e) => handleSearchFieldChange('carrierId', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#4B4D4F'
                        }
                      },
                      '& input': {
                        padding: '10px 12px',
                        fontSize: '16px',
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
                  onClick={handleSearch}
                  disabled={isSearching || Object.keys(dateErrors).length > 0}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '46px',
                    padding: '8px 24px 8px 16px',
                    bgcolor: '#002677',
                    fontWeight: 700,
                    fontSize: '16px',
                    '&:hover': {
                      bgcolor: '#001a5c'
                    },
                    '&:disabled': {
                      bgcolor: '#CBCCCD',
                      color: '#FFFFFF'
                    }
                  }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
                <Typography 
                  onClick={handleClear}
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: 1.25,
                    color: '#0C55B8',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Clear
                </Typography>
              </Box>
            </Box>

            {/* Loading State */}
            {isSearching && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Search Results or Empty State */}
            {!isSearching && searchResults.length === 0 && !error && Object.keys(searchParams).length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                py: 4,
                color: '#6D6F70'
              }}>
                <Typography>No unassigned CAGs found matching your search criteria</Typography>
              </Box>
            )}

            {/* Unassigned CAGs Table */}
            {!isSearching && searchResults.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ 
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: 1.71,
                    color: '#000000'
                  }}>
                    Number of unassigned CAGs: {searchResults.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                      variant="contained"
                      onClick={handleAssignClick}
                      disabled={selectedCAGs.length === 0}
                      sx={{
                        textTransform: 'none',
                        borderRadius: '46px',
                        padding: '8px 24px',
                        bgcolor: '#002677',
                        fontWeight: 700,
                        fontSize: '16px',
                        '&:hover': {
                          bgcolor: '#001a5c'
                        },
                        '&:disabled': {
                          bgcolor: '#CBCCCD',
                          color: '#FFFFFF'
                        }
                      }}
                    >
                      Assign ({selectedCAGs.length})
                    </Button>
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
                      checked={selectedCAGs.length === searchResults.length && searchResults.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    <Typography sx={{ 
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: 1.4,
                      color: '#000000'
                    }}>
                      Carrier Name & ID
                    </Typography>
                  </Box>

                  {/* Rows */}
                  {searchResults.map((cag, index) => (
                    <Box 
                      key={cag.cagId}
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        bgcolor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                      }}
                    >
                      <Checkbox 
                        checked={selectedCAGs.includes(cag.cagId)}
                        onChange={(e) => handleSelectCAG(cag.cagId, e.target.checked)}
                      />
                      <Typography sx={{ 
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

                {/* Pagination - Placeholder for future implementation */}
                {searchResults.length > 10 && (
                  <ClientPagination 
                    currentPage={1}
                    totalPages={Math.ceil(searchResults.length / 10)}
                    onPageChange={() => {}}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Confirmation Modal */}
      <BulkActionModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAssignment}
        title="Confirm CAG Assignment"
        message={`You are about to assign ${selectedCAGs.length} CAG${selectedCAGs.length > 1 ? 's' : ''} to this operational unit. Do you want to continue?`}
        confirmText="Yes, Assign"
        cancelText="No, Cancel"
      />

      {/* Success Message */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Successfully assigned {selectedCAGs.length} CAG{selectedCAGs.length > 1 ? 's' : ''} to the operational unit
        </Alert>
      </Snackbar>
    </Box>
  );
};
