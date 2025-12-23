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
import type { Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import { FormTextField } from './FormTextField';
import { FormSelectField } from './FormSelectField';
import { FormDateField } from './FormDateField';
import { FormRadioGroup } from './FormRadioGroup';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ContractDetailsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  watch: UseFormWatch<AddClientCombinedFormData>;
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

const RADIO_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];


export const ContractDetailsStep: React.FC<ContractDetailsStepProps> = ({
  control,
  errors,
  watch,
}) => {
  const [expanded, setExpanded] = useState(true);
  const paymentMethod = watch('paymentMethod');

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
          padding: '0 24px 24px 24px',
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
            Complete the fields below.
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

          {/* Billing Row 3: Delivery Option, Support Document Version, Claim Invoice Payment Term */}
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
                name="claimInvoicePaymentTerm"
                control={control}
                label="Claim Invoice Payment Term"
                placeholder="Enter payment term"
                error={errors.claimInvoicePaymentTerm}
              />
            </Grid>
          </Grid>

          {/* Billing Row 4: Fee Invoice Payment Term, Payment Method */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField
                name="feeInvoicePaymentTerm"
                control={control}
                label="Fee Invoice Payment Term"
                placeholder="Enter payment term"
                error={errors.feeInvoicePaymentTerm}
              />
            </Grid>
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

          {/* Radio Button Groups */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormRadioGroup
              name="suppressRejectedClaims"
              control={control}
              label="Suppress Rejected Claims?"
              options={RADIO_OPTIONS}
              error={errors.suppressRejectedClaims}
            />
            <FormRadioGroup
              name="suppressNetZeroClaims"
              control={control}
              label="Suppress Net-zero claims?"
              options={RADIO_OPTIONS}
              error={errors.suppressNetZeroClaims}
            />
          </Box>
        </Box>


        {/* Autopay Information Section - Conditional based on Payment Method */}
        {paymentMethod === 'ach' && (
          <Box
            sx={{
              border: '1px solid #CBCCCD',
              borderRadius: '12px',
              p: 3,
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
              Autopay Information
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#4B4D4F',
                mb: 3,
              }}
            >
              You have chosen ACH as your payment method. Please complete the fields below.
            </Typography>

            {/* Autopay Row: Bank Account Type, Routing Number, Account Number, Account Holder Name */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormSelectField
                  name="bankAccountType"
                  control={control}
                  label="Bank Account Type"
                  required
                  options={BANK_ACCOUNT_TYPE_OPTIONS}
                  placeholder="Select account type"
                  error={errors.bankAccountType}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormTextField
                  name="routingNumber"
                  control={control}
                  label="Routing Number"
                  required
                  placeholder="Enter routing number"
                  error={errors.routingNumber}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormTextField
                  name="accountNumber"
                  control={control}
                  label="Account Number"
                  required
                  placeholder="Enter account number"
                  error={errors.accountNumber}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
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
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ContractDetailsStep;
