import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import EditIcon from '../assets/edit-icon.svg';
import CancelIcon from '../assets/cancel-icon.svg';
import CheckboxIcon from '../assets/checkbox-unchecked.svg';

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

const mockData: CAGRow[] = [
  { id: '1', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: 'Account Name A', accountId: 'Lxxxxxxxxxx', groupName: '-', groupId: '', status: 'Active', startDate: '12/23/2024', endDate: '12/23/2025' },
  { id: '2', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: '-', accountId: '', groupName: '-', groupId: '', status: 'Active', startDate: '12/23/2024', endDate: '12/23/2025' },
  { id: '3', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: 'Account Name A', accountId: 'Lxxxxxxxxxx', groupName: '-', groupId: '', status: 'Active', startDate: '12/23/2024', endDate: '-' },
  { id: '4', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: 'Account Name A', accountId: 'Lxxxxxxxxxx', groupName: 'Group Name A', groupId: 'Lxxxxxx - xxxx', status: 'Inactive', startDate: '12/23/2024', endDate: '-' },
  { id: '5', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: '-', accountId: '', groupName: '-', groupId: '', status: 'Active', startDate: '12/23/2024', endDate: '12/23/2025' },
  { id: '6', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: 'Account Name A', accountId: 'Lxxxxxxxxxx', groupName: 'Group Name A', groupId: 'Lxxxxxx - xxxx', status: 'Active', startDate: '12/23/2024', endDate: '12/23/2025' },
  { id: '7', carrierName: 'Carrier Name A', carrierId: 'Lxxxxxxx', accountName: '-', accountId: '', groupName: '-', groupId: '', status: 'Inactive', startDate: '12/23/2024', endDate: '12/23/2025' },
];

export const CAGAssignedTable: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Actions Column */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: '1px solid #CECDCA'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          height: '54px',
          bgcolor: '#FAFAFA',
          borderBottom: '1px solid #E5E5E6'
        }}>
          <Typography sx={{ 
            fontFamily: '"Enterprise Sans VF", sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: 1.4,
            color: '#000000'
          }}>
            Actions
          </Typography>
        </Box>

        {/* Action Rows */}
        {mockData.map((row, index) => (
          <Box 
            key={row.id}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              p: 2,
              height: '76px',
              bgcolor: index % 2 === 0 ? '#FAFAFA' : '#FFFFFF',
              opacity: row.status === 'Inactive' ? 0.5 : 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={CheckboxIcon} alt="Select" style={{ width: 24, height: 24, cursor: 'pointer' }} />
              <IconButton size="small" sx={{ p: 0.5 }}>
                <img src={CancelIcon} alt="Cancel" style={{ width: 20, height: 20 }} />
              </IconButton>
              <IconButton size="small" sx={{ p: 0.5 }}>
                <img src={EditIcon} alt="Edit" style={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Main Table */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Row */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          p: 2,
          height: '54px',
          bgcolor: '#FAFAFA',
          borderBottom: '1px solid #E5E5E6'
        }}>
          <Typography sx={{ width: '180px', fontFamily: '"Enterprise Sans VF", sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: '#000000' }}>
            Carrier Name & ID
          </Typography>
          <Typography sx={{ width: '180px', fontFamily: '"Enterprise Sans VF", sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: '#000000' }}>
            Account Name & ID
          </Typography>
          <Typography sx={{ width: '180px', fontFamily: '"Enterprise Sans VF", sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: '#000000' }}>
            Group Name & ID
          </Typography>
          <Typography sx={{ width: '127px', fontFamily: '"Enterprise Sans VF", sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: '#000000' }}>
            Assignment Status
          </Typography>
          <Typography sx={{ width: '96px', fontFamily: '"Enterprise Sans VF", sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: '#000000' }}>
            Start Date
          </Typography>
          <Typography sx={{ width: '96px', fontFamily: '"Enterprise Sans VF", sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: '#000000' }}>
            End Date
          </Typography>
        </Box>

        {/* Data Rows */}
        {mockData.map((row, index) => (
          <Box 
            key={row.id}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              p: 2,
              height: '76px',
              bgcolor: index % 2 === 0 ? '#FAFAFA' : '#FFFFFF',
              opacity: row.status === 'Inactive' ? 0.5 : 1
            }}
          >
            <Typography sx={{ width: '180px', fontFamily: '"Enterprise Sans VF", sans-serif', fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
              {row.carrierName}<br />{row.carrierId}
            </Typography>
            <Typography sx={{ width: '180px', fontFamily: '"Enterprise Sans VF", sans-serif', fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
              {row.accountName}{row.accountId && <><br />{row.accountId}</>}
            </Typography>
            <Typography sx={{ width: '180px', fontFamily: '"Enterprise Sans VF", sans-serif', fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
              {row.groupName}{row.groupId && <><br />{row.groupId}</>}
            </Typography>
            <Box sx={{ width: '127px' }}>
              <Chip
                label={row.status}
                sx={{
                  bgcolor: row.status === 'Active' ? '#FFFFFF' : '#F3F3F3',
                  border: row.status === 'Active' ? '1px solid #FF612B' : '1px solid #323334',
                  color: '#323334',
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  lineHeight: 1.3,
                  height: 'auto',
                  padding: '2px 8px',
                  '& .MuiChip-label': {
                    padding: 0
                  }
                }}
              />
            </Box>
            <Typography sx={{ width: '96px', fontFamily: '"Enterprise Sans VF", sans-serif', fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
              {row.startDate}
            </Typography>
            <Typography sx={{ width: '96px', fontFamily: '"Enterprise Sans VF", sans-serif', fontSize: '16px', lineHeight: 1.4, fontWeight: 400, color: '#4B4D4F' }}>
              {row.endDate}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
