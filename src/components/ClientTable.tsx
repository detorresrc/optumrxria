import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Link,
  Box,
  Skeleton,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Client } from '../types/client';
import { StatusChip } from './StatusChip';

/**
 * Props for the ClientTable component
 */
export interface ClientTableProps {
  /** Array of client data to display */
  clients: Client[];
  /** Currently selected client IDs */
  selectedIds: string[];
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when client name is clicked */
  onClientClick: (clientId: string) => void;
  /** Callback when delete action is clicked */
  onDeleteClient: (clientId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
}

/** Table column definitions */
const columns = [
  { id: 'checkbox', label: '', width: 48 },
  { id: 'actions', label: 'Actions', width: 80 },
  { id: 'clientName', label: 'Client Name', width: 'auto' },
  { id: 'clientId', label: 'Client ID', width: 120 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'clientReferenceId', label: 'Client Reference ID', width: 160 },
  { id: 'effectiveDate', label: 'Effective Date', width: 140 },
  { id: 'operationalUnitsCount', label: 'No. of Operational Units', width: 180 },
];

/**
 * ClientTable component displays client records in a data table
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 */
export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  selectedIds,
  onSelectionChange,
  onClientClick,
  onDeleteClient,
  isLoading = false,
}) => {
  const isAllSelected = clients.length > 0 && selectedIds.length === clients.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < clients.length;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(clients.map((client) => client.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (clientId: string) => {
    if (selectedIds.includes(clientId)) {
      onSelectionChange(selectedIds.filter((id) => id !== clientId));
    } else {
      onSelectionChange([...selectedIds, clientId]);
    }
  };

  const handleClientClick = (clientId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    onClientClick(clientId);
  };

  // Loading skeleton rows
  if (isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#323334',
                    borderBottom: '1px solid #CBCCCD',
                    width: column.width,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {/* Checkbox column header */}
            <TableCell
              sx={{
                width: columns[0].width,
                borderBottom: '1px solid #CBCCCD',
                padding: '16px',
              }}
            >
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                sx={{
                  color: '#CBCCCD',
                  '&.Mui-checked': {
                    color: '#002677',
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: '#002677',
                  },
                }}
              />
            </TableCell>
            {/* Other column headers */}
            {columns.slice(1).map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#323334',
                  borderBottom: '1px solid #CBCCCD',
                  width: column.width,
                  padding: '16px',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client, index) => {
            const isSelected = selectedIds.includes(client.id);
            const isAlternateRow = index % 2 === 1;

            return (
              <TableRow
                key={client.id}
                sx={{
                  backgroundColor: isAlternateRow ? '#FAFAFA' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  },
                }}
              >
                {/* Checkbox cell */}
                <TableCell sx={{ padding: '16px', borderBottom: '1px solid #CBCCCD' }}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleSelectOne(client.id)}
                    sx={{
                      color: '#CBCCCD',
                      '&.Mui-checked': {
                        color: '#002677',
                      },
                    }}
                  />
                </TableCell>

                {/* Actions cell */}
                <TableCell sx={{ padding: '16px', borderBottom: '1px solid #CBCCCD' }}>
                  <IconButton
                    onClick={() => onDeleteClient(client.id)}
                    size="small"
                    aria-label={`Delete ${client.clientName}`}
                    sx={{
                      color: '#4B4D4F',
                      '&:hover': {
                        color: '#002677',
                      },
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>

                {/* Client Name cell - clickable link */}
                <TableCell sx={{ padding: '16px', borderBottom: '1px solid #CBCCCD' }}>
                  <Link
                    href="#"
                    onClick={handleClientClick(client.id)}
                    sx={{
                      color: '#0C55B8',
                      textDecoration: 'none',
                      fontWeight: 400,
                      fontSize: '16px',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {client.clientName}
                  </Link>
                </TableCell>

                {/* Client ID cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F',
                  }}
                >
                  {client.clientId}
                </TableCell>

                {/* Status cell */}
                <TableCell sx={{ padding: '16px', borderBottom: '1px solid #CBCCCD' }}>
                  <StatusChip status={client.status} />
                </TableCell>

                {/* Client Reference ID cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F',
                  }}
                >
                  {client.clientReferenceId}
                </TableCell>

                {/* Effective Date cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F',
                  }}
                >
                  {client.effectiveDate}
                </TableCell>

                {/* Operational Units Count cell */}
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #CBCCCD',
                    fontSize: '16px',
                    color: '#4B4D4F',
                  }}
                >
                  {client.operationalUnitsCount}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Empty state */}
      {clients.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '48px',
            color: '#4B4D4F',
            fontSize: '16px',
          }}
        >
          No clients found
        </Box>
      )}
    </TableContainer>
  );
};
