import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFieldArray, useWatch } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';
import { defaultOperationalUnitAddressData } from '../schemas/addClientSchema';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';

// Dropdown options constants (Requirements 2.3-2.8)
// Market Segment Options (Requirement 2.3)
const MARKET_SEGMENT_OPTIONS = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'exchange', label: 'Exchange' },
];

// Line of Business Options (Requirement 2.4)
const LINE_OF_BUSINESS_OPTIONS = [
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'medical', label: 'Medical' },
  { value: 'dental', label: 'Dental' },
  { value: 'vision', label: 'Vision' },
];

// M&R Plan Type Options (Requirement 2.5)
const MR_PLAN_TYPE_OPTIONS = [
  { value: 'mapd', label: 'MAPD' },
  { value: 'pdp', label: 'PDP' },
  { value: 'egwp', label: 'EGWP' },
];

// M&R Group/Individual Options (Requirement 2.6)
const MR_GROUP_INDIVIDUAL_OPTIONS = [
  { value: 'group', label: 'Group' },
  { value: 'individual', label: 'Individual' },
];

// M&R Classification Options (Requirement 2.7)
const MR_CLASSIFICATION_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'low_income', label: 'Low Income Subsidy' },
  { value: 'dual_eligible', label: 'Dual Eligible' },
];

// Pass Through/Traditional Pricing Options (Requirement 2.8)
const PRICING_OPTIONS = [
  { value: 'pass_through', label: 'Pass Through' },
  { value: 'traditional', label: 'Traditional' },
];

// Assign Contacts Options (Requirement 2.10)
const ASSIGN_CONTACTS_OPTIONS = [
  { value: 'primary', label: 'Primary Contact' },
  { value: 'billing', label: 'Billing Contact' },
  { value: 'technical', label: 'Technical Contact' },
  { value: 'executive', label: 'Executive Sponsor' },
];

// Address Type Options (Requirements 3.2)
const ADDRESS_TYPE_OPTIONS = [
  { value: 'billing', label: 'Billing' },
  { value: 'mailing', label: 'Mailing' },
  { value: 'physical', label: 'Physical' },
];

// Billing Attributes Override Options (Requirements 4.1-4.5)
// Mirrored from ContractDetailsStep billing section
const INVOICE_BREAKOUT_OPTIONS = [
  { value: 'client', label: 'Client' },
  { value: 'operational_unit', label: 'Operational Unit' },
  { value: 'both', label: 'Both' },
];

const INVOICE_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const INVOICE_AGGREGATION_OPTIONS = [
  { value: 'client', label: 'Client' },
  { value: 'operational_unit', label: 'Operational Unit' },
  { value: 'contract', label: 'Contract' },
];

const INVOICE_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'detailed', label: 'Detailed' },
  { value: 'summary', label: 'Summary' },
];

const DELIVERY_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'portal', label: 'Portal' },
  { value: 'mail', label: 'Mail' },
];

const SUPPORT_DOC_VERSION_OPTIONS = [
  { value: 'v1', label: 'Version 1' },
  { value: 'v2', label: 'Version 2' },
  { value: 'v3', label: 'Version 3' },
];

interface OperationalUnitsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
}

// Nested component for address fields within each operational unit (Task 4.2)
interface OperationalUnitAddressSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}

const OperationalUnitAddressSection: React.FC<OperationalUnitAddressSectionProps> = ({
  control,
  errors,
  operationalUnitIndex,
}) => {
  // Nested useFieldArray for addresses within each operational unit (Task 4.2)
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control,
    name: `operationalUnits.${operationalUnitIndex}.addresses`,
  });

  const handleAddAddress = () => {
    appendAddress(defaultOperationalUnitAddressData);
  };

  const handleDeleteAddress = (addressIndex: number) => {
    if (addressFields.length > 1) {
      removeAddress(addressIndex);
    }
  };

  return (
    <Box>
      {addressFields.map((addressField, addressIndex) => (
        <Box key={addressField.id}>
          {/* Delete button for addresses after the first (Task 4.4) */}
          {addressIndex > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton
                onClick={() => handleDeleteAddress(addressIndex)}
                aria-label={`Delete address ${addressIndex + 1}`}
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

          {/* Address Row 1: Address Type, Address 1, Address 2 (Requirements 3.2-3.4, 7.8) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.addressType`}
                control={control}
                label="Address Type"
                required
                options={ADDRESS_TYPE_OPTIONS}
                placeholder="Select Address type"
                error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.addressType}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.address1`}
                control={control}
                label="Address 1"
                required
                placeholder="Enter Address 1"
                error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.address1}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.address2`}
                control={control}
                label="Address 2"
                required
                placeholder="Enter Address 2"
                error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.address2}
              />
            </Grid>
          </Grid>

          {/* Address Row 2: City, State, Zip (Requirements 3.5-3.7, 7.9) */}
          <Grid container spacing={3} sx={{ mb: addressIndex < addressFields.length - 1 ? 3 : 0 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.city`}
                control={control}
                label="City"
                required
                placeholder="Enter city"
                error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.city}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.state`}
                control={control}
                label="State"
                required
                placeholder="Enter state"
                error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.state}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.addresses.${addressIndex}.zip`}
                control={control}
                label="Zip"
                required
                placeholder="Enter zip"
                error={errors.operationalUnits?.[operationalUnitIndex]?.addresses?.[addressIndex]?.zip}
              />
            </Grid>
          </Grid>

          {/* Divider between multiple addresses */}
          {addressIndex < addressFields.length - 1 && (
            <Divider sx={{ my: 3, borderColor: '#AAAAAA' }} />
          )}
        </Box>
      ))}

      {/* Add another billing address button (Task 4.5) */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddAddress}
          sx={{
            color: '#0C55B8',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: 'rgba(12, 85, 184, 0.08)',
            },
          }}
        >
          Add another billing address
        </Button>
      </Box>
    </Box>
  );
};

// Billing Attributes Override Section Component (Task 5.1, 5.2)
// Requirements: 4.1-4.5
interface BillingAttributesOverrideSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}

const BillingAttributesOverrideSection: React.FC<BillingAttributesOverrideSectionProps> = ({
  control,
  errors,
  operationalUnitIndex,
}) => {
  const [expanded, setExpanded] = useState(false);

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
        mt: 3,
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          margin: 0,
          marginTop: '24px',
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
            fontSize: '20px',
            fontWeight: 700,
            color: '#323334',
            lineHeight: 1.2,
          }}
        >
          Billing Attributes
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4,
          }}
        >
          You may override the billing attributes outlined under the contract details section here.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 24px 24px 24px',
        }}
      >
        {/* Billing Override Row 1: Invoice Breakout, Claim Invoice Frequency, Fee Invoice Frequency */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceBreakout`}
              control={control}
              label="Invoice Breakout"
              options={INVOICE_BREAKOUT_OPTIONS}
              placeholder="Select invoice breakout"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceBreakout}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoiceFrequency`}
              control={control}
              label="Claim Invoice Frequency"
              options={INVOICE_FREQUENCY_OPTIONS}
              placeholder="Select frequency"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.claimInvoiceFrequency}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoiceFrequency`}
              control={control}
              label="Fee Invoice Frequency"
              options={INVOICE_FREQUENCY_OPTIONS}
              placeholder="Select frequency"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoiceFrequency}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 2: Invoice Aggregation Level, Invoice Type, Delivery Option */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceAggregationLevel`}
              control={control}
              label="Invoice Aggregation Level"
              options={INVOICE_AGGREGATION_OPTIONS}
              placeholder="Select aggregation level"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceAggregationLevel}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceType`}
              control={control}
              label="Invoice Type"
              options={INVOICE_TYPE_OPTIONS}
              placeholder="Select invoice type"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceType}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.deliveryOption`}
              control={control}
              label="Delivery Option"
              options={DELIVERY_OPTIONS}
              placeholder="Select delivery option"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.deliveryOption}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 3: Support Document Version */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.supportDocumentVersion`}
              control={control}
              label="Support Document Version"
              options={SUPPORT_DOC_VERSION_OPTIONS}
              placeholder="Select version"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.supportDocumentVersion}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export const OperationalUnitsStep: React.FC<OperationalUnitsStepProps> = ({
  control,
  errors,
}) => {
  // Track which operational unit card is expanded (index-based)
  // Initialize to 0 so first card is expanded by default (Requirement 1.4)
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  // Field array for operational units (Requirement 8.4)
  // Task 6.4: Add append and remove methods for managing multiple units
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'operationalUnits',
  });

  // Watch all operational units to get current names for collapsed card titles
  const operationalUnits = useWatch({
    control,
    name: 'operationalUnits',
  });

  // Task 6.1: Implement accordion expand/collapse logic
  // Only one card expanded at a time - clicking collapsed card expands it and collapses others
  const handleAccordionChange = (index: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : -1);
  };

  // Task 6.3: Handle delete operational unit
  // Requirements 5.7, 5.8
  const handleDeleteOperationalUnit = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Adjust expanded index if needed
      if (expandedIndex === index) {
        // If deleting the expanded card, expand the previous one or the first one
        setExpandedIndex(index > 0 ? index - 1 : 0);
      } else if (expandedIndex > index) {
        // If deleting a card before the expanded one, adjust the index
        setExpandedIndex(expandedIndex - 1);
      }
    }
  };

  // Task 6.4: Handle add new operational unit
  // Requirements 5.2, 5.3
  const handleAddOperationalUnit = () => {
    append({
      name: '',
      id: '',
      lineOfBusiness: '',
      runOffPeriod: '',
      marketSegment: '',
      mrPlanType: '',
      mrGroupIndividual: '',
      mrClassification: '',
      passThroughTraditional: '',
      assignContacts: '',
      addresses: [defaultOperationalUnitAddressData],
      billingAttributesOverride: undefined,
    });
    // Expand the newly added card
    setExpandedIndex(fields.length);
  };

  return (
    <Box>
      {/* Operational unit cards with 56px gap (Requirement 5.10) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {fields.map((field, index) => {
          const isExpanded = expandedIndex === index;
          // Task 6.2: Get the operational unit name for collapsed card title
          // Requirements 5.5, 5.6
          // Use watched values to get the current name (not the initial field value)
          const unitName = operationalUnits?.[index]?.name || '';
          const displayTitle = isExpanded
            ? 'Operational Units'
            : `Operational Units${unitName ? ` - ${unitName}` : ''}`;

          return (
            <Accordion
              key={field.id}
              expanded={isExpanded}
              onChange={handleAccordionChange(index)}
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
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  },
                  '& .MuiAccordionSummary-content.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '23px',
                      fontWeight: 700,
                      color: '#323334',
                      lineHeight: 1.2,
                    }}
                  >
                    {displayTitle}
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
                </Box>
                {/* Task 6.3: Delete button on collapsed cards (only when multiple units exist) */}
                {/* Requirements 5.7, 5.8 */}
                {!isExpanded && fields.length > 1 && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion from expanding
                      handleDeleteOperationalUnit(index);
                    }}
                    aria-label={`Delete operational unit ${index + 1}`}
                    sx={{
                      color: '#C40000',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(196, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                )}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: '30px 24px',
                }}
              >
                {/* Basic Fields Section (Task 3) */}
                <Box>
                  {/* Row 1: Operational Unit Name, Operational Unit ID, Market Segment (Requirements 2.1-2.3, 7.4) */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormTextField
                        name={`operationalUnits.${index}.name`}
                        control={control}
                        label="Operational Unit Name"
                        required
                        placeholder="Enter name"
                        error={errors.operationalUnits?.[index]?.name}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormTextField
                        name={`operationalUnits.${index}.id`}
                        control={control}
                        label="Operational Unit ID"
                        required
                        placeholder="Enter name"
                        error={errors.operationalUnits?.[index]?.id}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.marketSegment`}
                        control={control}
                        label="Market Segment"
                        options={MARKET_SEGMENT_OPTIONS}
                        placeholder="Select market segment"
                        error={errors.operationalUnits?.[index]?.marketSegment}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 2: Line of Business, M&R Plan Type, M&R Group/Individual (Requirements 2.4-2.6, 7.5) */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.lineOfBusiness`}
                        control={control}
                        label="Line of Business"
                        required
                        options={LINE_OF_BUSINESS_OPTIONS}
                        placeholder="Select line of business"
                        error={errors.operationalUnits?.[index]?.lineOfBusiness}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.mrPlanType`}
                        control={control}
                        label="M&R Plan Type"
                        options={MR_PLAN_TYPE_OPTIONS}
                        placeholder="Select M&R plan type"
                        error={errors.operationalUnits?.[index]?.mrPlanType}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.mrGroupIndividual`}
                        control={control}
                        label="M&R Group/Individual"
                        options={MR_GROUP_INDIVIDUAL_OPTIONS}
                        placeholder="Select M&R grouping"
                        error={errors.operationalUnits?.[index]?.mrGroupIndividual}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 3: M&R Classification, Pass through/Traditional pricing, Run-off Period (Requirements 2.7-2.9, 7.6) */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.mrClassification`}
                        control={control}
                        label="M&R Classification"
                        options={MR_CLASSIFICATION_OPTIONS}
                        placeholder="Select M&R classification"
                        error={errors.operationalUnits?.[index]?.mrClassification}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.passThroughTraditional`}
                        control={control}
                        label="Pass through/Traditional pricing"
                        options={PRICING_OPTIONS}
                        placeholder="Select"
                        error={errors.operationalUnits?.[index]?.passThroughTraditional}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormTextField
                        name={`operationalUnits.${index}.runOffPeriod`}
                        control={control}
                        label="Run-off Period"
                        required
                        placeholder="Enter Period"
                        error={errors.operationalUnits?.[index]?.runOffPeriod}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 4: Assign Contacts (Requirements 2.10, 7.7) */}
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${index}.assignContacts`}
                        control={control}
                        label="Assign Contacts"
                        options={ASSIGN_CONTACTS_OPTIONS}
                        placeholder="Select contacts"
                        error={errors.operationalUnits?.[index]?.assignContacts}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* Horizontal separator between basic fields and address section (Task 4.1) */}
                <Divider sx={{ my: 3, borderColor: '#AAAAAA' }} />

                {/* Address Section (Task 4) */}
                <OperationalUnitAddressSection
                  control={control}
                  errors={errors}
                  operationalUnitIndex={index}
                />

                {/* Billing Attributes Override Section (Task 5) */}
                <BillingAttributesOverrideSection
                  control={control}
                  errors={errors}
                  operationalUnitIndex={index}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Task 6.4: Add another operational unit button */}
      {/* Requirements 5.2, 5.3 */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={handleAddOperationalUnit}
          sx={{
            color: '#0C55B8',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: 'rgba(12, 85, 184, 0.08)',
            },
          }}
        >
          Add another operational unit
        </Button>
      </Box>
    </Box>
  );
};

export default OperationalUnitsStep;
