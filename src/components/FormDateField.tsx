import { Box, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldError, FieldValues, Path } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs, { Dayjs } from 'dayjs';

interface FormDateFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const FormDateField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder = 'MM-DD-YYYY',
  error,
  disabled = false,
  fullWidth = true,
}: FormDateFieldProps<T>) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography
          component="label"
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.4,
          }}
        >
          {label}
          {required && (
            <Typography
              component="span"
              sx={{ color: '#C40000', ml: 0.5 }}
            >
              *
            </Typography>
          )}
        </Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            // Convert string value to Dayjs for the DatePicker
            const dateValue = field.value ? dayjs(field.value, 'MM-DD-YYYY') : null;
            
            return (
              <DatePicker
                value={dateValue}
                onChange={(newValue: Dayjs | null) => {
                  // Convert Dayjs back to string in MM-DD-YYYY format
                  const formattedDate = newValue?.isValid() 
                    ? newValue.format('MM-DD-YYYY') 
                    : '';
                  field.onChange(formattedDate);
                }}
                disabled={disabled}
                format="MM-DD-YYYY"
                slots={{
                  openPickerIcon: CalendarTodayIcon,
                }}
                slotProps={{
                  field: {
                    clearable: false,
                  },
                  textField: {
                    fullWidth: fullWidth,
                    size: 'small',
                    placeholder: placeholder,
                    error: !!error,
                    helperText: error?.message,
                    FormHelperTextProps: {
                      sx: {
                        color: '#C40000',
                        fontSize: '12px',
                        marginLeft: 0,
                      },
                    },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderWidth: '1px',
                          borderColor: error ? '#C40000' : 'grey.300',
                        },
                        '&:hover fieldset': {
                          borderColor: error ? '#C40000' : 'grey.400',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: error ? '#C40000' : 'primary.main',
                          borderWidth: '1px',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 12px',
                        fontSize: '14px',
                      },
                      '& .MuiInputAdornment-root': {
                        marginLeft: 0,
                      },
                    },
                  },
                  openPickerButton: {
                    sx: {
                      color: '#002677',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 38, 119, 0.04)',
                      },
                    },
                  },
                }}
              />
            );
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default FormDateField;
