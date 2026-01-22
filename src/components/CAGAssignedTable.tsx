import React from 'react';
import { DataGrid, type GridRowSelectionModel } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import EditIcon from '../assets/edit-icon.svg';
import CancelIcon from '../assets/do-not-disturb.svg';
import type { AssignedCAG } from '../types/cag.types';

interface CAGAssignedTableProps {
  assignedCAGs: AssignedCAG[];
  selectedCAGs: string[];
  onSelectionChange: (ids: string[]) => void;
}

// Transform AssignedCAG to table row format
interface CAGRow {
  id: string;
  carrierName: string;
  carrierId: string;
  accountName: string;
  accountId: string;
  groupName: string;
  groupId: string;
  status: 'Active' | 'Inactive';
  startDate: string;
  endDate: string;
}

export const CAGAssignedTable: React.FC<CAGAssignedTableProps> = ({ 
  assignedCAGs, 
  selectedCAGs, 
  onSelectionChange 
}) => {
  // Transform API data to table row format
  const rows: CAGRow[] = assignedCAGs.map((cag) => ({
    id: cag.ouCagId,
    carrierName: cag.carrierName || '-',
    carrierId: cag.carrierId || '-',
    accountName: cag.accountName || '-',
    accountId: cag.accountId || '',
    groupName: cag.groupName || '-',
    groupId: cag.groupId || '',
    status: cag.assigmentStatus === 'ACTIVE' ? 'Active' : 'Inactive',
    startDate: cag.effectiveStartDate || '-',
    endDate: cag.effectiveEndDate || '-',
  }));

  // Handle selection change - GridRowSelectionModel.ids is a Set
  const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
    onSelectionChange(Array.from(selectionModel.ids) as string[]);
  };
  
  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <img src={CancelIcon} alt="Cancel" style={{ width: 20, height: 20 }} />
          </IconButton>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <img src={EditIcon} alt="Edit" style={{ width: 20, height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'carrier',
      headerName: 'Carrier Name & ID',
      width: 180,
      renderCell: (params: GridRenderCellParams<CAGRow>) => (
        <Typography sx={{ fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
          {params.row.carrierName}
          <br />
          {params.row.carrierId}
        </Typography>
      ),
    },
    {
      field: 'account',
      headerName: 'Account Name & ID',
      width: 180,
      renderCell: (params: GridRenderCellParams<CAGRow>) => (
        <Typography sx={{ fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
          {params.row.accountName}
          {params.row.accountId && (
            <>
              <br />
              {params.row.accountId}
            </>
          )}
        </Typography>
      ),
    },
    {
      field: 'group',
      headerName: 'Group Name & ID',
      width: 180,
      renderCell: (params: GridRenderCellParams<CAGRow>) => (
        <Typography sx={{ fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
          {params.row.groupName}
          {params.row.groupId && (
            <>
              <br />
              {params.row.groupId}
            </>
          )}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Assignment Status',
      width: 150,
      renderCell: (params: GridRenderCellParams<CAGRow>) => (
        <Chip
          label={params.row.status}
          sx={{
            bgcolor: params.row.status === 'Active' ? '#FFFFFF' : '#F3F3F3',
            border: params.row.status === 'Active' ? '1px solid #FF612B' : '1px solid #323334',
            color: '#323334',
            fontWeight: 700,
            fontSize: '12px',
            lineHeight: 1.3,
            height: 'auto',
            padding: '2px 8px',
            '& .MuiChip-label': {
              padding: 0,
            },
          }}
        />
      ),
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 120,
      renderCell: (params: GridRenderCellParams<CAGRow>) => (
        <Typography sx={{ fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
          {params.row.startDate}
        </Typography>
      ),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 120,
      renderCell: (params: GridRenderCellParams<CAGRow>) => (
        <Typography sx={{ fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
          {params.row.endDate}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={{ type: 'include', ids: new Set(selectedCAGs) }}
        onRowSelectionModelChange={handleSelectionChange}
        rowHeight={76}
        getRowClassName={(params) => (params.row.status === 'Inactive' ? 'inactive-row' : '')}
        sx={{
          border: 'none',
          borderRadius: '12px',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: '#FAFAFA',
            borderBottom: '1px solid #E5E5E6',
            minHeight: '54px !important',
            maxHeight: '54px !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: 1.4,
            color: '#000000',
          },
          '& .MuiDataGrid-row': {
            '&:nth-of-type(even)': {
              bgcolor: '#FAFAFA',
            },
            '&:nth-of-type(odd)': {
              bgcolor: '#FFFFFF',
            },
            '&.inactive-row': {
              opacity: 0.5,
            },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
};
