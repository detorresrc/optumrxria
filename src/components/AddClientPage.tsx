import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevLeftIcon from '../assets/chev-left.svg';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddClientStepper } from './AddClientStepper';
import { ClientDetailsStep } from './ClientDetailsStep';
import { ContractDetailsStep } from './ContractDetailsStep';
import { ContactsAccessStep } from './ContactsAccessStep';
import { OperationalUnitsStep } from './OperationalUnitsStep';
import { ConfirmationStep } from './ConfirmationStep';
import { Header } from './Header';
import { Footer } from './Footer';
import { NavigationFooter } from './NavigationFooter';
import {
  addClientCombinedSchema,
  defaultAddClientCombinedData,
  type AddClientCombinedFormData,
} from '../schemas/addClientSchema';
import {
  saveDraftToStorage,
  loadDraftFromStorage,
  clearDraftFromStorage,
} from '../utils/draftStorage';

interface AddClientPageProps {
  onCancel?: () => void;
  onSaveDraft?: (data: AddClientCombinedFormData) => void;
  initialData?: AddClientCombinedFormData;
  /** URL to navigate to when canceling. Defaults to '/clients' */
  clientsListUrl?: string;
}

const STEP_LABELS = [
  'Client Details',
  'Contract Details',
  'Contacts & Access',
  'Operational Units',
  'Confirmation',
];

export const AddClientPage: React.FC<AddClientPageProps> = ({
  onCancel,
  onSaveDraft,
  initialData,
  clientsListUrl = '/clients',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  // State for cancel confirmation dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Compute initial form data (memoized to run once)
  const initialFormData = useMemo((): AddClientCombinedFormData => {
    // Priority: initialData prop > localStorage draft > default values
    if (initialData) {
      return initialData;
    }
    const draft = loadDraftFromStorage();
    if (draft) {
      // Merge draft with default values to ensure all fields exist
      return { ...defaultAddClientCombinedData, ...draft };
    }
    return defaultAddClientCombinedData;
  }, [initialData]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    getValues,
    watch,
    trigger,
    setValue,
  } = useForm<AddClientCombinedFormData>({
    resolver: zodResolver(addClientCombinedSchema),
    defaultValues: initialFormData,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  // Field array for contacts (Step 3: Contacts & Access)
  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: 'contacts',
  });

  // Check if form has unsaved changes
  const hasUnsavedChanges = useCallback((): boolean => {
    return isDirty;
  }, [isDirty]);

  // Navigate to clients list page
  const navigateToClientsList = useCallback(() => {
    // Clear draft from storage when navigating away
    clearDraftFromStorage();
    
    // Call the onCancel callback if provided
    if (onCancel) {
      onCancel();
    }
    
    // Navigate to clients list URL
    // In a real app with react-router, this would use navigate()
    // For now, we use window.location for navigation
    window.location.href = clientsListUrl;
  }, [onCancel, clientsListUrl]);

  const handleCancel = () => {
    // Check if there are unsaved changes
    if (hasUnsavedChanges()) {
      // Show confirmation dialog
      setCancelDialogOpen(true);
    } else {
      // No unsaved changes, navigate directly
      navigateToClientsList();
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
  };

  const handleCancelConfirm = () => {
    setCancelDialogOpen(false);
    navigateToClientsList();
  };

  const handleSaveDraft = () => {
    const formData = getValues();
    // Save to localStorage for persistence
    saveDraftToStorage(formData);
    // Call the callback if provided
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  // Handle form confirmation/submission on the final step
  const handleConfirm = (data: AddClientCombinedFormData) => {
    // Clear draft from storage on successful submission
    clearDraftFromStorage();
    // Log the submitted data (in a real app, this would send to an API)
    console.log('Form submitted:', data);
    // Navigate to clients list after successful submission
    navigateToClientsList();
  };

  // Navigate to a specific step (form data is preserved automatically via react-hook-form)
  // Validates current step before allowing navigation forward
  const navigateToStep = useCallback(async (targetStep: number) => {
    // Allow navigating backward without validation
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    // For forward navigation, validate current step first
    let isValid = false;

    if (currentStep === 0) {
      isValid = await trigger(['clientReferenceId', 'clientName', 'source', 'addresses']);
    } else if (currentStep === 1) {
      // Base required fields for Contract Details (Requirements 6.1-6.4)
      const contractDetailsFields: (keyof AddClientCombinedFormData)[] = [
        'effectiveDate',
        'contractSource',
        'invoiceBreakout',
        'claimInvoiceFrequency',
        'feeInvoiceFrequency',
        'invoiceAggregationLevel',
        'invoiceType',
        'deliveryOption',
        'supportDocumentVersion',
      ];

      // Get current payment method value
      const paymentMethodValue = getValues('paymentMethod');

      // Add autopay fields to validation when ACH is selected (Requirements 6.5)
      if (paymentMethodValue === 'ach') {
        contractDetailsFields.push(
          'bankAccountType',
          'routingNumber',
          'accountNumber',
          'accountHolderName'
        );
      }

      isValid = await trigger(contractDetailsFields);
    } else if (currentStep === 2) {
      isValid = await trigger('contacts');
    } else if (currentStep === 3) {
      isValid = await trigger('operationalUnits');
    } else {
      isValid = await trigger();
    }
    isValid = true;
    if (isValid) {
      setCurrentStep(targetStep);
    }
  }, [currentStep, trigger, getValues]);

  // Handle "Go Back" button click - navigate to previous step
  const handleGoBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Handle "Next" button click - validate current step fields and navigate to next step
  const handleNext = useCallback(async () => {
    let isValid = false;

    // Validate fields based on current step
    if (currentStep === 0) {
      // Step 1: Client Details - validate client details and addresses
      isValid = await trigger(['clientReferenceId', 'clientName', 'source', 'addresses']);
    } else if (currentStep === 1) {
      // Step 2: Contract Details - validate contract fields
      // Base required fields for Contract Details (Requirements 6.1-6.4)
      const contractDetailsFields: (keyof AddClientCombinedFormData)[] = [
        'effectiveDate',
        'contractSource',
        'invoiceBreakout',
        'claimInvoiceFrequency',
        'feeInvoiceFrequency',
        'invoiceAggregationLevel',
        'invoiceType',
        'deliveryOption',
        'supportDocumentVersion',
      ];

      // Get current payment method value
      const paymentMethodValue = getValues('paymentMethod');

      // Add autopay fields to validation when ACH is selected (Requirements 6.5)
      if (paymentMethodValue === 'ach') {
        contractDetailsFields.push(
          'bankAccountType',
          'routingNumber',
          'accountNumber',
          'accountHolderName'
        );
      }

      isValid = await trigger(contractDetailsFields);
    } else if (currentStep === 2) {
      // Step 3: Contacts & Access - validate contacts array
      isValid = await trigger('contacts');
    } else if (currentStep === 3) {
      // Step 4: Operational Units - validate operationalUnits array
      isValid = await trigger('operationalUnits');
    } else {
      // For other steps, trigger full validation
      isValid = await trigger();
    }

    if (isValid && currentStep < STEP_LABELS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, trigger, getValues]);

  const onSubmit = (data: AddClientCombinedFormData) => {
    // Move to next step on valid form submission
    if (currentStep < STEP_LABELS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    console.log('Form data:', data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FAFCFF',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sticky Header and Breadcrumbs Container */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Header */}
        <Header activeNavItem="Clients" />

        {/* Breadcrumbs */}
        <Box
          sx={{
            px: '84px',
            py: '4px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E5E6',
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 16, color: '#6D6E70' }} />}
            aria-label="breadcrumb"
          >
            <Link
              underline="hover"
              href="#"
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#002677',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Home
            </Link>
            <Link
              underline="hover"
              href="#"
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#002677',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Clients
            </Link>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#4B4D4F',
              }}
            >
              Add Client
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ px: '84px', py: 3, flex: 1 }}>
        {/* Title Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          {/* Title and Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <img src={ChevLeftIcon} alt="Back" width={12} height={19} />
            <Typography
              variant="h1"
              sx={{
                fontSize: '29px',
                fontWeight: 700,
                color: '#323334',
                lineHeight: 1.2,
              }}
            >
              Add Client
            </Typography>
          </Box>

          {/* Button Group */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            {currentStep === 4 ? (
              // Confirmation step buttons - Requirements 7.1, 7.2, 7.3
              <>
                <Button
                  variant="contained"
                  onClick={() => handleSubmit(handleConfirm)()}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#001a5c',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSaveDraft}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#002677',
                    borderColor: '#002677',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#002677',
                    },
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#4B4D4F',
                    borderColor: '#4B4D4F',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#4B4D4F',
                    },
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              // Default buttons for steps 0-3
              <>
                <Button
                  variant="contained"
                  onClick={handleSaveDraft}
                  sx={{
                    backgroundColor: '#002677',
                    color: '#FFFFFF',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#001a5c',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#4B4D4F',
                    borderColor: '#4B4D4F',
                    borderRadius: '46px',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      borderColor: '#4B4D4F',
                    },
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Stepper */}
        <Box sx={{ mb: 3 }}>
          <AddClientStepper currentStep={currentStep} onStepClick={navigateToStep} />
        </Box>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <ClientDetailsStep
              control={control}
              errors={errors}
              addressFields={fields}
              appendAddress={append}
              removeAddress={remove}
            />
          )}
          {currentStep === 1 && (
            <ContractDetailsStep
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          )}
          {currentStep === 2 && (
            <ContactsAccessStep
              control={control}
              errors={errors}
              contactFields={contactFields}
              appendContact={appendContact}
              removeContact={removeContact}
            />
          )}
          {currentStep === 3 && (
            <OperationalUnitsStep
              control={control}
              errors={errors}
              setValue={setValue}
            />
          )}
          {currentStep === 4 && (
            <ConfirmationStep
              formData={getValues()}
              onEditStep={navigateToStep}
              onConfirm={() => handleSubmit(handleConfirm)()}
              onSaveDraft={handleSaveDraft}
              onGoBack={handleGoBack}
            />
          )}

          {/* Step Navigation Buttons */}
          {/* Show buttons on steps 0-3 only. Confirmation step (4) has buttons in title bar */}
          {/* Steps 0-3 use NavigationFooter component */}
          {/* Step 0 (Client Details) shows only Next button */}
          {currentStep === 0 && (
            <NavigationFooter
              onNext={handleNext}
              onBack={handleGoBack}
              showBack={false}
              showNext={true}
            />
          )}
          {/* Steps 1-3 (Contract Details, Contacts & Access, Operational Units) show both buttons */}
          {currentStep >= 1 && currentStep <= 3 && (
            <NavigationFooter
              onNext={handleNext}
              onBack={handleGoBack}
              showBack={true}
              showNext={true}
            />
          )}

          {/* Confirmation Step Navigation - Go Back button only */}
          {currentStep === 4 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: '#002677',
                  borderColor: '#002677',
                  borderRadius: '46px',
                  padding: '10px 24px',
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                    borderColor: '#002677',
                  },
                }}
              >
                Go Back
              </Button>
            </Box>
          )}
        </form>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              padding: '8px',
              minWidth: '400px',
            },
          },
        }}
      >
        <DialogTitle
          id="cancel-dialog-title"
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#323334',
          }}
        >
          Unsaved Changes
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="cancel-dialog-description"
            sx={{
              fontSize: '14px',
              color: '#4B4D4F',
            }}
          >
            You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', gap: 1 }}>
          <Button
            onClick={handleCancelDialogClose}
            variant="outlined"
            sx={{
              borderRadius: '46px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              color: '#4B4D4F',
              borderColor: '#4B4D4F',
              '&:hover': {
                backgroundColor: '#F5F5F5',
                borderColor: '#4B4D4F',
              },
            }}
          >
            Stay on Page
          </Button>
          <Button
            onClick={handleCancelConfirm}
            variant="contained"
            sx={{
              borderRadius: '46px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              backgroundColor: '#C40000',
              color: '#FFFFFF',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#A30000',
                boxShadow: 'none',
              },
            }}
          >
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddClientPage;
