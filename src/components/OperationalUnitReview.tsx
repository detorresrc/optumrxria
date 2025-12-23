import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { ReadOnlyField } from './ReadOnlyField';
import type { OperationalUnitData } from '../schemas/addClientSchema';

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

const ASSIGN_CONTACTS_LABELS: Record<string, string> = {
  primary: 'Primary Contact',
  billing: 'Billing Contact',
  technical: 'Technical Contact',
  executive: 'Executive Sponsor',
};

const ADDRESS_TYPE_LABELS: Record<string, string> = {
  billing: 'Billing',
  mailing: 'Mailing',
  physical: 'Physical',
};

// Billing Attributes Override Labels
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

export const OperationalUnitReview: React.FC<OperationalUnitReviewProps> = ({
  operationalUnit,
}) => {
  const getLabel = (value: string | undefined, labels: Record<string, string>) => {
    return value ? labels[value] || value : undefined;
  };

  // Check if billing attributes override has any values
  const hasBillingOverride = operationalUnit.billingAttributesOverride && (
    operationalUnit.billingAttributesOverride.invoiceBreakout ||
    operationalUnit.billingAttributesOverride.claimInvoiceFrequency ||
    operationalUnit.billingAttributesOverride.feeInvoiceFrequency ||
    operationalUnit.billingAttributesOverride.invoiceAggregationLevel ||
    operationalUnit.billingAttributesOverride.invoiceType ||
    operationalUnit.billingAttributesOverride.deliveryOption ||
    operationalUnit.billingAttributesOverride.supportDocumentVersion
  );

  return (
    <Box>
      {/* Basic Fields - Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Operational Unit Name"
            value={operationalUnit.name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Operational Unit ID"
            value={operationalUnit.id}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Market Segment"
            value={getLabel(operationalUnit.marketSegment, MARKET_SEGMENT_LABELS)}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 2 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Line of Business"
            value={getLabel(operationalUnit.lineOfBusiness, LINE_OF_BUSINESS_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="M&R Plan Type"
            value={getLabel(operationalUnit.mrPlanType, MR_PLAN_TYPE_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="M&R Group/Individual"
            value={getLabel(operationalUnit.mrGroupIndividual, MR_GROUP_INDIVIDUAL_LABELS)}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 3 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="M&R Classification"
            value={getLabel(operationalUnit.mrClassification, MR_CLASSIFICATION_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Pass through/Traditional pricing"
            value={getLabel(operationalUnit.passThroughTraditional, PRICING_LABELS)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Run-off Period"
            value={operationalUnit.runOffPeriod}
          />
        </Grid>
      </Grid>

      {/* Basic Fields - Row 4 */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ReadOnlyField
            label="Assign Contacts"
            value={getLabel(operationalUnit.assignContacts, ASSIGN_CONTACTS_LABELS)}
          />
        </Grid>
      </Grid>

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
            <Box key={index} sx={{ mb: index < operationalUnit.addresses.length - 1 ? 3 : 0 }}>
              {index > 0 && (
                <Divider sx={{ my: 2, borderColor: '#E5E5E5' }} />
              )}
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <ReadOnlyField
                    label="Address Type"
                    value={getLabel(address.addressType, ADDRESS_TYPE_LABELS)}
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

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Invoice Breakout"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoiceBreakout, INVOICE_BREAKOUT_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Claim Invoice Frequency"
                value={getLabel(operationalUnit.billingAttributesOverride?.claimInvoiceFrequency, INVOICE_FREQUENCY_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Fee Invoice Frequency"
                value={getLabel(operationalUnit.billingAttributesOverride?.feeInvoiceFrequency, INVOICE_FREQUENCY_LABELS)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Invoice Aggregation Level"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoiceAggregationLevel, INVOICE_AGGREGATION_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Invoice Type"
                value={getLabel(operationalUnit.billingAttributesOverride?.invoiceType, INVOICE_TYPE_LABELS)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Delivery Option"
                value={getLabel(operationalUnit.billingAttributesOverride?.deliveryOption, DELIVERY_LABELS)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ReadOnlyField
                label="Support Document Version"
                value={getLabel(operationalUnit.billingAttributesOverride?.supportDocumentVersion, SUPPORT_DOC_VERSION_LABELS)}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default OperationalUnitReview;
