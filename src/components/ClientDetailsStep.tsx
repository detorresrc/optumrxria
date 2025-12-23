import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';
import { AddressSection } from './AddressSection';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ClientDetailsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  addressFields: FieldArrayWithId<AddClientCombinedFormData, 'addresses'>[];
  appendAddress: UseFieldArrayAppend<AddClientCombinedFormData, 'addresses'>;
  removeAddress: UseFieldArrayRemove;
}

// Dropdown options per design document
const SOURCE_OPTIONS = [
  { value: 'direct', label: 'Direct' },
  { value: 'referral', label: 'Referral' },
  { value: 'partner', label: 'Partner' },
];

const CLIENT_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
];

export const ClientDetailsStep: React.FC<ClientDetailsStepProps> = ({
  control,
  errors,
  addressFields,
  appendAddress,
  removeAddress,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px !important',
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: '#002677',
              fontSize: '24px',
            }}
          />
        }
        sx={{
          padding: '16px 24px',
          '& .MuiAccordionSummary-content': {
            margin: 0,
            flexDirection: 'column',
            gap: '4px',
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: '23px',
            fontWeight: 700,
            color: '#323334',
            lineHeight: 1.2,
          }}
        >
          Client Details
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4,
          }}
        >
          Complete the fields below.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 24px 24px 24px',
        }}
      >
        {/* Client Info Fields - Two Column Layout */}
        <Box sx={{ mb: 3 }}>
          {/* First Row: Client Reference ID, Client ID, Client Name */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="clientReferenceId"
                control={control}
                label="Client Reference ID"
                required
                placeholder="Enter client reference ID"
                error={errors.clientReferenceId}
                helpTooltip="A unique identifier for the client reference"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="clientId"
                control={control}
                label="Client ID"
                placeholder=""
                error={errors.clientId}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="clientName"
                control={control}
                label="Client Name"
                required
                placeholder="Enter client name"
                error={errors.clientName}
              />
            </Grid>
          </Grid>

          {/* Second Row: Client Status, Source */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelectField
                name="clientStatus"
                control={control}
                label="Client Status"
                options={CLIENT_STATUS_OPTIONS}
                placeholder="Select client status"
                error={errors.clientStatus}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormSelectField
                name="source"
                control={control}
                label="Source"
                required
                options={SOURCE_OPTIONS}
                placeholder="Select source"
                error={errors.source}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Address Section */}
        <AddressSection
          control={control}
          errors={errors}
          fields={addressFields}
          append={appendAddress}
          remove={removeAddress}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ClientDetailsStep;
