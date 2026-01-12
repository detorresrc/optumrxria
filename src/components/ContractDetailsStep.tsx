import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  Button,
  Switch,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import type { Control, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';
import { FormDateField } from './FormDateField';
import { SuppressionRow } from './SuppressionRow';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';
import { defaultSuppressionEntryData } from '../schemas/addClientSchema';

interface ContractDetailsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  watch: UseFormWatch<AddClientCombinedFormData>;
  setValue: UseFormSetValue<AddClientCombinedFormData>;
}

// Dropdown options per design document
const SOURCE_OPTIONS = [
  { value: 'direct', label: 'Direct' },
  { value: 'referral', label: 'Referral' },
  { value: 'partner', label: 'Partner' },
];

const ASSIGNED_TO_OPTIONS = [
  { value: 'user1', label: 'User 1' },
  { value: 'user2', label: 'User 2' },
  { value: 'user3', label: 'User 3' },
];

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

const PAYMENT_METHOD_OPTIONS = [
  { value: 'ach', label: 'ACH' },
  { value: 'check', label: 'Check' },
  { value: 'wire', label: 'Wire Transfer' },
];

const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
];

const CLAIM_QUANTITY_OPTIONS = [
  { value: 'scripts', label: 'Scripts' },
  { value: 'claims', label: 'Claims' },
  { value: 'both', label: 'Both' },
];

// Payment Term Days options (Requirements 3.12, 3.14)
const PAYMENT_TERM_DAYS_OPTIONS = [
  { value: '15', label: '15' },
  { value: '30', label: '30' },
  { value: '45', label: '45' },
  { value: '60', label: '60' },
  { value: '90', label: '90' },
];

// Day Type options (Requirements 3.13, 3.15)
const DAY_TYPE_OPTIONS = [
  { value: 'calendar', label: 'Calendar Days' },
  { value: 'business', label: 'Business Days' },
];


export const ContractDetailsStep: React.FC<ContractDetailsStepProps> = ({
  control,
  errors,
  watch,
  setValue,
}) => {
  const [expanded, setExpanded] = useState(true);
  const paymentMethod = watch('paymentMethod');
  const addSuppressions = watch('addSuppressions');

  // useFieldArray for dynamic suppressions management (Requirements 5.7, 5.9)
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'suppressions',
  });

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  // Add a new suppression row (Requirements 5.7)
  const handleAddSuppression = () => {
    append(defaultSuppressionEntryData);
  };

  // Remove a suppression row (Requirements 5.9)
  const handleRemoveSuppression = (index: number) => {
    remove(index);
  };

  // Auto-add first suppression row when "Yes" is selected and no rows exist
  useEffect(() => {
    if (addSuppressions === 'yes' && fields.length === 0) {
      append(defaultSuppressionEntryData);
    }
  }, [addSuppressions, fields.length, append]);

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
          Contract Details
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
          padding: '30px 24px 24px 24px',
        }}
      >
        {/* Contract Information Fields - Three Column Layout */}
        <Box sx={{ mb: 3 }}>
          {/* Row 1: Client Contract ID, Effective Date, Termination Date */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="clientContractId"
                control={control}
                label="Client Contract ID"
                placeholder="Enter contract ID"
                error={errors.clientContractId}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormDateField
                name="effectiveDate"
                control={control}
                label="Effective Date"
                required
                error={errors.effectiveDate}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormDateField
                name="terminationDate"
                control={control}
                label="Termination Date"
                error={errors.terminationDate}
              />
            </Grid>
          </Grid>

          {/* Row 2: Contract Term, Client Membership, Client DOA Signor */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="contractTerm"
                control={control}
                label="Contract Term"
                placeholder="Enter contract term"
                error={errors.contractTerm}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="clientMembership"
                control={control}
                label="Client Membership"
                placeholder="Enter client membership"
                error={errors.clientMembership}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="clientDoaSignor"
                control={control}
                label="Client DOA Signor"
                placeholder="Enter client DOA signor"
                error={errors.clientDoaSignor}
              />
            </Grid>
          </Grid>

          {/* Row 3: Contracting Legal Entity for OptumRx, Contracting Legal Entity for Client, Assigned To */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="contractingLegalEntityOptumRx"
                control={control}
                label="Contracting Legal Entity for OptumRx"
                placeholder="Enter legal entity"
                error={errors.contractingLegalEntityOptumRx}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="contractingLegalEntityClient"
                control={control}
                label="Contracting Legal Entity for Client"
                placeholder="Enter legal entity"
                error={errors.contractingLegalEntityClient}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="assignedTo"
                control={control}
                label="Assigned to"
                options={ASSIGNED_TO_OPTIONS}
                placeholder="Select Assigned to"
                error={errors.assignedTo}
              />
            </Grid>
          </Grid>

          {/* Row 4: Run-Off Effective Date, Source */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormDateField
                name="runOffEffectiveDate"
                control={control}
                label="Run-Off Effective Date"
                error={errors.runOffEffectiveDate}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="contractSource"
                control={control}
                label="Source"
                required
                options={SOURCE_OPTIONS}
                placeholder="Select source"
                error={errors.contractSource}
              />
            </Grid>
          </Grid>
        </Box>


        {/* Billing Attributes Section */}
        <Box
          sx={{
            border: '1px solid #CBCCCD',
            borderRadius: '12px',
            p: 3,
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#000000',
              mb: 0.5,
            }}
          >
            Billing Attributes
          </Typography>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#4B4D4F',
              mb: 3,
            }}
          >
            You may override the billing attributes outlined under the contract details section here.
          </Typography>

          {/* Billing Row 1: Invoice Breakout, Claim Invoice Frequency, Fee Invoice Frequency */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="invoiceBreakout"
                control={control}
                label="Invoice Breakout"
                required
                options={INVOICE_BREAKOUT_OPTIONS}
                placeholder="Select invoice breakout"
                error={errors.invoiceBreakout}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="claimInvoiceFrequency"
                control={control}
                label="Claim Invoice Frequency"
                required
                options={INVOICE_FREQUENCY_OPTIONS}
                placeholder="Select frequency"
                error={errors.claimInvoiceFrequency}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="feeInvoiceFrequency"
                control={control}
                label="Fee Invoice Frequency"
                required
                options={INVOICE_FREQUENCY_OPTIONS}
                placeholder="Select frequency"
                error={errors.feeInvoiceFrequency}
              />
            </Grid>
          </Grid>


          {/* Billing Row 2: Invoice Aggregation Level, Invoice Type, Invoicing Claim Quantity Counts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="invoiceAggregationLevel"
                control={control}
                label="Invoice Aggregation level"
                required
                options={INVOICE_AGGREGATION_OPTIONS}
                placeholder="Select aggregation level"
                error={errors.invoiceAggregationLevel}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="invoiceType"
                control={control}
                label="Invoice Type"
                required
                options={INVOICE_TYPE_OPTIONS}
                placeholder="Select invoice type"
                error={errors.invoiceType}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="invoicingClaimQuantityCounts"
                control={control}
                label="Invoicing Claim Quantity Counts"
                options={CLAIM_QUANTITY_OPTIONS}
                placeholder="Select quantity counts"
                error={errors.invoicingClaimQuantityCounts}
              />
            </Grid>
          </Grid>

          {/* Billing Row 3: Delivery Option, Support Document Version, Invoice Static Data */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="deliveryOption"
                control={control}
                label="Delivery Option"
                required
                options={DELIVERY_OPTIONS}
                placeholder="Select delivery option"
                error={errors.deliveryOption}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="supportDocumentVersion"
                control={control}
                label="Support Document Version"
                required
                options={SUPPORT_DOC_VERSION_OPTIONS}
                placeholder="Select version"
                error={errors.supportDocumentVersion}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="invoiceStaticData"
                control={control}
                label="Invoice Static Data"
                placeholder="Enter invoice static data"
                error={errors.invoiceStaticData}
              />
            </Grid>
          </Grid>

          {/* Billing Row 4: Fee Invoice Payment Term, Fee Invoice Payment Term Day Type */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="feeInvoicePaymentTerm"
                control={control}
                label="Fee Invoice Payment Term"
                options={PAYMENT_TERM_DAYS_OPTIONS}
                placeholder="Select No. of days"
                error={errors.feeInvoicePaymentTerm}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="feeInvoicePaymentTermDayType"
                control={control}
                label="Fee Invoice Payment Term Day Type"
                options={DAY_TYPE_OPTIONS}
                placeholder="Select day type"
                error={errors.feeInvoicePaymentTermDayType}
              />
            </Grid>
          </Grid>

          {/* Billing Row 5: Claim Invoice Payment Term, Claim Invoice Payment Term Day Type */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="claimInvoicePaymentTerm"
                control={control}
                label="Claim Invoice Payment Term"
                options={PAYMENT_TERM_DAYS_OPTIONS}
                placeholder="Select No. of days"
                error={errors.claimInvoicePaymentTerm}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="claimInvoicePaymentTermDayType"
                control={control}
                label="Claim Invoice Payment Term Day Type"
                options={DAY_TYPE_OPTIONS}
                placeholder="Select day type"
                error={errors.claimInvoicePaymentTermDayType}
              />
            </Grid>
          </Grid>

          {/* Payment Method - Separate row before ACH fields (Requirements 4.1-4.7) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name="paymentMethod"
                control={control}
                label="Payment Method"
                options={PAYMENT_METHOD_OPTIONS}
                placeholder="Select payment method"
                error={errors.paymentMethod}
              />
            </Grid>
          </Grid>

          {/* Autopay Information Section - Conditional based on Payment Method (Requirements 4.1-4.7) */}
          {paymentMethod === 'ach' && (
            <>
              {/* Horizontal divider between Payment Method and ACH fields */}
              <Box
                sx={{
                  borderTop: '1px solid #CBCCCD',
                  my: 3,
                }}
              />

              {/* ACH Row 1: Bank Account Type, Routing Number, Account Number (three-column layout) */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormSelectField
                    name="bankAccountType"
                    control={control}
                    label="Bank Account Type"
                    required
                    options={BANK_ACCOUNT_TYPE_OPTIONS}
                    placeholder="Select bank account type"
                    error={errors.bankAccountType}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField
                    name="routingNumber"
                    control={control}
                    label="Routing Number"
                    required
                    placeholder="Enter routing number"
                    error={errors.routingNumber}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField
                    name="accountNumber"
                    control={control}
                    label="Account Number"
                    required
                    placeholder="Enter account number"
                    error={errors.accountNumber}
                  />
                </Grid>
              </Grid>

              {/* ACH Row 2: Account Holder Name (second row) */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormTextField
                    name="accountHolderName"
                    control={control}
                    label="Account Holder Name"
                    required
                    placeholder="Enter account holder name"
                    error={errors.accountHolderName}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Add Suppressions Toggle Switch */}
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
                checked={addSuppressions === 'yes'}
                onChange={(e) => {
                  setValue('addSuppressions', e.target.checked ? 'yes' : 'no');
                }}
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

            {/* Suppression fields - shown only when "Yes" is selected (Requirements 5.2, 5.3) */}
            {addSuppressions === 'yes' && (
              <Box sx={{ mt: 2 }}>
                {/* Render suppression rows */}
                {fields.map((field, index) => (
                  <SuppressionRow
                    key={field.id}
                    index={index}
                    control={control}
                    errors={errors}
                    onRemove={() => handleRemoveSuppression(index)}
                    showDelete={true}
                    showDivider={index > 0}
                  />
                ))}

                {/* Add another suppression button (Requirements 5.10) */}
                <Button
                  onClick={handleAddSuppression}
                  startIcon={<AddIcon />}
                  sx={{
                    mt: 3,
                    color: '#0C55B8',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    padding: '8px 0',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Add another suppression
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContractDetailsStep;
