import React from 'react';
import { Box, Typography } from '@mui/material';

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

  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isCurrent || isCompleted ? '#002677' : '#FFFFFF',
        border: isCurrent || isCompleted ? 'none' : '1px solid #6D6E70',
        boxShadow: isCurrent ? '0px 2px 4px rgba(0, 38, 119, 0.25)' : 'none',
      }}
    >
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: isCurrent || isCompleted ? '#FFFFFF' : '#6D6E70',
          lineHeight: 1,
        }}
      >
        {stepNumber}
      </Typography>
    </Box>
  );
};

const SpacerLine: React.FC = () => (
  <Box
    sx={{
      flex: 1,
      height: '1px',
      backgroundColor: '#CBCCCD',
      mx: 1,
    }}
  />
);

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
        alignItems: 'flex-start',
        width: '100%',
        py: 2,
      }}
    >
      {stepConfigs.map((step, index) => (
        <React.Fragment key={step.label}>
          <Box
            onClick={() => onStepClick?.(index)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 120,
              cursor: onStepClick ? 'pointer' : 'default',
              '&:hover': onStepClick ? {
                opacity: 0.8,
              } : {},
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
                color: step.status === 'current' ? '#002677' : '#6D6E70',
                mt: 0.5,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {step.label}
            </Typography>
          </Box>

          {/* Spacer line between steps */}
          {index < stepConfigs.length - 1 && <SpacerLine />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default AddClientStepper;
