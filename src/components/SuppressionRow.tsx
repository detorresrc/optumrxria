import { Box, Grid, IconButton, Divider } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Grid container spacing={3} alignItems="flex-start" sx={{ flex: 1 }}>
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

        {/* Delete button - aligned to top-right of row (Requirements 5.8) */}
        {showDelete && (
          <IconButton
            onClick={onRemove}
            aria-label="Delete suppression"
            sx={{
              color: '#002677',
              padding: '8px',
              mt: 0,
              '&:hover': {
                backgroundColor: 'rgba(0, 38, 119, 0.04)',
              },
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: '24px' }} />
          </IconButton>
        )}
      </Box>
    </>
  );
};

export default SuppressionRow;
