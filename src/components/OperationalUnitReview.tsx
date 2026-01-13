import React from 'react';
import { Box, Grid, Typography, Divider, IconButton, Link, Chip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { ReadOnlyField } from './ReadOnlyField';
import { ReadOnlySelectField } from './ReadOnlySelectField';
import type { OperationalUnitData } from '../schemas/addClientSchema';

// Mock contact labels mapping (same as OperationalUnitsStep)
const CONTACT_LABELS: Record<string, string> = {
  alice_johnson: 'Alice Johnson',
  james_williams: 'James Williams',
  sarah_davis: 'Sarah Davis',
  michael_brown: 'Michael Brown',
  emily_wilson: 'Emily Wilson',
};

interface OperationalUnitReviewProps {
  operationalUnit: OperationalUnitData;
}

// Label mappings for dropdown values
const MARKET_SEGMENT_LABELS: Record<string, string> = {
  commercial: 'Commercial',
  medicare: 'Medicare',
  medicaid: 'Medicaid',
  exchange: 'Exchange',
};

const LINE_OF_BUSINESS_LABELS: Record<string, string> = {
  pharmacy: 'Pharmacy',
  medical: 'Medical',
  dental: 'Dental',
  vision: 'Vision',
};

const MR_PLAN_TYPE_LABELS: Record<string, string> = {
  mapd: 'MAPD',
  pdp: 'PDP',
  egwp: 'EGWP',
};

const MR_GROUP_INDIVIDUAL_LABELS: Record<string, string> = {
  group: 'Group',
  individual: 'Individual',
};

const MR_CLASSIFICATION_LABELS: Record<string, string> = {
  standard: 'Standard',
  low_income: 'Low Income Subsidy',
  dual_eligible: 'Dual Eligible',
};

const PRICING_LABELS: Record<string, string> = {
  pass_through: 'Pass Through',
  traditional: 'Traditional',
};

const ADDRESS_TYPE_LABELS: Record<string, string> = {
  billing: 'Billing',
  mailing: 'Mailing',
  physical: 'Physical',
};

// Billing Attributes Override Labels
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

const INVOICING_CLAIM_QUANTITY_LABELS: Record<string, string> = {
  actual: 'Actual',
  estimated: 'Estimated',
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

const PAYMENT_TERM_LABELS: Record<string, string> = {
  '15': '15 Days',
  '30': '30 Days',
  '45': '45 Days',
  '60': '60 Days',
};

const DAY_TYPE_LABELS: Record<string, string> = {
  calendar: 'Calendar Days',
  business: 'Business Days',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  ach: 'ACH/EFT',
  check: 'Check',
  wire: 'Wire Transfer',
};

const BANK_ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
};

const SUPPRESSION_TYPE_LABELS: Record<string, string> = {
  billing: 'Billing Suppression',
  claims: 'Claims Suppression',
  fees: 'Fees Suppression',
};

export const OperationalUnitReview: React.FC<OperationalUnitReviewProps> = ({
  operationalUnit,
}) => {
  const getLabel = (value: string | undefined, labels: Record<string, string>) => {
    return value ? labels[value] || value : undefined;
  };

  // Check if billing attributes override has any values
  const hasBillingOverride = operationalUnit.billingAttributesOverride && (
    operationalUnit.billingAttributesOverride.claimInvoiceFrequency ||
    operationalUnit.billingAttributesOverride.feeInvoiceFrequency ||
    operationalUnit.billingAttributesOverride.invoiceAggregationLevel ||
    operationalUnit.billingAttributesOverride.invoiceType ||
    operationalUnit.billingAttributesOverride.invoicingClaimQuantityCounts ||
    operationalUnit.billingAttributesOverride.deliveryOption ||
    operationalUnit.billingAttributesOverride.supportDocumentVersion ||
    operationalUnit.billingAttributesOverride.invoiceStaticData ||
    operationalUnit.billingAttributesOverride.feeInvoicePaymentTerm ||
    operationalUnit.billingAttributesOverride.feeInvoicePaymentTermDayType ||
    operationalUnit.billingAttributesOverride.claimInvoicePaymentTerm ||
    operationalUnit.billingAttributesOverride.claimInvoicePaymentTermDayType ||
    operationalUnit.billingAttributesOverride.paymentMethod
  );

  // Check if payment method is ACH/EFT and has bank details
  const hasPaymentDetails = operationalUnit.billingAttributesOverride?.paymentMethod === 'ach' && (
    operationalUnit.billingAttributesOverride.bankAccountType ||
    operationalUnit.billingAttributesOverride.routingNumber ||
    operationalUnit.billingAttributesOverride.accountNumber
  );

  // Check if suppressions are configured
  const hasSuppressions = operationalUnit.addSuppressions && 
    operationalUnit.suppressions && 
    operationalUnit.suppressions.length > 0;

  return (
    <Box>
      {/* Basic Fields - Row 1: Operational Unit Name, Operational Unit ID, LOB Numeric */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Operational Unit Name"
            value={operationalUnit.name}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Operational Unit ID"
            value={operationalUnit.id}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="LOB Numeric"
            value={operationalUnit.lobNumeric}
            required
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 2: Market Segment, Line of Business, M&R Plan Type */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlySelectField
            label="Market Segment"
            value={getLabel(operationalUnit.marketSegment, MARKET_SEGMENT_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlySelectField
            label="Line of Business"
            value={getLabel(operationalUnit.lineOfBusiness, LINE_OF_BUSINESS_LABELS)}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlySelectField
            label="M&R Plan Type"
            value={getLabel(operationalUnit.mrPlanType, MR_PLAN_TYPE_LABELS)}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 3: M&R Group/Individual, M&R Classification, Pass through/Traditional pricing */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlySelectField
            label="M&R Group/Individual"
            value={getLabel(operationalUnit.mrGroupIndividual, MR_GROUP_INDIVIDUAL_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlySelectField
            label="M&R Classification"
            value={getLabel(operationalUnit.mrClassification, MR_CLASSIFICATION_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlySelectField
            label="Pass through/Traditional pricing"
            value={getLabel(operationalUnit.passThroughTraditional, PRICING_LABELS)}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 4: Assigned Contacts with Chips */}
      {operationalUnit.assignedContacts && operationalUnit.assignedContacts.length > 0 && (
        <Box
          sx={{
            backgroundColor: '#FAFCFF',
            border: '1px solid #CBCCCD',
            borderRadius: '12px',
            padding: '16px 24px',
            mt: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#323334',
              mb: 2,
            }}
          >
            Assign Contacts
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {operationalUnit.assignedContacts.map((contactValue: string) => (
              <Chip
                key={contactValue}
                label={CONTACT_LABELS[contactValue] || contactValue}
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #0C55B8',
                  borderRadius: '24px',
                  height: '36px',
                  '& .MuiChip-label': {
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0C55B8',
                    padding: '0 12px',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Addresses Section */}
      {operationalUnit.addresses && operationalUnit.addresses.length > 0 && (
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
          {operationalUnit.addresses.map((address, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              {/* Address Row 1 */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlySelectField
                    label="Address Type"
                    value={getLabel(address.addressType, ADDRESS_TYPE_LABELS)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Address 1"
                    value={address.address1}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Address 2"
                    value={address.address2}
                  />
                </Grid>
              </Grid>

              {/* Address Row 2 */}
              <Grid container spacing={3} alignItems="flex-end">
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="City"
                    value={address.city}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="State"
                    value={address.state}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <ReadOnlyField
                    label="Zip"
                    value={address.zip}
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
        </>
      )}

      {/* Billing Attributes Override Section - Only show if there are overrides */}
      {hasBillingOverride && (
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
            Billing Attributes Override
          </Typography>

          {/* Row 1: Invoice Frequencies and Aggregation */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Claim Invoice Frequency"
                value={getLabel(operationalUnit.billingAttributesOverride?.claimInvoiceFrequency, INVOICE_FREQUENCY_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Fee Invoice Frequency"
                value={getLabel(operationalUnit.billingAttributesOverride?.feeInvoiceFrequency, INVOICE_FREQUENCY_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Invoice Aggregation Level"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoiceAggregationLevel, INVOICE_AGGREGATION_LABELS)}
              />
            </Grid>
          </Grid>

          {/* Row 2: Invoice Type, Quantity Counts, Delivery */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Invoice Type"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoiceType, INVOICE_TYPE_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Invoicing Claim Quantity Counts"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoicingClaimQuantityCounts, INVOICING_CLAIM_QUANTITY_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Delivery Option"
                value={getLabel(operationalUnit.billingAttributesOverride?.deliveryOption, DELIVERY_LABELS)}
              />
            </Grid>
          </Grid>

          {/* Row 3: Support Doc Version, Invoice Static Data */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Support Document Version"
                value={getLabel(operationalUnit.billingAttributesOverride?.supportDocumentVersion, SUPPORT_DOC_VERSION_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Invoice Static Data"
                value={operationalUnit.billingAttributesOverride?.invoiceStaticData}
              />
            </Grid>
          </Grid>

          {/* Row 4: Fee Invoice Payment Terms */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Fee Invoice Payment Term"
                value={getLabel(operationalUnit.billingAttributesOverride?.feeInvoicePaymentTerm, PAYMENT_TERM_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Fee Invoice Payment Term Day Type"
                value={getLabel(operationalUnit.billingAttributesOverride?.feeInvoicePaymentTermDayType, DAY_TYPE_LABELS)}
              />
            </Grid>
          </Grid>

          {/* Row 5: Claim Invoice Payment Terms */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Claim Invoice Payment Term"
                value={getLabel(operationalUnit.billingAttributesOverride?.claimInvoicePaymentTerm, PAYMENT_TERM_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlySelectField
                label="Claim Invoice Payment Term Day Type"
                value={getLabel(operationalUnit.billingAttributesOverride?.claimInvoicePaymentTermDayType, DAY_TYPE_LABELS)}
              />
            </Grid>
          </Grid>

          {/* Payment Method */}
          {operationalUnit.billingAttributesOverride?.paymentMethod && (
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <ReadOnlySelectField
                  label="Payment Method"
                  value={getLabel(operationalUnit.billingAttributesOverride?.paymentMethod, PAYMENT_METHOD_LABELS)}
                />
              </Grid>
            </Grid>
          )}

          {/* Bank Account Details - Only show when Payment Method is ACH/EFT */}
          {hasPaymentDetails && (
            <>
              <Divider sx={{ my: 3, borderColor: '#AAAAAA' }} />
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlySelectField
                    label="Bank Account Type"
                    value={getLabel(operationalUnit.billingAttributesOverride?.bankAccountType, BANK_ACCOUNT_TYPE_LABELS)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Routing Number"
                    value={operationalUnit.billingAttributesOverride?.routingNumber}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Account Number"
                    value={operationalUnit.billingAttributesOverride?.accountNumber}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}

      {/* Suppressions Section - Only show when configured */}
      {hasSuppressions && (
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
            Suppressions
          </Typography>
          {operationalUnit.suppressions?.map((suppression, index) => (
            <Box key={index}>
              {index > 0 && <Divider sx={{ my: 2, borderColor: '#AAAAAA' }} />}
              <Grid container spacing={3} sx={{ mb: index < (operationalUnit.suppressions?.length || 0) - 1 ? 0 : 0 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlySelectField
                    label="Suppression Type"
                    value={getLabel(suppression.suppressionType, SUPPRESSION_TYPE_LABELS)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Suppression Start Date"
                    value={suppression.startDate}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Suppression End Date"
                    value={suppression.endDate}
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

export default OperationalUnitReview;
