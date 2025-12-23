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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddClientStepper } from './AddClientStepper';
import { ClientDetailsStep } from './ClientDetailsStep';
import { ContractDetailsStep } from './ContractDetailsStep';
import { Header } from './Header';
import { Footer } from './Footer';
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
  } = useForm<AddClientCombinedFormData>({
    resolver: zodResolver(addClientCombinedSchema),
    defaultValues: initialFormData,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
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

  // Navigate to a specific step (form data is preserved automatically via react-hook-form)
  const navigateToStep = useCallback((targetStep: number) => {
    setCurrentStep(targetStep);
  }, []);

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
            <PersonOutlineIcon
              sx={{
                fontSize: 28,
                color: '#002677',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: '23px',
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
            />
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
