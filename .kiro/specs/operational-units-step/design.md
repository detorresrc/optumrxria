# Design Document: Operational Units Step

## Overview

This design document describes the implementation of the updated Operational Units step (Step 4) in the Add Client multi-step form. The step allows users to configure one or more operational units with business attributes, billing addresses, billing attribute overrides, payment methods, and suppression settings.

The implementation uses React with TypeScript, MUI v7 components, react-hook-form for form state management, and Zod for schema validation, following the existing patterns established in the codebase.

## Architecture

### Component Hierarchy

```
AddClientPage
└── AddClientStepper
    └── OperationalUnitsStep
        ├── OperationalUnitCard (Accordion)
        │   ├── BasicFieldsSection
        │   │   └── AssignContactsChips
        │   ├── AddressSection
        │   │   └── AddressEntry (repeatable)
        │   ├── BillingAttributesOverrideSection (Accordion)
        │   │   └── PaymentMethodSection
        │   └── SuppressionsSection
        │       └── SuppressionEntry (repeatable)
        └── AddOperationalUnitButton
```

### State Management

- Form state managed by react-hook-form at the AddClientPage level
- useFieldArray hook for managing dynamic arrays:
  - `operationalUnits` - array of operational unit entries
  - `operationalUnits[n].addresses` - nested array of addresses per unit
  - `operationalUnits[n].suppressions` - nested array of suppressions per unit
  - `operationalUnits[n].assignedContacts` - array of selected contact IDs
- Local state for accordion expand/collapse (expandedIndex)
- Local state for billing attributes accordion expand/collapse

## Components and Interfaces

### OperationalUnitsStep Component

```typescript
interface OperationalUnitsStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
}
```

Main component that renders the list of operational unit accordions and the "Add another operational unit" button.

### OperationalUnitCard Component

Renders a single operational unit as an MUI Accordion with:
- Expanded state: Shows all form fields
- Collapsed state: Shows "Operational Units - [Name]" title with delete button

### AssignContactsChips Component

```typescript
interface AssignContactsChipsProps {
  control: Control<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  availableContacts: Contact[];
}
```

Renders a dropdown for selecting contacts and displays selected contacts as removable chips in a light blue card.

### AddressSection Component

```typescript
interface AddressSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}
```

Manages the nested field array for addresses within an operational unit.

### BillingAttributesOverrideSection Component

```typescript
interface BillingAttributesOverrideSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}
```

Collapsible accordion containing billing override fields and payment method section.

### PaymentMethodSection Component

```typescript
interface PaymentMethodSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
  paymentMethod: string;
}
```

Conditionally renders bank account fields when payment method is ACH/EFT.

### SuppressionsSection Component

```typescript
interface SuppressionsSectionProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  operationalUnitIndex: number;
}
```

Manages the nested field array for suppressions with Yes/No radio toggle.

## Data Models

### Zod Schemas

```typescript
// Address schema for operational unit
const operationalUnitAddressSchema = z.object({
  addressType: z.string().min(1, 'Required field'),
  address1: z.string().min(1, 'Required field'),
  address2: z.string().min(1, 'Required field'),
  city: z.string().min(1, 'Required field'),
  state: z.string().min(1, 'Required field'),
  zip: z.string().min(1, 'Required field'),
});

// Suppression entry schema
const suppressionEntrySchema = z.object({
  suppressionType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Billing attributes override schema
const billingAttributesOverrideSchema = z.object({
  claimInvoiceFrequency: z.string().optional(),
  feeInvoiceFrequency: z.string().optional(),
  invoiceAggregationLevel: z.string().optional(),
  invoiceType: z.string().optional(),
  invoicingClaimQuantityCounts: z.string().optional(),
  deliveryOption: z.string().optional(),
  supportDocumentVersion: z.string().optional(),
  invoiceStaticData: z.string().optional(),
  feeInvoicePaymentTerm: z.string().optional(),
  feeInvoicePaymentTermDayType: z.string().optional(),
  claimInvoicePaymentTerm: z.string().optional(),
  claimInvoicePaymentTermDayType: z.string().optional(),
  paymentMethod: z.string().optional(),
  bankAccountType: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
}).optional();

// Operational unit schema
const operationalUnitSchema = z.object({
  name: z.string().min(1, 'Required field'),
  id: z.string().min(1, 'Required field'),
  lobNumeric: z.string().min(1, 'Required field'),
  marketSegment: z.string().optional(),
  lineOfBusiness: z.string().min(1, 'Required field'),
  mrPlanType: z.string().optional(),
  mrGroupIndividual: z.string().optional(),
  mrClassification: z.string().optional(),
  passThroughTraditional: z.string().optional(),
  assignedContacts: z.array(z.string()).optional(),
  addresses: z.array(operationalUnitAddressSchema).min(1),
  billingAttributesOverride: billingAttributesOverrideSchema,
  addSuppressions: z.boolean().optional(),
  suppressions: z.array(suppressionEntrySchema).optional(),
});
```

### TypeScript Types

```typescript
type OperationalUnitAddress = z.infer<typeof operationalUnitAddressSchema>;
type SuppressionEntry = z.infer<typeof suppressionEntrySchema>;
type BillingAttributesOverride = z.infer<typeof billingAttributesOverrideSchema>;
type OperationalUnit = z.infer<typeof operationalUnitSchema>;
```

### Default Values

```typescript
const defaultOperationalUnitAddressData: OperationalUnitAddress = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};

const defaultSuppressionEntryData: SuppressionEntry = {
  suppressionType: '',
  startDate: '',
  endDate: '',
};

const defaultOperationalUnitData: OperationalUnit = {
  name: '',
  id: '',
  lobNumeric: '',
  marketSegment: '',
  lineOfBusiness: '',
  mrPlanType: '',
  mrGroupIndividual: '',
  mrClassification: '',
  passThroughTraditional: '',
  assignedContacts: [],
  addresses: [defaultOperationalUnitAddressData],
  billingAttributesOverride: undefined,
  addSuppressions: false,
  suppressions: [],
};
```

### Dropdown Options

```typescript
const MARKET_SEGMENT_OPTIONS = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'medicare', label: 'Medicare' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'exchange', label: 'Exchange' },
];

const LINE_OF_BUSINESS_OPTIONS = [
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'medical', label: 'Medical' },
  { value: 'dental', label: 'Dental' },
  { value: 'vision', label: 'Vision' },
];

const MR_PLAN_TYPE_OPTIONS = [
  { value: 'mapd', label: 'MAPD' },
  { value: 'pdp', label: 'PDP' },
  { value: 'egwp', label: 'EGWP' },
];

const MR_GROUP_INDIVIDUAL_OPTIONS = [
  { value: 'group', label: 'Group' },
  { value: 'individual', label: 'Individual' },
];

const MR_CLASSIFICATION_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'low_income', label: 'Low Income Subsidy' },
  { value: 'dual_eligible', label: 'Dual Eligible' },
];

const PRICING_OPTIONS = [
  { value: 'pass_through', label: 'Pass Through' },
  { value: 'traditional', label: 'Traditional' },
];

const ADDRESS_TYPE_OPTIONS = [
  { value: 'billing', label: 'Billing' },
  { value: 'mailing', label: 'Mailing' },
  { value: 'physical', label: 'Physical' },
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

const PAYMENT_TERM_OPTIONS = [
  { value: '15', label: '15 Days' },
  { value: '30', label: '30 Days' },
  { value: '45', label: '45 Days' },
  { value: '60', label: '60 Days' },
];

const DAY_TYPE_OPTIONS = [
  { value: 'calendar', label: 'Calendar Days' },
  { value: 'business', label: 'Business Days' },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: 'ach', label: 'ACH/EFT' },
  { value: 'check', label: 'Check' },
  { value: 'wire', label: 'Wire Transfer' },
];

const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
];

const SUPPRESSION_TYPE_OPTIONS = [
  { value: 'billing', label: 'Billing Suppression' },
  { value: 'claims', label: 'Claims Suppression' },
  { value: 'fees', label: 'Fees Suppression' },
];
```



## UI Layout Specifications

### Operational Unit Card Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Operational Units                                              [Delete] [▼] │
│ Complete the fields below.                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│ │ OU Name *       │ │ OU ID * (dim)   │ │ LOB Numeric *   │                │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Market Segment  │ │ Line of Biz *   │ │ M&R Plan Type   │                │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│ │ M&R Group/Ind   │ │ M&R Class       │ │ Pass/Trad       │                │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ Assign Contacts Card (#FAFCFF background)                               ││
│ │ ┌─────────────────────────────────────────────────────────────────────┐ ││
│ │ │ Assign Contacts [▼]                                                 │ ││
│ │ └─────────────────────────────────────────────────────────────────────┘ ││
│ │ [Alice Johnson ✕] [James Williams ✕] [James Williams ✕]                 ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ ADDRESS SECTION                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Address Type *  │ │ Address 1 *     │ │ Address 2       │                │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│ │ City *          │ │ State *         │ │ Zip *           │                │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                             │
│ [+ Add another billing address]                                             │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ BILLING ATTRIBUTES (Collapsible Accordion)                          [▼] ││
│ │ You may override the billing attributes...                              ││
│ ├─────────────────────────────────────────────────────────────────────────┤│
│ │ [Billing fields when expanded...]                                       ││
│ │ [Payment Method section...]                                             ││
│ └─────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ Add Suppressions                                                            │
│ (●) Yes  ( ) No                                                             │
│                                                                             │
│ [Suppression fields when Yes selected...]                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

[+ Add another operational unit]
```

### Collapsed Card Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Operational Units - Unit Name                                  [🗑] [▶]     │
│ Complete the fields below                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Styling Specifications

| Element | Property | Value |
|---------|----------|-------|
| Card Border | border | 1px solid #CBCCCD |
| Card Border Radius | borderRadius | 12px |
| Card Padding | padding | 30px 24px |
| Field Gap (row) | gap | 24px |
| Field Gap (column) | gap | 24px |
| Card Gap | gap | 16px |
| Input Height | height | 40px |
| Input Border | border | 1px solid #4B4D4F |
| Input Border Radius | borderRadius | 4px |
| Label Font | fontWeight | 700 (bold) |
| Label Font Size | fontSize | 16px |
| Placeholder Color | color | #323334 |
| Assign Contacts Card BG | backgroundColor | #FAFCFF |
| Chip Border | border | 1px solid #0C55B8 |
| Delete Button Color | color | #C40000 |
| Add Button Color | color | #0C55B8 |
| Divider Color | borderColor | #AAAAAA |
| Date Picker Button BG | backgroundColor | #002677 |

## Error Handling

### Validation Errors

- Required field validation displays "Required field" message below the input
- Error state shows red border on input field
- Validation triggered on form submission and field blur

### Array Validation

- At least one operational unit required
- At least one address per operational unit required
- Suppressions only validated when "Add Suppressions" is set to Yes

## Testing Strategy

### Unit Tests

Unit tests should cover:
- Component rendering with default props
- Accordion expand/collapse behavior
- Add/remove operational unit functionality
- Add/remove address functionality
- Add/remove suppression functionality
- Contact chip selection and removal
- Payment method conditional rendering
- Form field validation

### Integration Tests

Integration tests should cover:
- Form data persistence across step navigation
- Validation blocking navigation to next step
- Data flow to Confirmation step



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Operational Unit List Management Invariant

*For any* operational unit list, adding a new unit should increase the list length by exactly 1, and removing a unit should decrease the list length by exactly 1, while preserving all other units' data.

**Validates: Requirements 7.3, 7.8**

### Property 2: Address List Management Invariant

*For any* address list within an operational unit, adding a new address should increase the list length by exactly 1, and removing an address should decrease the list length by exactly 1, while preserving all other addresses' data.

**Validates: Requirements 3.9, 3.11**

### Property 3: Suppression List Management Invariant

*For any* suppression list within an operational unit, adding a new suppression should increase the list length by exactly 1, and removing a suppression should decrease the list length by exactly 1, while preserving all other suppressions' data.

**Validates: Requirements 6.8, 6.10**

### Property 4: Contact Selection Management

*For any* contact selection, adding a contact should include it in the selected contacts array, and removing a contact (clicking X on chip) should exclude it from the array, while preserving all other selected contacts.

**Validates: Requirements 2.11, 2.13**

### Property 5: Accordion Mutual Exclusion

*For any* list of operational units with more than one entry, at most one accordion should be expanded at any time. Expanding one accordion should collapse all others.

**Validates: Requirements 7.4, 7.9**

### Property 6: Delete Button Visibility for Dynamic Lists

*For any* dynamic list (addresses, suppressions, operational units) with length > 1, delete buttons should be visible for all items except the first one. For lists with length = 1, no delete buttons should be visible.

**Validates: Requirements 3.10, 6.9, 7.7**

### Property 7: Collapsed Card Title Reflects Unit Name

*For any* collapsed operational unit card, the title should be "Operational Units - [name]" where [name] is the current value of the unit's name field. If name is empty, title should be "Operational Units".

**Validates: Requirements 7.5**

### Property 8: Conditional Field Rendering - Payment Method

*For any* payment method selection, bank account fields (Bank Account Type, Routing Number, Account Number) should only be visible when payment method is "ACH/EFT". For all other payment methods, these fields should be hidden.

**Validates: Requirements 5.3, 5.4, 5.5**

### Property 9: Conditional Field Rendering - Suppressions

*For any* "Add Suppressions" toggle value, suppression entry fields should only be visible when the toggle is set to "Yes". When set to "No", suppression fields should be hidden.

**Validates: Requirements 6.2**

### Property 10: Required Field Validation

*For any* form submission attempt, if any required field (Operational Unit Name, Operational Unit ID, LOB Numeric, Line of Business, Address Type, Address 1, Address 2, City, State, Zip) is empty, the form should display "Required field" error and prevent navigation to the next step.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7**

