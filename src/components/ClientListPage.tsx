import React, { useState, useMemo } from 'react';
import { Box, Typography, Breadcrumbs, Link, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Header } from './Header';
import { Footer } from './Footer';
import { SuccessBanner } from './SuccessBanner';
import { ClientsOverviewCard } from './ClientsOverviewCard';
import { mockClients } from '../data/mockClients';
import { filterClientsBySearch } from '../utils/clientFilters';
import type { BulkAction } from './ActionBar';

/**
 * Props for the ClientListPage component
 */
export interface ClientListPageProps {
  /** Initial success message to display (e.g., after adding a client) */
  successMessage?: string;
  /** Callback when navigating to add client page */
  onAddClient?: () => void;
}

const PAGE_SIZE = 10;

/**
 * ClientListPage - Main page component for displaying the client list
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.4
 */
export const ClientListPage: React.FC<ClientListPageProps> = ({
  successMessage = '',
  onAddClient,
}) => {
  // Page state management
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [showSuccessBanner, setShowSuccessBanner] = useState(!!successMessage);
  const [bannerMessage, setBannerMessage] = useState(successMessage);

  // Filter clients based on search query - Requirements: 2.2
  const filteredClients = useMemo(() => {
    return filterClientsBySearch(mockClients, searchQuery);
  }, [searchQuery]);

  // Calculate pagination
  const totalClients = filteredClients.length;
  const totalPages = Math.ceil(totalClients / PAGE_SIZE);
  
  // Get current page clients
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    setSelectedClientIds([]);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedClientIds([]);
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedClientIds(selectedIds);
  };

  // Handle client click
  const handleClientClick = (clientId: string) => {
    console.log('Client clicked:', clientId);
    // Navigation to client details would be implemented here
  };

  // Handle delete client
  const handleDeleteClient = (clientId: string) => {
    console.log('Delete client:', clientId);
    // Delete functionality would be implemented here
  };

  // Handle Add Client button click - Requirements: 5.2
  const handleAddClient = () => {
    if (onAddClient) {
      onAddClient();
    }
  };

  // Handle Show Details button click
  const handleShowDetails = () => {
    console.log('Show details clicked');
  };

  // Handle Filters button click
  const handleFiltersClick = () => {
    console.log('Filters clicked');
  };

  // Handle bulk action - Requirements: 4.4
  const handleBulkAction = (action: BulkAction) => {
    console.log('Bulk action:', action, 'on clients:', selectedClientIds);
  };

  // Handle dismiss success banner - Requirements: 7.4
  const handleDismissBanner = () => {
    setShowSuccessBanner(false);
    setBannerMessage('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAFCFF',
      }}
    >
      {/* Header - Requirements: 1.1 */}
      <Header activeNavItem="Clients" />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          px: '84px',
          py: 3,
        }}
      >
        {/* Breadcrumbs - Requirements: 1.2 */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#6E7072' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            href="/"
            underline="hover"
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#0C55B8',
            }}
          >
            Home
          </Link>
          <Typography
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#4B4D4F',
            }}
          >
            Clients
          </Typography>
        </Breadcrumbs>

        {/* Section Header with Title and Search - Requirements: 1.3, 2.1, 2.3, 2.4 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Enterprise Sans VF", sans-serif',
              fontSize: '26px',
              fontWeight: 700,
              color: '#002677',
            }}
          >
            Clients
          </Typography>

          {/* Search Input - Requirements: 2.1, 2.3, 2.4 */}
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6E7072', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: '320px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '46px',
                backgroundColor: '#FFFFFF',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
                fontSize: '16px',
                height: '44px',
                '& fieldset': {
                  borderColor: '#CBCCCD',
                },
                '&:hover fieldset': {
                  borderColor: '#CBCCCD',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#CBCCCD',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputBase-input': {
                py: '10px',
                '&::placeholder': {
                  color: '#6E7072',
                  opacity: 1,
                },
              },
            }}
          />
        </Box>

        {/* Success Banner - Requirements: 7.1, 7.2, 7.3, 7.4 */}
        {showSuccessBanner && bannerMessage && (
          <Box sx={{ mb: 3 }}>
            <SuccessBanner
              message={bannerMessage}
              visible={showSuccessBanner}
              onDismiss={handleDismissBanner}
            />
          </Box>
        )}

        {/* Clients Overview Card - Requirements: 8.1, 8.2, 8.3 */}
        <ClientsOverviewCard
          clients={paginatedClients}
          totalClients={totalClients}
          selectedIds={selectedClientIds}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelectionChange={handleSelectionChange}
          onClientClick={handleClientClick}
          onDeleteClient={handleDeleteClient}
          onPageChange={handlePageChange}
          onAddClient={handleAddClient}
          onShowDetails={handleShowDetails}
          onFiltersClick={handleFiltersClick}
          onBulkAction={handleBulkAction}
        />
      </Box>

      {/* Footer - Requirements: 1.4 */}
      <Footer />
    </Box>
  );
};

export default ClientListPage;
