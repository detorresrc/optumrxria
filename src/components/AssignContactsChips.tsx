import React from 'react';
import {
  Box,
  Typography,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

// Contact option interface for dropdown
interface ContactOption {
  value: string;
  label: string;
}

interface AssignContactsChipsProps {
  control: Control<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  availableContacts: ContactOption[];
}

/**
 * AssignContactsChips Component
 * 
 * Displays a dropdown for selecting contacts and shows selected contacts as removable chips.
 * Requirements: 2.10-2.13, 9.7
 * 
 * - Light blue card background (#FAFCFF) with 12px border radius
 * - Dropdown for selecting contacts
 * - Display selected contacts as chips with X icon
 * - Click X icon removes contact from selection
 */
export const AssignContactsChips: React.FC<AssignContactsChipsProps> = ({
  control,
  operationalUnitIndex,
  availableContacts,
}) => {
  // Watch the current assigned contacts for display purposes
  // Note: The actual value is managed by the Controller below
  useWatch({
    control,
    name: `operationalUnits.${operationalUnitIndex}.assignedContacts`,
  });

  // Get label for a contact value
  const getContactLabel = (value: string): string => {
    const contact = availableContacts.find((c) => c.value === value);
    return contact?.label || value;
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FAFCFF',
        border: '1px solid #CBCCCD',
        borderRadius: '12px',
        padding: '16px 24px',
        mt: 3,
      }}
    >
      <Controller
        name={`operationalUnits.${operationalUnitIndex}.assignedContacts`}
        control={control}
        render={({ field }) => {
          const selectedValues = field.value || [];

          // Handle adding a contact from dropdown
          const handleSelectContact = (contactValue: string) => {
            if (contactValue && !selectedValues.includes(contactValue)) {
              field.onChange([...selectedValues, contactValue]);
            }
          };

          // Handle removing a contact chip (Requirement 2.13)
          const handleRemoveContact = (contactValue: string) => {
            field.onChange(selectedValues.filter((v: string) => v !== contactValue));
          };

          // Filter out already selected contacts from dropdown options
          const availableOptions = availableContacts.filter(
            (contact) => !selectedValues.includes(contact.value)
          );

          return (
            <>
              {/* Dropdown for selecting contacts (Requirement 2.10) */}
              <FormControl fullWidth size="small" sx={{ mt: 3 }}>
                <InputLabel
                  id={`assign-contacts-label-${operationalUnitIndex}`}
                  sx={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#323334',
                    transform: 'translate(0, -24px)',
                    '&.Mui-focused': {
                      color: '#323334',
                    },
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(0, -24px)',
                    }
                  }}
                  shrink
                >
                  Assign Contacts
                </InputLabel>
                <Select
                  labelId={`assign-contacts-label-${operationalUnitIndex}`}
                  value=""
                  onChange={(e) => handleSelectContact(e.target.value as string)}
                  displayEmpty
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    mt: 1,
                    height: '40px',
                    width: '392px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #4B4D4F',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 14px',
                      fontSize: '16px',
                      color: selectedValues.length === 0 ? '#6B6C6F' : '#323334',
                    },
                    '& .MuiSelect-icon': {
                      color: '#323334',
                      right: '12px',
                    },
                  }}
                  renderValue={() => (
                    <Typography
                      sx={{
                        fontSize: '16px',
                        color: '#6B6C6F',
                      }}
                    >
                      Select contacts
                    </Typography>
                  )}
                >
                  {availableOptions.length === 0 ? (
                    <MenuItem disabled value="">
                      <Typography sx={{ color: '#6B6C6F', fontSize: '14px' }}>
                        No more contacts available
                      </Typography>
                    </MenuItem>
                  ) : (
                    availableOptions.map((contact) => (
                      <MenuItem key={contact.value} value={contact.value}>
                        {contact.label}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Display selected contacts as chips (Requirements 2.11, 2.12) */}
              {selectedValues.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    mt: 2,
                  }}
                >
                  {selectedValues.map((contactValue: string) => (
                    <Chip
                      key={contactValue}
                      label={getContactLabel(contactValue)}
                      onDelete={() => handleRemoveContact(contactValue)}
                      deleteIcon={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#0C55B8',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: '#0A4A9E',
                            },
                          }}
                        >
                          <CloseIcon
                            sx={{
                              fontSize: '14px !important',
                              color: '#FFFFFF !important',
                            }}
                          />
                        </Box>
                      }
                      sx={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0C55B8',
                        borderRadius: '6px',
                        height: '32px',
                        '& .MuiChip-label': {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#0C55B8',
                          padding: '0 8px 0 12px',
                        },
                        '& .MuiChip-deleteIcon': {
                          margin: '0 8px 0 0',
                        },
                        '&:hover': {
                          backgroundColor: '#F0F7FF',
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </>
          );
        }}
      />
    </Box>
  );
};

export default AssignContactsChips;
