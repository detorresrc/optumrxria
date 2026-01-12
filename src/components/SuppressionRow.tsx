import { Box, Grid, IconButton, Divider } from '@mui/material';
import DeleteIcon from '../assets/delete-icon.svg';
import type { Control, FieldErrors } from 'react-hook-form';
import { FormSelectField } from './FormSelectField';
import { FormDateField } from './FormDateField';
import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

// Suppression Type options per design document (Requirements 5.4)
const SUPPRESSION_TYPE_OPTIONS = [
  { value: 'rejected_claims', label: 'Rejected Claims' },
  { value: 'net_zero_claims', label: 'Net-Zero Claims' },
  { value: 'zero_dollar_claims', label: 'Zero Dollar Claims' },
];

interface SuppressionRowProps {
  index: number;
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  onRemove: () => void;
  showDelete: boolean;
  showDivider?: boolean;
}

export const SuppressionRow: React.FC<SuppressionRowProps> = ({
  index,
  control,
  errors,
  onRemove,
  showDelete,
  showDivider = false,
}) => {
  // Get nested errors for suppressions array
  const suppressionErrors = errors.suppressions?.[index];

  return (
    <>
      {/* Horizontal divider between rows (Requirements 5.11) */}
      {showDivider && (
        <Divider
          sx={{
            borderColor: '#CBCCCD',
            my: 3,
          }}
        />
      )}

      {/* Suppression Row: Type, Start Date, End Date with Delete Button */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        {/* Delete Button Box */}
        {showDelete && (
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={onRemove}
              aria-label="Delete suppression"
              disableRipple
              sx={{
                padding: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <img src={DeleteIcon} alt="Delete" width={16} height={18} />
            </IconButton>
          </Box>
        )}

        {/* Form Fields Box */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 4 }}>
              <FormSelectField
                name={`suppressions.${index}.suppressionType`}
                control={control}
                label="Select Suppression Type"
                options={SUPPRESSION_TYPE_OPTIONS}
                placeholder="Select suppression type"
                error={suppressionErrors?.suppressionType}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormDateField
                name={`suppressions.${index}.suppressionStartDate`}
                control={control}
                label="Suppression Start Date"
                error={suppressionErrors?.suppressionStartDate}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormDateField
                name={`suppressions.${index}.suppressionEndDate`}
                control={control}
                label="Suppression End Date"
                error={suppressionErrors?.suppressionEndDate}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default SuppressionRow;
