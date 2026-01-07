import React from 'react';
import {
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/** Bulk action types */
export type BulkAction = 'delete' | 'export' | 'archive' | '';

/**
 * Props for the ActionBar component
 */
export interface ActionBarProps {
  /** Total number of clients */
  totalClients: number;
  /** Number of selected clients */
  selectedCount: number;
  /** Callback when Add Client button is clicked */
  onAddClient: () => void;
  /** Callback when Show Details button is clicked */
  onShowDetails: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  /** Callback when bulk action is applied */
  onBulkAction: (action: BulkAction) => void;
}

/**
 * ActionBar component displays action buttons and bulk actions for the client list
 * Requirements: 4.1, 4.2, 5.1, 5.3, 5.4, 5.5
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  totalClients,
  selectedCount,
  onAddClient,
  onShowDetails,
  onFiltersClick,
  onBulkAction,
}) => {
  const [selectedAction, setSelectedAction] = React.useState<BulkAction>('');

  const handleActionChange = (event: SelectChangeEvent<BulkAction>) => {
    setSelectedAction(event.target.value as BulkAction);
  };

  const handleApply = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        gap: '12px',
      }}
    >
      {/* Left side - Client count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Client count - Requirements: 5.5 */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
          }}
        >
          Number of clients: {totalClients}
        </Typography>
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Apply link - Requirements: 4.2 */}
        <Typography
          component="span"
          onClick={handleApply}
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: selectedAction && selectedCount > 0 ? '#0C55B8' : '#0C55B8',
            cursor: 'pointer',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Apply
        </Typography>

        {/* Bulk actions dropdown - Requirements: 4.1 */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={selectedAction}
            onChange={handleActionChange}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              fontSize: '14px',
              color: '#4B4D4F',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#CBCCCD',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#002677',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#002677',
              },
              '& .MuiSelect-select': {
                padding: '8px 12px',
              },
            }}
            renderValue={(value) => {
              if (!value) {
                return 'Bulk actions';
              }
              return value.charAt(0).toUpperCase() + value.slice(1);
            }}
          >
            <MenuItem value="" disabled>
              Bulk actions
            </MenuItem>
            <MenuItem value="delete">Delete</MenuItem>
            <MenuItem value="export">Export</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
          </Select>
        </FormControl>

        {/* Add Client button - Requirements: 5.1 */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          onClick={onAddClient}
          sx={{
            backgroundColor: '#002677',
            color: '#FFFFFF',
            borderRadius: '46px',
            padding: '8px 20px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              backgroundColor: '#001a5c',
            },
          }}
        >
          Add Client
        </Button>

        {/* Show Details button - Requirements: 5.3 */}
        <Button
          variant="outlined"
          onClick={onShowDetails}
          sx={{
            borderColor: '#002677',
            color: '#002677',
            borderRadius: '46px',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              borderColor: '#001a5c',
              backgroundColor: 'rgba(0, 38, 119, 0.04)',
            },
          }}
        >
          Show Details
        </Button>

        {/* Filters button - Requirements: 5.4 */}
        <Button
          variant="outlined"
          endIcon={<TuneIcon sx={{ fontSize: '18px' }} />}
          onClick={onFiltersClick}
          sx={{
            borderColor: '#002677',
            color: '#002677',
            borderRadius: '46px',
            padding: '8px 24px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              borderColor: '#001a5c',
              backgroundColor: 'rgba(0, 38, 119, 0.04)',
            },
          }}
        >
          Filters
        </Button>
      </Box>
    </Box>
  );
};

export default ActionBar;
