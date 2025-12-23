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

// Contact schema
export const contactSchema = z.object({
  contactType: z.string().min(1, 'Contact type is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  status: z.string().min(1, 'Status is required'),
  sendNotification: z.boolean().default(true),
});

// Operational Unit schema
export const operationalUnitSchema = z.object({
  name: z.string().min(1, 'Operational unit name is required'),
  id: z.string().min(1, 'Operational unit ID is required'),
  marketSegment: z.string().min(1, 'Market segment is required'),
  lineOfBusiness: z.string().min(1, 'Line of business is required'),
  mrPlanType: z.string().optional(),
  mrGroupIndividual: z.string().optional(),
  mrClassification: z.string().optional(),
  passThroughTraditional: z.string().optional(),
  runOffPeriod: z.string().optional(),
  assignedContacts: z.string().min(1, 'Assigned contacts is required'),
  addresses: z.array(addressSchema).min(1, 'At least one address is required'),
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
export type ContactData = z.infer<typeof contactSchema>;
export type OperationalUnitData = z.infer<typeof operationalUnitSchema>;

// Default values
export const defaultAddressData: AddressData = {
  addressType: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};

export const defaultContactData: ContactData = {
  contactType: '',
  firstName: '',
  lastName: '',
  email: '',
  status: '',
  sendNotification: true,
};

export const defaultOperationalUnitData: OperationalUnitData = {
  name: '',
  id: '',
  marketSegment: '',
  lineOfBusiness: '',
  mrPlanType: '',
  mrGroupIndividual: '',
  mrClassification: '',
  passThroughTraditional: '',
  runOffPeriod: '',
  assignedContacts: '',
  addresses: [defaultAddressData],
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
};
