import React, { useState, useEffect } from 'react';
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
  Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFieldArray, useWatch } from 'react-hook-form';
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';
import { defaultOperationalUnitAddressData, defaultOperationalUnitSuppressionEntryData } from '../schemas/addClientSchema';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';
import { FormDateField } from './FormDateField';
import { AssignContactsChips } from './AssignContactsChips';

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

// Address Type Options (Requirements 3.2)
const ADDRESS_TYPE_OPTIONS = [
  { value: 'billing', label: 'Billing' },
  { value: 'mailing', label: 'Mailing' },
  { value: 'physical', label: 'Physical' },
];

// Billing Attributes Override Options (Requirements 4.6-4.17)
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

// Payment Term Options (Requirements 4.14-4.17)
const PAYMENT_TERM_OPTIONS = [
  { value: '15', label: '15 Days' },
  { value: '30', label: '30 Days' },
  { value: '45', label: '45 Days' },
  { value: '60', label: '60 Days' },
];

// Day Type Options (Requirements 4.15, 4.17)
const DAY_TYPE_OPTIONS = [
  { value: 'calendar', label: 'Calendar Days' },
  { value: 'business', label: 'Business Days' },
];

// Suppression Type Options (Requirements 6.3)
const SUPPRESSION_TYPE_OPTIONS = [
  { value: 'billing', label: 'Billing Suppression' },
  { value: 'claims', label: 'Claims Suppression' },
  { value: 'fees', label: 'Fees Suppression' },
];

// Mock contact options for Assign Contacts dropdown (Task 3.3)
// These serve as fallback when no contacts are defined in ContactsAccessStep
const MOCK_CONTACT_OPTIONS = [
  { value: 'alice_johnson', label: 'Alice Johnson' },
  { value: 'james_williams', label: 'James Williams' },
  { value: 'sarah_davis', label: 'Sarah Davis' },
  { value: 'michael_brown', label: 'Michael Brown' },
  { value: 'emily_wilson', label: 'Emily Wilson' },
];

// Helper function to convert contacts from ContactsAccessStep to dropdown options
const getContactOptionsFromFormContacts = (
  contacts: AddClientCombinedFormData['contacts'] | undefined
): { value: string; label: string }[] => {
  if (!contacts || contacts.length === 0) {
    return MOCK_CONTACT_OPTIONS;
  }

  // Filter contacts that have at least first name or last name
  const validContacts = contacts.filter(
    (contact) => contact.firstName || contact.lastName
  );

  if (validContacts.length === 0) {
    return MOCK_CONTACT_OPTIONS;
  }

  return validContacts.map((contact, index) => ({
    value: `contact_${index}_${contact.email || index}`,
    label: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || `Contact ${index + 1}`,
  }));
};

interface OperationalUnitsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
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

// Payment Method Options (Requirement 5.1)
const PAYMENT_METHOD_OPTIONS = [
  { value: 'ach', label: 'ACH/EFT' },
  { value: 'check', label: 'Check' },
  { value: 'wire', label: 'Wire Transfer' },
];

// Bank Account Type Options (Requirement 5.3)
const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
];

// Billing Attributes Override Section Component (Task 5.1, 5.2)
// Requirements: 4.1-4.5, 5.1-5.6
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

  // Watch payment method to conditionally show bank account fields (Requirement 5.3-5.5)
  const paymentMethod = useWatch({
    control,
    name: `operationalUnits.${operationalUnitIndex}.billingAttributesOverride.paymentMethod`,
  });

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Check if payment method is ACH/EFT to show bank account fields (Requirement 5.3)
  const showBankAccountFields = paymentMethod === 'ach';

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
        {/* Billing Override Row 1: Claim Invoice Frequency, Fee Invoice Frequency, Invoice Aggregation Level */}
        {/* Requirements 4.6-4.8 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoiceFrequency`}
              control={control}
              label="Claim Invoice Frequency"
              options={INVOICE_FREQUENCY_OPTIONS}
              placeholder="Select invoice frequency"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.claimInvoiceFrequency}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoiceFrequency`}
              control={control}
              label="Fee Invoice Frequency"
              options={INVOICE_FREQUENCY_OPTIONS}
              placeholder="Select invoice frequency"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoiceFrequency}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceAggregationLevel`}
              control={control}
              label="Invoice Aggregation Level"
              options={INVOICE_AGGREGATION_OPTIONS}
              placeholder="Select Aggregation level"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceAggregationLevel}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 2: Invoice Type, Invoicing Claim Quantity Counts, Delivery Option */}
        {/* Requirements 4.9-4.11 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
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
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoicingClaimQuantityCounts`}
              control={control}
              label="Invoicing Claim Quantity Counts"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              placeholder="Select quantity count"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoicingClaimQuantityCounts}
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

        {/* Billing Override Row 3: Support Document Version, Invoice Static Data */}
        {/* Requirements 4.12-4.13 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.supportDocumentVersion`}
              control={control}
              label="Support Document Version"
              options={SUPPORT_DOC_VERSION_OPTIONS}
              placeholder="Select document version"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.supportDocumentVersion}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormTextField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.invoiceStaticData`}
              control={control}
              label="Invoice Static Data"
              placeholder="Enter invoice static data"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.invoiceStaticData}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 4: Fee Invoice Payment Term, Fee Invoice Payment Term Day Type */}
        {/* Requirements 4.14-4.15 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoicePaymentTerm`}
              control={control}
              label="Fee Invoice Payment Term"
              options={PAYMENT_TERM_OPTIONS}
              placeholder="Select No. of days"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoicePaymentTerm}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.feeInvoicePaymentTermDayType`}
              control={control}
              label="Fee Invoice Payment Term Day Type"
              options={DAY_TYPE_OPTIONS}
              placeholder="Select day type"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.feeInvoicePaymentTermDayType}
            />
          </Grid>
        </Grid>

        {/* Billing Override Row 5: Claim Invoice Payment Term, Claim Invoice Payment Term Day Type */}
        {/* Requirements 4.16-4.17 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoicePaymentTerm`}
              control={control}
              label="Claim Invoice Payment Term"
              options={PAYMENT_TERM_OPTIONS}
              placeholder="Select No. of days"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.claimInvoicePaymentTerm}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.claimInvoicePaymentTermDayType`}
              control={control}
              label="Claim Invoice Payment Term Day Type"
              options={DAY_TYPE_OPTIONS}
              placeholder="Select day type"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.claimInvoicePaymentTermDayType}
            />
          </Grid>
        </Grid>

        {/* Payment Method Section (Task 5.1, 5.2, 5.3) */}
        {/* Requirement 5.1: Payment Method dropdown */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormSelectField
              name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.paymentMethod`}
              control={control}
              label="Payment Method"
              options={PAYMENT_METHOD_OPTIONS}
              placeholder="Select payment method"
              error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.paymentMethod}
            />
          </Grid>
        </Grid>

        {/* Requirement 5.2: Horizontal divider after Payment Method */}
        {paymentMethod && (
          <Divider sx={{ my: 3, borderColor: '#AAAAAA' }} />
        )}

        {/* Requirement 5.3-5.6: Conditional bank account fields when Payment Method is ACH/EFT */}
        {showBankAccountFields && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.bankAccountType`}
                control={control}
                label="Bank Account Type"
                options={BANK_ACCOUNT_TYPE_OPTIONS}
                placeholder="Select bank account type"
                error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.bankAccountType}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.routingNumber`}
                control={control}
                label="Routing Number"
                placeholder="Enter routing number"
                error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.routingNumber}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name={`operationalUnits.${operationalUnitIndex}.billingAttributesOverride.accountNumber`}
                control={control}
                label="Account Number"
                placeholder="Enter account number"
                error={errors.operationalUnits?.[operationalUnitIndex]?.billingAttributesOverride?.accountNumber}
              />
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// Suppressions Section Component (Task 6)
// Requirements: 6.1-6.11
interface SuppressionsSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

const SuppressionsSection: React.FC<SuppressionsSectionProps> = ({
  control,
  errors,
  operationalUnitIndex,
  setValue,
}) => {
  // Watch addSuppressions value to conditionally show suppression fields (Requirement 6.2)
  const addSuppressions = useWatch({
    control,
    name: `operationalUnits.${operationalUnitIndex}.addSuppressions`,
  });

  // Nested useFieldArray for suppressions within each operational unit (Task 6.3)
  const { fields: suppressionFields, append: appendSuppression, remove: removeSuppression } = useFieldArray({
    control,
    name: `operationalUnits.${operationalUnitIndex}.suppressions`,
  });

  // Initialize with one entry when Yes is selected (Task 6.3)
  useEffect(() => {
    if (addSuppressions === true && suppressionFields.length === 0) {
      appendSuppression(defaultOperationalUnitSuppressionEntryData);
    }
  }, [addSuppressions, suppressionFields.length, appendSuppression]);

  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setValue(`operationalUnits.${operationalUnitIndex}.addSuppressions`, checked);
    
    // Clear suppressions when toggled off
    if (!checked && suppressionFields.length > 0) {
      for (let i = suppressionFields.length - 1; i >= 0; i--) {
        removeSuppression(i);
      }
    }
  };

  // Handle add another suppression (Task 6.4)
  const handleAddSuppression = () => {
    appendSuppression(defaultOperationalUnitSuppressionEntryData);
  };

  // Handle delete suppression (Task 6.5)
  const handleDeleteSuppression = (suppressionIndex: number) => {
    if (suppressionFields.length > 1) {
      removeSuppression(suppressionIndex);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Horizontal divider before suppressions section */}
      <Divider sx={{ mb: 3, borderColor: '#AAAAAA' }} />

      {/* Add Suppressions Toggle Switch (matching Contract Details) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#323334',
            }}
          >
            Add Suppressions
          </Typography>
          <Switch
            checked={addSuppressions === true}
            onChange={(e) => handleToggleChange(e.target.checked)}
            sx={{
              width: 36,
              height: 20,
              padding: 0,
              '& .MuiSwitch-switchBase': {
                padding: 0,
                margin: 0,
                transitionDuration: '300ms',
                '&.Mui-checked': {
                  transform: 'translateX(16px)',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#FFFFFF',
                    opacity: 1,
                    border: '2px solid #0C55B8',
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#0C55B8',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: '12px 12px',
                    },
                  },
                },
              },
              '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 20,
                height: 20,
                backgroundColor: '#0C55B8',
                boxShadow: 'none',
                position: 'relative',
              },
              '& .MuiSwitch-track': {
                borderRadius: '41px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #0C55B8',
                opacity: 1,
              },
            }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#4B4D4F',
            }}
          >
            Yes
          </Typography>
        </Box>

        {/* Suppression Entry Fields - shown only when toggle is on (Task 6.2, 6.3) */}
        {addSuppressions === true && (
          <Box sx={{ mt: 2 }}>
            {suppressionFields.map((suppressionField, suppressionIndex) => (
              <Box key={suppressionField.id}>
                {/* Horizontal divider between suppression entries (Task 6.6) */}
                {suppressionIndex > 0 && (
                  <Divider sx={{ my: 3, borderColor: '#AAAAAA' }} />
                )}

                {/* Suppression Entry Row (Task 6.2) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Grid container spacing={3} sx={{ flex: 1 }}>
                    {/* Suppression Type dropdown (Requirement 6.3) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormSelectField
                        name={`operationalUnits.${operationalUnitIndex}.suppressions.${suppressionIndex}.suppressionType`}
                        control={control}
                        label="Select Suppression Type"
                        options={SUPPRESSION_TYPE_OPTIONS}
                        placeholder="Select suppression type"
                        error={errors.operationalUnits?.[operationalUnitIndex]?.suppressions?.[suppressionIndex]?.suppressionType}
                      />
                    </Grid>
                    {/* Suppression Start Date picker (Requirement 6.4) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormDateField
                        name={`operationalUnits.${operationalUnitIndex}.suppressions.${suppressionIndex}.startDate`}
                        control={control}
                        label="Suppression Start Date"
                        placeholder="MM-DD-YYYY"
                        error={errors.operationalUnits?.[operationalUnitIndex]?.suppressions?.[suppressionIndex]?.startDate}
                      />
                    </Grid>
                    {/* Suppression End Date picker (Requirement 6.5) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormDateField
                        name={`operationalUnits.${operationalUnitIndex}.suppressions.${suppressionIndex}.endDate`}
                        control={control}
                        label="Suppression End Date"
                        placeholder="MM-DD-YYYY"
                        error={errors.operationalUnits?.[operationalUnitIndex]?.suppressions?.[suppressionIndex]?.endDate}
                      />
                    </Grid>
                  </Grid>

                  {/* Delete button for suppressions (except first) (Task 6.5) */}
                  {suppressionFields.length > 1 && suppressionIndex > 0 && (
                    <IconButton
                      onClick={() => handleDeleteSuppression(suppressionIndex)}
                      aria-label={`Delete suppression ${suppressionIndex + 1}`}
                      sx={{
                        color: '#C40000',
                        padding: '8px',
                        mt: 3,
                        '&:hover': {
                          backgroundColor: 'rgba(196, 0, 0, 0.08)',
                        },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: '20px' }} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}

            {/* Add another suppression button (Task 6.4) */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={handleAddSuppression}
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
                Add another suppression
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const OperationalUnitsStep: React.FC<OperationalUnitsStepProps> = ({
  control,
  errors,
  setValue,
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

  // Watch contacts from ContactsAccessStep (Task 3.3)
  // Use these contacts for the Assign Contacts dropdown
  const contacts = useWatch({
    control,
    name: 'contacts',
  });

  // Get contact options from form contacts or use mock data as fallback
  const contactOptions = getContactOptionsFromFormContacts(contacts);

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
      lobNumeric: '',
      lineOfBusiness: '',
      marketSegment: '',
      mrPlanType: '',
      mrGroupIndividual: '',
      mrClassification: '',
      passThroughTraditional: '',
      assignedContacts: [],
      addresses: [defaultOperationalUnitAddressData],
      billingAttributesOverride: undefined,
      addSuppressions: false,
      suppressions: [],
    });
    // Expand the newly added card
    setExpandedIndex(fields.length);
  };

  return (
    <Box>
      {/* Operational unit cards with 16px gap (Requirement 7.10) */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                {/* Basic Fields Section (Task 2) */}
                <Box>
                  {/* Row 1: Operational Unit Name, Operational Unit ID (disabled), LOB Numeric (Requirements 2.1-2.3, 9.4) */}
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
                      <Box sx={{ opacity: 0.5 }}>
                        <FormTextField
                          name={`operationalUnits.${index}.id`}
                          control={control}
                          label="Operational Unit ID"
                          required
                          placeholder="Enter name"
                          disabled
                          error={errors.operationalUnits?.[index]?.id}
                        />
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormTextField
                        name={`operationalUnits.${index}.lobNumeric`}
                        control={control}
                        label="LOB Numeric"
                        required
                        placeholder="Enter name"
                        error={errors.operationalUnits?.[index]?.lobNumeric}
                      />
                    </Grid>
                  </Grid>

                  {/* Row 2: Market Segment, Line of Business, M&R Plan Type (Requirements 2.4-2.6, 9.5) */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
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
                  </Grid>

                  {/* Row 3: M&R Group/Individual, M&R Classification, Pass through/Traditional pricing (Requirements 2.7-2.9, 9.6) */}
                  <Grid container spacing={3}>
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
                  </Grid>

                  {/* Assign Contacts Chips Section (Task 3) */}
                  {/* Requirements 2.10-2.13, 9.7 */}
                  <AssignContactsChips
                    control={control}
                    operationalUnitIndex={index}
                    availableContacts={contactOptions}
                  />
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

                {/* Suppressions Section (Task 6) */}
                <SuppressionsSection
                  control={control}
                  errors={errors}
                  operationalUnitIndex={index}
                  setValue={setValue}
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
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddOperationalUnit}
          sx={{
            color: '#002677',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            padding: '12px 24px',
            borderRadius: '999px',
            borderColor: '#002677',
            borderWidth: '2px',
            backgroundColor: '#FAF8F2',
            '&:hover': {
              backgroundColor: '#F5F1E8',
              borderColor: '#002677',
              borderWidth: '2px',
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
