import { z } from 'zod';

// Address schema for Step 1 (Client Details) - all fields required with "Required field" message
export const clientDetailsAddressSchema = z.object({
  addressType: z.string().min(1, 'Required field'),
  address1: z.string().min(1, 'Required field'),
  address2: z.string().min(1, 'Required field'),
  city: z.string().min(1, 'Required field'),
  state: z.string().min(1, 'Required field'),
  zip: z.string().min(1, 'Required field'),
});

// Address schema (original - for other steps)
export const addressSchema = z.object({
  addressType: z.string().min(1, 'Address type is required'),
  address1: z.string().min(1, 'Address 1 is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP code is required').regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
});

// Contact schema for Step 3 (Contacts & Access)
// Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3, 4.4, 4.5
export const contactSchema = z.object({
  contactType: z.string().min(1, 'Required field'),
  firstName: z.string().min(1, 'Required field'),
  lastName: z.string().min(1, 'Required field'),
  email: z.string().min(1, 'Required field').email('Invalid email format'),
  status: z.string().optional(),
  sendEmailNotification: z.enum(['yes', 'no']).default('yes'),
});

// Suppression Entry schema for Contract Details Step (Step 2)
// Requirements: 5.4-5.6
export const suppressionEntrySchema = z.object({
  suppressionType: z.string().optional(),
  suppressionStartDate: z.string().optional(),
  suppressionEndDate: z.string().optional(),
});

export type SuppressionEntryData = z.infer<typeof suppressionEntrySchema>;

// Contacts & Access Step Schema (Step 3)
export const contactsAccessSchema = z.object({
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),
});

// Address schema for Operational Units (Step 4) - all fields required with "Required field" message
// Requirements: 3.2-3.7, 6.6
export const operationalUnitAddressSchema = z.object({
  addressType: z.string().min(1, 'Required field'),
  address1: z.string().min(1, 'Required field'),
  address2: z.string().min(1, 'Required field'),
  city: z.string().min(1, 'Required field'),
  state: z.string().min(1, 'Required field'),
  zip: z.string().min(1, 'Required field'),
});

// Suppression Entry schema for Operational Units (Step 4)
// Requirements: 6.3-6.5
export const operationalUnitSuppressionEntrySchema = z.object({
  suppressionType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type OperationalUnitSuppressionEntryData = z.infer<typeof operationalUnitSuppressionEntrySchema>;

// Billing Attributes Override schema for Operational Units (optional)
// Requirements: 4.6-4.17, 5.1, 5.3-5.5
export const billingAttributesOverrideSchema = z.object({
  // Invoice settings (Requirements 4.6-4.13)
  claimInvoiceFrequency: z.string().optional(),
  feeInvoiceFrequency: z.string().optional(),
  invoiceAggregationLevel: z.string().optional(),
  invoiceType: z.string().optional(),
  invoicingClaimQuantityCounts: z.string().optional(),
  deliveryOption: z.string().optional(),
  supportDocumentVersion: z.string().optional(),
  invoiceStaticData: z.string().optional(),
  // Fee Invoice Payment Terms (Requirements 4.14-4.15)
  feeInvoicePaymentTerm: z.string().optional(),
  feeInvoicePaymentTermDayType: z.string().optional(),
  // Claim Invoice Payment Terms (Requirements 4.16-4.17)
  claimInvoicePaymentTerm: z.string().optional(),
  claimInvoicePaymentTermDayType: z.string().optional(),
  // Payment Method (Requirements 5.1, 5.3-5.5)
  paymentMethod: z.string().optional(),
  bankAccountType: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
}).optional();

// Operational Unit schema
// Requirements: 2.1-2.10, 8.2-8.5
export const operationalUnitSchema = z.object({
  // Required fields (Requirements 2.1, 2.2, 2.3, 2.5, 8.2-8.5)
  name: z.string().min(1, 'Required field'),
  id: z.string().min(1, 'Required field'),
  lobNumeric: z.string().min(1, 'Required field'),
  lineOfBusiness: z.string().min(1, 'Required field'),

  // Optional fields (Requirements 2.4, 2.6-2.10)
  marketSegment: z.string().optional(),
  mrPlanType: z.string().optional(),
  mrGroupIndividual: z.string().optional(),
  mrClassification: z.string().optional(),
  passThroughTraditional: z.string().optional(),
  
  // Assigned contacts as string array (Requirements 2.10-2.13)
  assignedContacts: z.array(z.string()).optional(),

  // Address array (Requirements 3, 8.6)
  addresses: z.array(operationalUnitAddressSchema).min(1, 'At least one address is required'),

  // Billing attributes override (optional, Requirements 4.6-4.17, 5.1, 5.3-5.5)
  billingAttributesOverride: billingAttributesOverrideSchema,

  // Suppressions (Requirements 6.1-6.11)
  addSuppressions: z.boolean().optional(),
  suppressions: z.array(operationalUnitSuppressionEntrySchema).optional(),
});

// Main AddClient schema
export const addClientSchema = z.object({
  // Client Details
  clientReferenceId: z.string().min(1, 'Client Reference ID is required'),
  clientId: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required'),
  clientStatus: z.string().optional(),
  source: z.string().min(1, 'Source is required'),
  addresses: z.array(addressSchema).min(1, 'At least one address is required'),

  // Contract Details
  billingFrequency: z.string().min(1, 'Billing frequency is required'),
  paymentTerms: z.string().min(1, 'Payment terms is required'),
  currency: z.string().min(1, 'Currency is required'),
  enableAutopay: z.enum(['yes', 'no'], {
    required_error: 'Please select autopay preference',
  }),
  bankAccountNumber: z.string().optional(),
  routingNumber: z.string().optional(),

  // Contacts & Access
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),

  // Operational Units
  operationalUnits: z.array(operationalUnitSchema).min(1, 'At least one operational unit is required'),
});

// Type inference
export type AddClientFormData = z.infer<typeof addClientSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ContactsAccessFormData = z.infer<typeof contactsAccessSchema>;
export type OperationalUnitData = z.infer<typeof operationalUnitSchema>;
export type OperationalUnitAddressData = z.infer<typeof operationalUnitAddressSchema>;
export type BillingAttributesOverrideData = z.infer<typeof billingAttributesOverrideSchema>;

// Legacy type alias for backward compatibility
export type ContactData = Contact;

// Default values
export const defaultAddressData: AddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};

export const defaultContactData: Contact = {
  contactType: '',
  firstName: '',
  lastName: '',
  email: '',
  status: '',
  sendEmailNotification: 'yes',
};

// Default values for Suppression Entry (Step 2)
// Requirements: 5.4-5.6
export const defaultSuppressionEntryData: SuppressionEntryData = {
  suppressionType: '',
  suppressionStartDate: '',
  suppressionEndDate: '',
};

// Default values for Contacts & Access Step
export const defaultContactsAccessData: ContactsAccessFormData = {
  contacts: [defaultContactData],
};

// Default values for Operational Unit Address (Step 4)
// Requirements: 5.1
export const defaultOperationalUnitAddressData: OperationalUnitAddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};

// Default values for Operational Unit Suppression Entry (Step 4)
// Requirements: 6.3-6.5
export const defaultOperationalUnitSuppressionEntryData: OperationalUnitSuppressionEntryData = {
  suppressionType: '',
  startDate: '',
  endDate: '',
};

// Default values for Operational Unit (Step 4)
// Requirements: 7.1
export const defaultOperationalUnitData: OperationalUnitData = {
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
};

export const defaultFormData: AddClientFormData = {
  clientReferenceId: '',
  clientId: '',
  clientName: '',
  clientStatus: '',
  source: '',
  addresses: [defaultAddressData],
  billingFrequency: '',
  paymentTerms: '',
  currency: '',
  enableAutopay: 'no',
  bankAccountNumber: '',
  routingNumber: '',
  contacts: [defaultContactData],
  operationalUnits: [defaultOperationalUnitData],
};


// Client Details Step Schema (Step 1) - for form validation with zodResolver
// Uses "Required field" message for all required fields per Requirements 3.7, 5.1
export const clientDetailsStepSchema = z.object({
  clientReferenceId: z.string().min(1, 'Required field'),
  clientId: z.string().optional(),
  clientName: z.string().min(1, 'Required field'),
  clientStatus: z.string().optional(),
  source: z.string().min(1, 'Required field'),
  addresses: z.array(clientDetailsAddressSchema).min(1, 'At least one address is required'),
});

// Type for Client Details Step form data
export type ClientDetailsStepFormData = z.infer<typeof clientDetailsStepSchema>;

// Default values for Client Details Step
export const defaultClientDetailsStepData: ClientDetailsStepFormData = {
  clientReferenceId: '',
  clientId: '',
  clientName: '',
  clientStatus: '',
  source: '',
  addresses: [{
    addressType: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  }],
};

// Contract Details Step Schema (Step 2)
// Requirements: 2.1-2.13, 3.1-3.13, 4.5-4.8, 6.1-6.6
export const contractDetailsStepSchema = z.object({
  // Contract Information (Requirements 2.1-2.11)
  clientContractId: z.string().optional(),
  effectiveDate: z.string().min(1, 'Required field'),
  terminationDate: z.string().optional(),
  contractTerm: z.string().optional(),
  clientMembership: z.string().optional(),
  clientDoaSignor: z.string().optional(),
  contractingLegalEntityOptumRx: z.string().optional(),
  contractingLegalEntityClient: z.string().optional(),
  assignedTo: z.string().optional(),
  runOffEffectiveDate: z.string().optional(),
  source: z.string().min(1, 'Required field'),

  // Billing Attributes (Requirements 3.1-3.15)
  invoiceBreakout: z.string().min(1, 'Required field'),
  claimInvoiceFrequency: z.string().min(1, 'Required field'),
  feeInvoiceFrequency: z.string().min(1, 'Required field'),
  invoiceAggregationLevel: z.string().min(1, 'Required field'),
  invoiceType: z.string().min(1, 'Required field'),
  invoicingClaimQuantityCounts: z.string().optional(),
  deliveryOption: z.string().min(1, 'Required field'),
  supportDocumentVersion: z.string().min(1, 'Required field'),
  invoiceStaticData: z.string().optional(), // Requirements 3.11
  feeInvoicePaymentTerm: z.string().optional(), // Requirements 3.12 - dropdown
  feeInvoicePaymentTermDayType: z.string().optional(), // Requirements 3.13
  claimInvoicePaymentTerm: z.string().optional(), // Requirements 3.14 - dropdown
  claimInvoicePaymentTermDayType: z.string().optional(), // Requirements 3.15
  paymentMethod: z.string().optional(),

  // Autopay Information (Requirements 4.5-4.8) - conditionally required
  bankAccountType: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),

  // Suppressions (Requirements 5.1-5.6)
  addSuppressions: z.enum(['yes', 'no']).default('no'),
  suppressions: z.array(suppressionEntrySchema).default([]),
});

// Contract Details Step Schema with conditional autopay validation (Requirements 6.5)
export const contractDetailsStepSchemaWithAutopay = contractDetailsStepSchema.superRefine(
  (data, ctx) => {
    if (data.paymentMethod === 'ach') {
      if (!data.bankAccountType || data.bankAccountType.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['bankAccountType'],
        });
      }
      if (!data.routingNumber || data.routingNumber.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['routingNumber'],
        });
      }
      if (!data.accountNumber || data.accountNumber.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['accountNumber'],
        });
      }
      if (!data.accountHolderName || data.accountHolderName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required field',
          path: ['accountHolderName'],
        });
      }
    }
  }
);

// Type for Contract Details Step form data
export type ContractDetailsStepFormData = z.infer<typeof contractDetailsStepSchema>;

// Default values for Contract Details Step
export const defaultContractDetailsStepData: ContractDetailsStepFormData = {
  // Contract Information
  clientContractId: '',
  effectiveDate: '',
  terminationDate: '',
  contractTerm: '',
  clientMembership: '',
  clientDoaSignor: '',
  contractingLegalEntityOptumRx: '',
  contractingLegalEntityClient: '',
  assignedTo: '',
  runOffEffectiveDate: '',
  source: '',

  // Billing Attributes
  invoiceBreakout: '',
  claimInvoiceFrequency: '',
  feeInvoiceFrequency: '',
  invoiceAggregationLevel: '',
  invoiceType: '',
  invoicingClaimQuantityCounts: '',
  deliveryOption: '',
  supportDocumentVersion: '',
  invoiceStaticData: '',
  feeInvoicePaymentTerm: '',
  feeInvoicePaymentTermDayType: '',
  claimInvoicePaymentTerm: '',
  claimInvoicePaymentTermDayType: '',
  paymentMethod: '',

  // Autopay Information
  bankAccountType: '',
  routingNumber: '',
  accountNumber: '',
  accountHolderName: '',

  // Suppressions
  addSuppressions: 'no',
  suppressions: [],
};

// Combined Add Client Form Schema (Steps 1 & 2)
// This schema combines Client Details and Contract Details for the multi-step form
export const addClientCombinedSchema = z.object({
  // Step 1: Client Details
  clientReferenceId: z.string().min(1, 'Required field'),
  clientId: z.string().optional(),
  clientName: z.string().min(1, 'Required field'),
  clientStatus: z.string().optional(),
  source: z.string().min(1, 'Required field'),
  addresses: z.array(clientDetailsAddressSchema).min(1, 'At least one address is required'),

  // Step 2: Contract Details - Contract Information
  clientContractId: z.string().optional(),
  effectiveDate: z.string().min(1, 'Required field'),
  terminationDate: z.string().optional(),
  contractTerm: z.string().optional(),
  clientMembership: z.string().optional(),
  clientDoaSignor: z.string().optional(),
  contractingLegalEntityOptumRx: z.string().optional(),
  contractingLegalEntityClient: z.string().optional(),
  assignedTo: z.string().optional(),
  runOffEffectiveDate: z.string().optional(),
  contractSource: z.string().min(1, 'Required field'),

  // Step 2: Contract Details - Billing Attributes
  invoiceBreakout: z.string().min(1, 'Required field'),
  claimInvoiceFrequency: z.string().min(1, 'Required field'),
  feeInvoiceFrequency: z.string().min(1, 'Required field'),
  invoiceAggregationLevel: z.string().min(1, 'Required field'),
  invoiceType: z.string().min(1, 'Required field'),
  invoicingClaimQuantityCounts: z.string().optional(),
  deliveryOption: z.string().min(1, 'Required field'),
  supportDocumentVersion: z.string().min(1, 'Required field'),
  invoiceStaticData: z.string().optional(), // Requirements 3.11
  feeInvoicePaymentTerm: z.string().optional(), // Requirements 3.12 - dropdown
  feeInvoicePaymentTermDayType: z.string().optional(), // Requirements 3.13
  claimInvoicePaymentTerm: z.string().optional(), // Requirements 3.14 - dropdown
  claimInvoicePaymentTermDayType: z.string().optional(), // Requirements 3.15
  paymentMethod: z.string().optional(),

  // Step 2: Contract Details - Autopay Information (conditionally required)
  bankAccountType: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),

  // Step 2: Contract Details - Suppressions (Requirements 5.1-5.6)
  addSuppressions: z.enum(['yes', 'no']).default('no'),
  suppressions: z.array(suppressionEntrySchema).default([]),

  // Step 3: Contacts & Access
  contacts: z.array(contactSchema).min(1, 'At least one contact is required'),

  // Step 4: Operational Units (Requirements 5.1, 8.4)
  operationalUnits: z.array(operationalUnitSchema).min(1, 'At least one operational unit is required'),
}).superRefine((data, ctx) => {
  // Conditional validation for autopay fields when payment method is ACH
  if (data.paymentMethod === 'ach') {
    if (!data.bankAccountType || data.bankAccountType.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required field',
        path: ['bankAccountType'],
      });
    }
    if (!data.routingNumber || data.routingNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required field',
        path: ['routingNumber'],
      });
    }
    if (!data.accountNumber || data.accountNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required field',
        path: ['accountNumber'],
      });
    }
    if (!data.accountHolderName || data.accountHolderName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required field',
        path: ['accountHolderName'],
      });
    }
  }
});

// Type for Combined Add Client Form data
export type AddClientCombinedFormData = z.infer<typeof addClientCombinedSchema>;

// Default values for Combined Add Client Form
export const defaultAddClientCombinedData: AddClientCombinedFormData = {
  // Step 1: Client Details
  clientReferenceId: '',
  clientId: '',
  clientName: '',
  clientStatus: '',
  source: '',
  addresses: [{
    addressType: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  }],

  // Step 2: Contract Details - Contract Information
  clientContractId: '',
  effectiveDate: '',
  terminationDate: '',
  contractTerm: '',
  clientMembership: '',
  clientDoaSignor: '',
  contractingLegalEntityOptumRx: '',
  contractingLegalEntityClient: '',
  assignedTo: '',
  runOffEffectiveDate: '',
  contractSource: '',

  // Step 2: Contract Details - Billing Attributes
  invoiceBreakout: '',
  claimInvoiceFrequency: '',
  feeInvoiceFrequency: '',
  invoiceAggregationLevel: '',
  invoiceType: '',
  invoicingClaimQuantityCounts: '',
  deliveryOption: '',
  supportDocumentVersion: '',
  invoiceStaticData: '',
  feeInvoicePaymentTerm: '',
  feeInvoicePaymentTermDayType: '',
  claimInvoicePaymentTerm: '',
  claimInvoicePaymentTermDayType: '',
  paymentMethod: '',

  // Step 2: Contract Details - Autopay Information
  bankAccountType: '',
  routingNumber: '',
  accountNumber: '',
  accountHolderName: '',

  // Step 2: Contract Details - Suppressions
  addSuppressions: 'no',
  suppressions: [],

  // Step 3: Contacts & Access
  contacts: [{
    contactType: '',
    firstName: '',
    lastName: '',
    email: '',
    status: '',
    sendEmailNotification: 'yes',
  }],

  // Step 4: Operational Units
  operationalUnits: [defaultOperationalUnitData],
};
