import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';
import { FormRadioGroup } from './FormRadioGroup';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ContactsAccessStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  contactFields: FieldArrayWithId<AddClientCombinedFormData, 'contacts'>[];
  appendContact: UseFieldArrayAppend<AddClientCombinedFormData, 'contacts'>;
  removeContact: UseFieldArrayRemove;
}

// Contact Type dropdown options per design document
const CONTACT_TYPE_OPTIONS = [
  { value: 'primary', label: 'Primary Contact' },
  { value: 'billing', label: 'Billing Contact' },
  { value: 'technical', label: 'Technical Contact' },
  { value: 'executive', label: 'Executive Sponsor' },
];

// Status dropdown options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

// Send email notification radio options
const NOTIFICATION_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export const ContactsAccessStep: React.FC<ContactsAccessStepProps> = ({
  control,
  errors,
  contactFields,
  appendContact,
  removeContact,
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleAddContact = () => {
    appendContact({
      contactType: '',
      firstName: '',
      lastName: '',
      email: '',
      status: '',
      sendEmailNotification: 'yes',
    });
  };

  const handleRemoveContact = (index: number) => {
    if (contactFields.length > 1 && index > 0) {
      removeContact(index);
    }
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
          Contacts & Access
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
          padding: '0 24px 30px 24px',
        }}
      >
        {contactFields.map((field, index) => (
          <React.Fragment key={field.id}>
            {/* Separator line between contact entries */}
            {index > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: '56px',
                  mb: 3,
                }}
              >
                <Divider
                  sx={{
                    flex: 1,
                    borderColor: '#AAAAAA',
                  }}
                />
                {/* Delete button for contacts except the first one */}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveContact(index)}
                  aria-label={`Delete contact ${index + 1}`}
                  sx={{
                    ml: 1,
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

            {/* Contact Entry Fields */}
            <Box>
              {/* Row 1: Contact Type, First Name, Last Name */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormSelectField
                    name={`contacts.${index}.contactType`}
                    control={control}
                    label="Contact Type"
                    required
                    options={CONTACT_TYPE_OPTIONS}
                    placeholder="Select contact type"
                    error={errors.contacts?.[index]?.contactType}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField
                    name={`contacts.${index}.firstName`}
                    control={control}
                    label="First Name"
                    required
                    placeholder="Enter first name"
                    error={errors.contacts?.[index]?.firstName}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField
                    name={`contacts.${index}.lastName`}
                    control={control}
                    label="Last Name"
                    required
                    placeholder="Enter last name"
                    error={errors.contacts?.[index]?.lastName}
                  />
                </Grid>
              </Grid>

              {/* Row 2: Email, Status, Send email Notification */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField
                    name={`contacts.${index}.email`}
                    control={control}
                    label="Email"
                    required
                    placeholder="Enter email"
                    error={errors.contacts?.[index]?.email}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormSelectField
                    name={`contacts.${index}.status`}
                    control={control}
                    label="Status"
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                    error={errors.contacts?.[index]?.status}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormRadioGroup
                    name={`contacts.${index}.sendEmailNotification`}
                    control={control}
                    label="Send email Notification"
                    options={NOTIFICATION_OPTIONS}
                    error={errors.contacts?.[index]?.sendEmailNotification}
                  />
                </Grid>
              </Grid>
            </Box>
          </React.Fragment>
        ))}

        {/* Add another contact button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleAddContact}
            sx={{
              color: '#0C55B8',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'rgba(12, 85, 184, 0.08)',
              },
            }}
          >
            Add another contact
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContactsAccessStep;
