import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export type StepStatus = 'completed' | 'current' | 'incomplete';

export interface StepConfig {
  label: string;
  status: StepStatus;
}

export interface AddClientStepperProps {
  currentStep: number;
  steps?: StepConfig[];
  onStepClick?: (stepIndex: number) => void;
}

const DEFAULT_STEP_LABELS = [
  'Client Details',
  'Contract Details',
  'Contacts & Access',
  'Operational Units',
  'Confirmation',
];

/**
 * Generates step configurations based on the current step index.
 * Steps before currentStep are 'completed', currentStep is 'current',
 * and steps after are 'incomplete'.
 */
const generateStepConfigs = (
  currentStep: number,
  stepLabels: string[] = DEFAULT_STEP_LABELS
): StepConfig[] => {
  return stepLabels.map((label, index) => ({
    label,
    status:
      index < currentStep
        ? 'completed'
        : index === currentStep
          ? 'current'
          : 'incomplete',
  }));
};

const StepIndicator: React.FC<{
  stepNumber: number;
  status: StepStatus;
}> = ({ stepNumber, status }) => {
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  // Completed: dark grey bg with white check icon
  if (isCompleted) {
    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4B4D4F',
        }}
      >
        <CheckIcon sx={{ fontSize: 16, color: '#FFFFFF', strokeWidth: 1 }} />
      </Box>
    );
  }

  // Current: dark blue bg with number, surrounded by grey ring
  if (isCurrent) {
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          border: '2px solid #4B4D4F',
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#002677',
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1,
            }}
          >
            {stepNumber}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Incomplete: white bg with grey border and number
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        border: '2px solid #6D6E70',
      }}
    >
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#6D6E70',
          lineHeight: 1,
        }}
      >
        {stepNumber}
      </Typography>
    </Box>
  );
};

export const AddClientStepper: React.FC<AddClientStepperProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  const stepConfigs = steps || generateStepConfigs(currentStep);

  const getStatusLabel = (status: StepStatus): string => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'incomplete':
        return 'Incomplete';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        py: 2,
      }}
    >
      {stepConfigs.map((step, index) => (
        <React.Fragment key={step.label}>
          {/* Step item container */}
          <Box
            onClick={() => onStepClick?.(index)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 130,
              cursor: onStepClick ? 'pointer' : 'default',
              '&:hover': onStepClick ? { opacity: 0.8 } : {},
            }}
          >
            {/* Status label */}
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                color: step.status === 'current' ? '#002677' : '#6D6E70',
                mb: 0.5,
                lineHeight: 1.27,
              }}
            >
              {getStatusLabel(step.status)}
            </Typography>

            {/* Step indicator circle */}
            <StepIndicator stepNumber={index + 1} status={step.status} />

            {/* Step label */}
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: step.status === 'current' ? 700 : 400,
                color: step.status === 'current' ? '#002677' : '#323334',
                mt: 0.5,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {step.label}
            </Typography>
          </Box>

          {/* Connector line between steps */}
          {index < stepConfigs.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: '2px',
                backgroundColor: '#323334',
                alignSelf: 'center',
                mt: -2, // Offset to align with circle center
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default AddClientStepper;
