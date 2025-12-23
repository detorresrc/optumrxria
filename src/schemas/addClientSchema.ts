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

// Billing Attributes Override schema for Operational Units (optional)
// Requirements: 4.1-4.5 - mirrors contract billing attributes but all optional
export const billingAttributesOverrideSchema = z.object({
  invoiceBreakout: z.string().optional(),
  claimInvoiceFrequency: z.string().optional(),
  feeInvoiceFrequency: z.string().optional(),
  invoiceAggregationLevel: z.string().optional(),
  invoiceType: z.string().optional(),
  deliveryOption: z.string().optional(),
  supportDocumentVersion: z.string().optional(),
}).optional();

// Operational Unit schema
// Requirements: 2.1-2.10, 6.1-6.6
export const operationalUnitSchema = z.object({
  // Required fields (Requirements 2.1, 2.2, 2.4, 2.9, 6.2-6.5)
  name: z.string().min(1, 'Required field'),
  id: z.string().min(1, 'Required field'),
  lineOfBusiness: z.string().min(1, 'Required field'),
  runOffPeriod: z.string().min(1, 'Required field'),

  // Optional fields (Requirements 2.3, 2.5, 2.6, 2.7, 2.8, 2.10)
  marketSegment: z.string().optional(),
  mrPlanType: z.string().optional(),
  mrGroupIndividual: z.string().optional(),
  mrClassification: z.string().optional(),
  passThroughTraditional: z.string().optional(),
  assignContacts: z.string().optional(),

  // Address array (Requirements 3, 6.6)
  addresses: z.array(operationalUnitAddressSchema).min(1, 'At least one address is required'),

  // Billing attributes override (optional, Requirements 4.1-4.5)
  billingAttributesOverride: billingAttributesOverrideSchema,
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

// Default values for Operational Unit (Step 4)
// Requirements: 5.1
export const defaultOperationalUnitData: OperationalUnitData = {
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

  // Billing Attributes (Requirements 3.1-3.13)
  invoiceBreakout: z.string().min(1, 'Required field'),
  claimInvoiceFrequency: z.string().min(1, 'Required field'),
  feeInvoiceFrequency: z.string().min(1, 'Required field'),
  invoiceAggregationLevel: z.string().min(1, 'Required field'),
  invoiceType: z.string().min(1, 'Required field'),
  invoicingClaimQuantityCounts: z.string().optional(),
  deliveryOption: z.string().min(1, 'Required field'),
  supportDocumentVersion: z.string().min(1, 'Required field'),
  claimInvoicePaymentTerm: z.string().optional(),
  feeInvoicePaymentTerm: z.string().optional(),
  paymentMethod: z.string().optional(),

  // Autopay Information (Requirements 4.5-4.8) - conditionally required
  bankAccountType: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),

  // Radio Options (Requirements 5.1-5.3)
  suppressRejectedClaims: z.enum(['yes', 'no']).default('yes'),
  suppressNetZeroClaims: z.enum(['yes', 'no']).default('yes'),
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
  claimInvoicePaymentTerm: '',
  feeInvoicePaymentTerm: '',
  paymentMethod: '',

  // Autopay Information
  bankAccountType: '',
  routingNumber: '',
  accountNumber: '',
  accountHolderName: '',

  // Radio Options
  suppressRejectedClaims: 'yes',
  suppressNetZeroClaims: 'yes',
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
  claimInvoicePaymentTerm: z.string().optional(),
  feeInvoicePaymentTerm: z.string().optional(),
  paymentMethod: z.string().optional(),

  // Step 2: Contract Details - Autopay Information (conditionally required)
  bankAccountType: z.string().optional(),
  routingNumber: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),

  // Step 2: Contract Details - Radio Options
  suppressRejectedClaims: z.enum(['yes', 'no']).default('yes'),
  suppressNetZeroClaims: z.enum(['yes', 'no']).default('yes'),

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
  claimInvoicePaymentTerm: '',
  feeInvoicePaymentTerm: '',
  paymentMethod: '',

  // Step 2: Contract Details - Autopay Information
  bankAccountType: '',
  routingNumber: '',
  accountNumber: '',
  accountHolderName: '',

  // Step 2: Contract Details - Radio Options
  suppressRejectedClaims: 'yes',
  suppressNetZeroClaims: 'yes',

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
