import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { ReadOnlyField } from './ReadOnlyField';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

interface ContractDetailsReviewProps {
  formData: AddClientCombinedFormData;
}

// Label mappings for dropdown values
const SOURCE_LABELS: Record<string, string> = {
  direct: 'Direct',
  referral: 'Referral',
  partner: 'Partner',
};

const ASSIGNED_TO_LABELS: Record<string, string> = {
  user1: 'User 1',
  user2: 'User 2',
  user3: 'User 3',
};

const INVOICE_BREAKOUT_LABELS: Record<string, string> = {
  client: 'Client',
  operational_unit: 'Operational Unit',
  both: 'Both',
};

const INVOICE_FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

const INVOICE_AGGREGATION_LABELS: Record<string, string> = {
  client: 'Client',
  operational_unit: 'Operational Unit',
  contract: 'Contract',
};

const INVOICE_TYPE_LABELS: Record<string, string> = {
  standard: 'Standard',
  detailed: 'Detailed',
  summary: 'Summary',
};

const DELIVERY_LABELS: Record<string, string> = {
  email: 'Email',
  portal: 'Portal',
  mail: 'Mail',
};

const SUPPORT_DOC_VERSION_LABELS: Record<string, string> = {
  v1: 'Version 1',
  v2: 'Version 2',
  v3: 'Version 3',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  ach: 'ACH',
  check: 'Check',
  wire: 'Wire Transfer',
};

const BANK_ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
};

const CLAIM_QUANTITY_LABELS: Record<string, string> = {
  scripts: 'Scripts',
  claims: 'Claims',
  both: 'Both',
};

const YES_NO_LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
};

export const ContractDetailsReview: React.FC<ContractDetailsReviewProps> = ({
  formData,
}) => {
  const getLabel = (value: string | undefined, labels: Record<string, string>) => {
    return value ? labels[value] || value : undefined;
  };

  return (
    <Box>
      {/* Contract Information Fields */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client Contract ID"
            value={formData.clientContractId}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Effective Date"
            value={formData.effectiveDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Termination Date"
            value={formData.terminationDate}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Contract Term"
            value={formData.contractTerm}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client Membership"
            value={formData.clientMembership}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Client DOA Signor"
            value={formData.clientDoaSignor}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Contracting Legal Entity for OptumRx"
            value={formData.contractingLegalEntityOptumRx}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Contracting Legal Entity for Client"
            value={formData.contractingLegalEntityClient}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Assigned to"
            value={getLabel(formData.assignedTo, ASSIGNED_TO_LABELS)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Run-Off Effective Date"
            value={formData.runOffEffectiveDate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Source"
            value={getLabel(formData.contractSource, SOURCE_LABELS)}
          />
        </Grid>
      </Grid>

      {/* Billing Attributes Section */}
      <Divider sx={{ my: 3, borderColor: '#CBCCCD' }} />
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#000000',
          mb: 2,
        }}
      >
        Billing Attributes
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Invoice Breakout"
            value={getLabel(formData.invoiceBreakout, INVOICE_BREAKOUT_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Claim Invoice Frequency"
            value={getLabel(formData.claimInvoiceFrequency, INVOICE_FREQUENCY_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Fee Invoice Frequency"
            value={getLabel(formData.feeInvoiceFrequency, INVOICE_FREQUENCY_LABELS)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Invoice Aggregation Level"
            value={getLabel(formData.invoiceAggregationLevel, INVOICE_AGGREGATION_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Invoice Type"
            value={getLabel(formData.invoiceType, INVOICE_TYPE_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Invoicing Claim Quantity Counts"
            value={getLabel(formData.invoicingClaimQuantityCounts, CLAIM_QUANTITY_LABELS)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Delivery Option"
            value={getLabel(formData.deliveryOption, DELIVERY_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Support Document Version"
            value={getLabel(formData.supportDocumentVersion, SUPPORT_DOC_VERSION_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Claim Invoice Payment Term"
            value={formData.claimInvoicePaymentTerm}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Fee Invoice Payment Term"
            value={formData.feeInvoicePaymentTerm}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Payment Method"
            value={getLabel(formData.paymentMethod, PAYMENT_METHOD_LABELS)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadOnlyField
            label="Suppress Rejected Claims?"
            value={getLabel(formData.suppressRejectedClaims, YES_NO_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReadOnlyField
            label="Suppress Net-zero claims?"
            value={getLabel(formData.suppressNetZeroClaims, YES_NO_LABELS)}
          />
        </Grid>
      </Grid>

      {/* Autopay Information Section - Only show if payment method is ACH */}
      {formData.paymentMethod === 'ach' && (
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
            Autopay Information
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <ReadOnlyField
                label="Bank Account Type"
                value={getLabel(formData.bankAccountType, BANK_ACCOUNT_TYPE_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <ReadOnlyField
                label="Routing Number"
                value={formData.routingNumber}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <ReadOnlyField
                label="Account Number"
                value={formData.accountNumber}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <ReadOnlyField
                label="Account Holder Name"
                value={formData.accountHolderName}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ContractDetailsReview;
