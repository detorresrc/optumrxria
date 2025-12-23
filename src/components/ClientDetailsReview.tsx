import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { ReadOnlyField } from './ReadOnlyField';
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
      {/* Client Info Fields */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client Reference ID"
            value={formData.clientReferenceId}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client ID"
            value={formData.clientId}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client Name"
            value={formData.clientName}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadOnlyField
            label="Client Status"
            value={getStatusLabel(formData.clientStatus)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadOnlyField
            label="Source"
            value={getSourceLabel(formData.source)}
          />
        </Grid>
      </Grid>

      {/* Addresses Section */}
      {formData.addresses && formData.addresses.length > 0 && (
        <>
          <Divider sx={{ my: 3, borderColor: '#CBCCCD' }} />
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#000000',
              mb: 2,
            }}
          >
            Addresses
          </Typography>
          {formData.addresses.map((address, index) => (
            <Box key={index} sx={{ mb: index < formData.addresses.length - 1 ? 3 : 0 }}>
              {index > 0 && (
                <Divider sx={{ my: 2, borderColor: '#E5E5E5' }} />
              )}
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Address Type"
                    value={getAddressTypeLabel(address.addressType)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Address 1"
                    value={address.address1}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Address 2"
                    value={address.address2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="City"
                    value={address.city}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="State"
                    value={address.state}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Zip"
                    value={address.zip}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default ClientDetailsReview;
