import React from 'react';
import { Box, Grid, IconButton, Link } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { ReadOnlyField } from './ReadOnlyField';
import { ReadOnlySelectField } from './ReadOnlySelectField';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ClientDetailsReviewProps {
  formData: AddClientCombinedFormData;
}

// Label mappings for dropdown values
const SOURCE_LABELS: Record<string, string> = {
  direct: 'Direct',
  referral: 'Referral',
  partner: 'Partner',
};

const CLIENT_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};

const ADDRESS_TYPE_LABELS: Record<string, string> = {
  billing: 'Billing',
  mailing: 'Mailing',
  physical: 'Physical',
};

export const ClientDetailsReview: React.FC<ClientDetailsReviewProps> = ({
  formData,
}) => {
  const getSourceLabel = (value: string | undefined) => {
    return value ? SOURCE_LABELS[value] || value : undefined;
  };

  const getStatusLabel = (value: string | undefined) => {
    return value ? CLIENT_STATUS_LABELS[value] || value : undefined;
  };

  const getAddressTypeLabel = (value: string | undefined) => {
    return value ? ADDRESS_TYPE_LABELS[value] || value : undefined;
  };

  return (
    <Box>
      {/* Client Info Fields - Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client Reference ID"
            value={formData.clientReferenceId}
            placeholder=""
            helpTooltip="Unique identifier for the client"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client ID"
            value={formData.clientId}
            placeholder=""
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client Name"
            value={formData.clientName}
            placeholder=""
            required
          />
        </Grid>
      </Grid>

      {/* Client Info Fields - Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadOnlySelectField
            label="Client Status"
            value={getStatusLabel(formData.clientStatus)}
            placeholder=""
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadOnlySelectField
            label="Source"
            value={getSourceLabel(formData.source)}
            placeholder=""
            required
          />
        </Grid>
      </Grid>

      {/* Addresses Section */}
      {formData.addresses && formData.addresses.map((address, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          {/* Address Row 1 */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Address Type"
                value={getAddressTypeLabel(address.addressType)}
                placeholder=""
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Address 1"
                value={address.address1}
                placeholder=""
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Address 2"
                value={address.address2}
                placeholder=""
              />
            </Grid>
          </Grid>

          {/* Address Row 2 */}
          <Grid container spacing={3} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="City"
                value={address.city}
                placeholder=""
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="State"
                value={address.state}
                placeholder=""
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <ReadOnlyField
                label="Zip"
                value={address.zip}
                placeholder=""
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 1 }} sx={{ display: 'flex', justifyContent: 'flex-end', pb: 0.5 }}>
              <IconButton
                disabled
                sx={{
                  color: '#002677',
                  opacity: 0.5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}

      {/* Add another address link */}
      <Box sx={{ mt: 2 }}>
        <Link
          component="button"
          underline="none"
          disabled
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#002677',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'default',
            opacity: 0.5,
            '&:hover': {
              textDecoration: 'none',
            },
          }}
        >
          <AddIcon sx={{ fontSize: '18px' }} />
          Add another address
        </Link>
      </Box>
    </Box>
  );
};

export default ClientDetailsReview;
