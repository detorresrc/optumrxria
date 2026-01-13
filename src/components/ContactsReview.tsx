import React from 'react';
import { Box, Grid, Divider } from '@mui/material';
import { ReadOnlyField } from './ReadOnlyField';
import { ReadOnlySelectField } from './ReadOnlySelectField';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ContactsReviewProps {
  formData: AddClientCombinedFormData;
}

// Label mappings for dropdown values
const CONTACT_TYPE_LABELS: Record<string, string> = {
  primary: 'Primary Contact',
  billing: 'Billing Contact',
  technical: 'Technical Contact',
  executive: 'Executive Sponsor',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

const YES_NO_LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
};

export const ContactsReview: React.FC<ContactsReviewProps> = ({
  formData,
}) => {
  const getLabel = (value: string | undefined, labels: Record<string, string>) => {
    return value ? labels[value] || value : undefined;
  };

  return (
    <Box>
      {formData.contacts && formData.contacts.length > 0 && (
        formData.contacts.map((contact, index) => (
          <Box key={index}>
            {/* Separator between contacts */}
            {index > 0 && (
              <Divider sx={{ my: 3, borderColor: '#CBCCCD' }} />
            )}

            {/* Contact Fields - Row 1 */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlySelectField
                  label="Contact Type"
                  value={getLabel(contact.contactType, CONTACT_TYPE_LABELS)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlyField
                  label="First Name"
                  value={contact.firstName}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlyField
                  label="Last Name"
                  value={contact.lastName}
                />
              </Grid>
            </Grid>

            {/* Contact Fields - Row 2 */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlyField
                  label="Email"
                  value={contact.email}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlySelectField
                  label="Status"
                  value={getLabel(contact.status, STATUS_LABELS)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlySelectField
                  label="Send email Notification"
                  value={getLabel(contact.sendEmailNotification, YES_NO_LABELS)}
                />
              </Grid>
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ContactsReview;
