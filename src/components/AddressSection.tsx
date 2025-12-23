import React from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface AddressSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  fields: FieldArrayWithId<AddClientCombinedFormData, 'addresses'>[];
  append: UseFieldArrayAppend<AddClientCombinedFormData, 'addresses'>;
  remove: UseFieldArrayRemove;
  onEdit?: (index: number) => void;
}

// Address Type dropdown options per design document
const ADDRESS_TYPE_OPTIONS = [
  { value: 'billing', label: 'Billing' },
  { value: 'mailing', label: 'Mailing' },
  { value: 'physical', label: 'Physical' },
];

// US State options
const STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export const AddressSection: React.FC<AddressSectionProps> = ({
  control,
  errors,
  fields,
  append,
  remove,
  onEdit,
}) => {
  const hasMultipleAddresses = fields.length > 1;

  const handleAddAddress = () => {
    append({
      addressType: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
    });
  };

  const handleDeleteAddress = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleEditAddress = (index: number) => {
    if (onEdit) {
      onEdit(index);
    }
  };

  return (
    <Box>
      {/* Section Title */}
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#323334',
          mb: 2,
        }}
      >
        Address
      </Typography>

      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          {/* Horizontal divider between addresses */}
          {index > 0 && (
            <Divider
              sx={{
                my: 3,
                borderColor: '#CBCCCD',
              }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            {/* Edit and Delete icons for multiple addresses */}
            {hasMultipleAddresses && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleEditAddress(index)}
                  aria-label={`Edit address ${index + 1}`}
                  sx={{
                    color: '#002677',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 38, 119, 0.08)',
                    },
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: '20px' }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteAddress(index)}
                  aria-label={`Delete address ${index + 1}`}
                  sx={{
                    color: '#C40000',
                    '&:hover': {
                      backgroundColor: 'rgba(196, 0, 0, 0.08)',
                    },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: '20px' }} />
                </IconButton>
              </Box>
            )}

            {/* First Row: Address Type, Address 1, Address 2 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormSelectField
                  name={`addresses.${index}.addressType`}
                  control={control}
                  label="Address Type"
                  required
                  options={ADDRESS_TYPE_OPTIONS}
                  placeholder="Select address type"
                  error={errors.addresses?.[index]?.addressType}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormTextField
                  name={`addresses.${index}.address1`}
                  control={control}
                  label="Address 1"
                  required
                  placeholder="Enter street address"
                  error={errors.addresses?.[index]?.address1}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormTextField
                  name={`addresses.${index}.address2`}
                  control={control}
                  label="Address 2"
                  required
                  placeholder="Apt, suite, unit, etc."
                  error={errors.addresses?.[index]?.address2}
                />
              </Grid>
            </Grid>

            {/* Second Row: City, State, Zip (equal widths) */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormTextField
                  name={`addresses.${index}.city`}
                  control={control}
                  label="City"
                  required
                  placeholder="Enter city"
                  error={errors.addresses?.[index]?.city}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormSelectField
                  name={`addresses.${index}.state`}
                  control={control}
                  label="State"
                  required
                  options={STATE_OPTIONS}
                  placeholder="Select state"
                  error={errors.addresses?.[index]?.state}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormTextField
                  name={`addresses.${index}.zip`}
                  control={control}
                  label="Zip"
                  required
                  placeholder="Enter ZIP code"
                  error={errors.addresses?.[index]?.zip}
                />
              </Grid>
            </Grid>
          </Box>
        </React.Fragment>
      ))}

      {/* Add Address Button */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          sx={{
            color: '#002677',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: 'rgba(0, 38, 119, 0.08)',
            },
          }}
        >
          Add Address
        </Button>
      </Box>
    </Box>
  );
};

export default AddressSection;
