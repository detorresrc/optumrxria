/**
 * End-to-End Tests for CAG Management Page
 * 
 * This test suite validates the complete user flows for CAG management:
 * 1. Client selection → contract selection → OU selection → view assigned CAGs
 * 2. Search for unassigned CAGs → select CAGs → assign to OU
 * 3. Select assigned CAGs → bulk status update
 * 4. Loading states display correctly
 * 5. Error states display correctly
 * 
 * Requirements: All requirements from CAG API Integration spec
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManageCAGsPage } from './ManageCAGsPage';
import { cagApiService } from '../services/cagApiService';

// Mock the API service
vi.mock('../services/cagApiService');

// Mock data for testing
const mockClients = {
  clientList: [
    { clientId: 'C001', clientName: 'Test Client 1', clientReferenceId: 'REF001' },
    { clientId: 'C002', clientName: 'Test Client 2', clientReferenceId: 'REF002' },
  ]
};

const mockContracts = {
  contractList: [
    { 
      contractInternalId: 'CT001', 
      contractId: 'CONTRACT-001', 
      effectiveDate: '2024-01-01', 
      terminateDate: '2025-12-31' 
    },
    { 
      contractInternalId: 'CT002', 
      contractId: 'CONTRACT-002', 
      effectiveDate: '2023-01-01', 
      terminateDate: null 
    },
  ]
};

const mockOperationalUnits = {
  operationUnitList: [
    { 
      operationUnitInternalId: 'OU001', 
      operationUnitId: 'OP-001', 
      operationUnitName: 'Operations Unit 1' 
    },
    { 
      operationUnitInternalId: 'OU002', 
      operationUnitId: 'OP-002', 
      operationUnitName: 'Operations Unit 2' 
    },
  ]
};

const mockAssignedCAGs = {
  ouCagList: [
    {
      ouCagId: 'OUCAG001',
      operationUnitId: 'OP-001',
      operationUnitInternalId: 'OU001',
      cagId: 'CAG001',
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: '2024-12-31',
      assigmentStatus: 'ACTIVE' as const,
      carrierId: 'CARR001',
      carrierName: 'Test Carrier 1',
      assignmentLevel: 'CARRIER' as const,
      accountId: 'ACC001',
      accountName: 'Test Account 1',
      groupId: 'GRP001',
      groupName: 'Test Group 1',
    },
    {
      ouCagId: 'OUCAG002',
      operationUnitId: 'OP-001',
      operationUnitInternalId: 'OU001',
      cagId: 'CAG002',
      effectiveStartDate: '2024-01-01',
      effectiveEndDate: null,
      assigmentStatus: 'INACTIVE' as const,
      carrierId: 'CARR002',
      carrierName: 'Test Carrier 2',
      assignmentLevel: 'ACCOUNT' as const,
      accountId: 'ACC002',
      accountName: 'Test Account 2',
      groupId: 'GRP002',
      groupName: 'Test Group 2',
    },
  ],
  count: 2
};

const mockUnassignedCAGs = {
  entities: [
    {
      cagId: 'CAG003',
      carrierId: 'CARR003',
      carrierName: 'Unassigned Carrier 1',
      accountId: 'ACC003',
      accountName: 'Unassigned Account 1',
      groupId: 'GRP003',
      groupName: 'Unassigned Group 1',
    },
    {
      cagId: 'CAG004',
      carrierId: 'CARR004',
      carrierName: 'Unassigned Carrier 2',
      accountId: 'ACC004',
      accountName: 'Unassigned Account 2',
      groupId: 'GRP004',
      groupName: 'Unassigned Group 2',
    },
  ]
};

describe('ManageCAGsPage - End-to-End Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup default successful API responses
    vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({ data: mockClients });
    vi.mocked(cagApiService.fetchContracts).mockResolvedValue({ data: mockContracts });
    vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({ data: mockOperationalUnits });
    vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({ data: mockAssignedCAGs });
    vi.mocked(cagApiService.searchCAGs).mockResolvedValue({ data: mockUnassignedCAGs });
    vi.mocked(cagApiService.assignCAGs).mockResolvedValue({ data: { message: 'Success' } });
    vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({ data: { message: 'Success' } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Flow 1: Client → Contract → OU → View Assigned CAGs', () => {
    it('should complete the full selection flow and display assigned CAGs', async () => {
      const user = userEvent.setup();
      render(<ManageCAGsPage />);

      // Step 1: Wait for clients to load
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalledTimes(1);
      });

      // Step 2: Select a client
      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      
      const clientOption = await screen.findByText('Test Client 1');
      await user.click(clientOption);

      // Verify contracts are fetched
      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalledWith('C001');
      });

      // Step 3: Select a contract
      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      
      const contractOption = await screen.findByText(/CONTRACT-001/);
      await user.click(contractOption);

      // Verify contract status is displayed
      await waitFor(() => {
        expect(screen.getByText(/Contract status/i)).toBeInTheDocument();
        expect(screen.getByText(/Active/i)).toBeInTheDocument();
      });

      // Verify operational units are fetched
      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalledWith('CT001');
      });

      // Step 4: Select an operational unit
      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      
      const ouOption = await screen.findByText(/OP-001 - Operations Unit 1/);
      await user.click(ouOption);

      // Step 5: Verify assigned CAGs are fetched and displayed
      await waitFor(() => {
        expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledWith('OU001', 0, 10);
      });

      // Verify assigned CAGs are displayed
      await waitFor(() => {
        expect(screen.getByText(/Number of assigned CAGs: 2/i)).toBeInTheDocument();
        expect(screen.getByText('Test Carrier 1')).toBeInTheDocument();
        expect(screen.getByText('Test Carrier 2')).toBeInTheDocument();
      });
    });

    it('should display loading states during data fetching', async () => {
      const user = userEvent.setup();
      
      // Mock delayed responses
      vi.mocked(cagApiService.fetchActiveClients).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockClients }), 100))
      );
      
      render(<ManageCAGsPage />);

      // Verify loading state for clients
      expect(screen.getByText(/Loading clients.../i)).toBeInTheDocument();

      // Wait for clients to load
      await waitFor(() => {
        expect(screen.queryByText(/Loading clients.../i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Flow 2: Search → Select → Assign CAGs', () => {
    it('should complete the full search and assignment flow', async () => {
      const user = userEvent.setup();
      render(<ManageCAGsPage />);

      // Complete the selection flow first
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      // Expand the Assign CAGs accordion
      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      // Wait for accordion to expand
      await waitFor(() => {
        expect(screen.getByText(/Select Assignment Level/i)).toBeInTheDocument();
      });

      // Select assignment level
      const carrierRadio = screen.getByLabelText(/^Carrier$/i);
      await user.click(carrierRadio);

      // Enter search criteria
      const carrierNameInput = screen.getByPlaceholderText(/Enter carrier name/i);
      await user.type(carrierNameInput, 'Test Carrier');

      // Click search button
      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      // Verify search API is called
      await waitFor(() => {
        expect(cagApiService.searchCAGs).toHaveBeenCalledWith(
          expect.objectContaining({
            assignmentLevel: 'carrier',
            carrierName: 'Test Carrier'
          })
        );
      });

      // Verify search results are displayed
      await waitFor(() => {
        expect(screen.getByText(/Number of unassigned CAGs: 2/i)).toBeInTheDocument();
        expect(screen.getByText('Unassigned Carrier 1')).toBeInTheDocument();
      });

      // Select CAGs for assignment
      const checkboxes = screen.getAllByRole('checkbox');
      const firstCAGCheckbox = checkboxes.find(cb => 
        cb.parentElement?.textContent?.includes('Unassigned Carrier 1')
      );
      if (firstCAGCheckbox) {
        await user.click(firstCAGCheckbox);
      }

      // Click assign button
      const assignButton = screen.getByRole('button', { name: /Assign \(1\)/i });
      await user.click(assignButton);

      // Confirm assignment in modal
      await waitFor(() => {
        expect(screen.getByText(/Confirm CAG Assignment/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /Yes, Assign/i });
      await user.click(confirmButton);

      // Verify assignment API is called
      await waitFor(() => {
        expect(cagApiService.assignCAGs).toHaveBeenCalledWith(
          expect.objectContaining({
            operationUnitInternalId: 'OU001',
            assignmentType: 'Carrier',
            cagIds: expect.arrayContaining(['CAG003'])
          })
        );
      });

      // Verify success message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Successfully assigned/i)).toBeInTheDocument();
      });
    });

    it('should validate date format before searching', async () => {
      const user = userEvent.setup();
      render(<ManageCAGsPage />);

      // Setup and expand accordion (abbreviated for brevity)
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      // Enter invalid date format
      const startDateInput = screen.getByPlaceholderText(/MM\/DD\/YYYY/i);
      await user.type(startDateInput, '2024-01-01'); // Wrong format

      // Try to search
      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Invalid date format/i)).toBeInTheDocument();
      });

      // Verify search API is NOT called
      expect(cagApiService.searchCAGs).not.toHaveBeenCalled();
    });

    it('should clear search results and parameters', async () => {
      const user = userEvent.setup();
      render(<ManageCAGsPage />);

      // Complete setup and perform search (abbreviated)
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      const carrierNameInput = screen.getByPlaceholderText(/Enter carrier name/i);
      await user.type(carrierNameInput, 'Test');

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/Number of unassigned CAGs/i)).toBeInTheDocument();
      });

      // Click clear button
      const clearButton = screen.getByText(/Clear/i);
      await user.click(clearButton);

      // Verify search results are cleared
      await waitFor(() => {
        expect(screen.queryByText(/Number of unassigned CAGs/i)).not.toBeInTheDocument();
      });

      // Verify input is cleared
      expect(carrierNameInput).toHaveValue('');
    });
  });

  describe('Flow 3: Select Assigned CAGs → Bulk Status Update', () => {
    it('should complete the bulk status update flow', async () => {
      const user = userEvent.setup();
      render(<ManageCAGsPage />);

      // Complete the selection flow
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      // Wait for assigned CAGs to load
      await waitFor(() => {
        expect(screen.getByText(/Number of assigned CAGs: 2/i)).toBeInTheDocument();
      });

      // Select CAGs for bulk action
      const checkboxes = screen.getAllByRole('checkbox');
      const firstCAGCheckbox = checkboxes[1]; // Skip "select all" checkbox
      await user.click(firstCAGCheckbox);

      // Select bulk action
      const bulkActionSelect = screen.getByDisplayValue(/Bulk actions/i);
      await user.click(bulkActionSelect);
      
      const setActiveOption = await screen.findByText(/Set Active/i);
      await user.click(setActiveOption);

      // Click apply button
      const applyButton = screen.getByText(/Apply/i);
      await user.click(applyButton);

      // Verify status update API is called
      await waitFor(() => {
        expect(cagApiService.updateCAGStatus).toHaveBeenCalledWith(
          expect.objectContaining({
            ouCagIds: expect.arrayContaining(['OUCAG001']),
            status: 'ACTIVE'
          })
        );
      });

      // Verify assigned CAGs list is refreshed
      await waitFor(() => {
        expect(cagApiService.fetchAssignedCAGs).toHaveBeenCalledTimes(2); // Initial + refresh
      });
    });

    it('should disable bulk actions when no CAGs are selected', async () => {
      const user = userEvent.setup();
      render(<ManageCAGsPage />);

      // Complete the selection flow
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      // Wait for assigned CAGs to load
      await waitFor(() => {
        expect(screen.getByText(/Number of assigned CAGs: 2/i)).toBeInTheDocument();
      });

      // Verify bulk action dropdown is disabled
      const bulkActionSelect = screen.getByDisplayValue(/Bulk actions/i);
      expect(bulkActionSelect).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    it('should display loading indicator for clients', async () => {
      vi.mocked(cagApiService.fetchActiveClients).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockClients }), 200))
      );

      render(<ManageCAGsPage />);

      // Verify loading state is displayed
      expect(screen.getByText(/Loading clients.../i)).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading clients.../i)).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display loading indicator for contracts', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchContracts).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockContracts }), 200))
      );

      render(<ManageCAGsPage />);

      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      // Verify loading state is displayed
      await waitFor(() => {
        expect(screen.getByText(/Loading contracts.../i)).toBeInTheDocument();
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading contracts.../i)).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display loading indicator for operational units', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchOperationalUnits).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockOperationalUnits }), 200))
      );

      render(<ManageCAGsPage />);

      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      // Verify loading state is displayed
      await waitFor(() => {
        expect(screen.getByText(/Loading operational units.../i)).toBeInTheDocument();
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/Loading operational units.../i)).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display loading indicator for assigned CAGs', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchAssignedCAGs).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockAssignedCAGs }), 200))
      );

      render(<ManageCAGsPage />);

      // Complete selection flow
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      // Verify loading indicator is displayed
      await waitFor(() => {
        const loadingIndicators = screen.getAllByRole('progressbar');
        expect(loadingIndicators.length).toBeGreaterThan(0);
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText(/Number of assigned CAGs: 2/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display loading indicator during search', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.searchCAGs).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockUnassignedCAGs }), 200))
      );

      render(<ManageCAGsPage />);

      // Complete setup and expand accordion
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      const carrierNameInput = screen.getByPlaceholderText(/Enter carrier name/i);
      await user.type(carrierNameInput, 'Test');

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      // Verify loading indicator is displayed
      await waitFor(() => {
        const loadingIndicators = screen.getAllByRole('progressbar');
        expect(loadingIndicators.length).toBeGreaterThan(0);
      });

      // Wait for search to complete
      await waitFor(() => {
        expect(screen.getByText(/Number of unassigned CAGs/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Error States', () => {
    it('should display error when client fetch fails', async () => {
      vi.mocked(cagApiService.fetchActiveClients).mockResolvedValue({
        error: 'Failed to fetch clients. Please try again.'
      });

      render(<ManageCAGsPage />);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch clients/i)).toBeInTheDocument();
      });
    });

    it('should display error when contract fetch fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
        error: 'Failed to fetch contracts. Please try again.'
      });

      render(<ManageCAGsPage />);

      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch contracts/i)).toBeInTheDocument();
      });
    });

    it('should display error when operational unit fetch fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchOperationalUnits).mockResolvedValue({
        error: 'Failed to fetch operational units. Please try again.'
      });

      render(<ManageCAGsPage />);

      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch operational units/i)).toBeInTheDocument();
      });
    });

    it('should display error when assigned CAGs fetch fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
        error: 'Failed to fetch assigned CAGs. Please try again.'
      });

      render(<ManageCAGsPage />);

      // Complete selection flow
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch assigned CAGs/i)).toBeInTheDocument();
      });
    });

    it('should display error when search fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
        error: 'Search failed. Please try again.'
      });

      render(<ManageCAGsPage />);

      // Complete setup and perform search
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      const carrierNameInput = screen.getByPlaceholderText(/Enter carrier name/i);
      await user.type(carrierNameInput, 'Test');

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Search failed/i)).toBeInTheDocument();
      });
    });

    it('should display error when assignment fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.assignCAGs).mockResolvedValue({
        error: 'Assignment failed. Please try again.'
      });

      render(<ManageCAGsPage />);

      // Complete setup and perform search
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      const carrierNameInput = screen.getByPlaceholderText(/Enter carrier name/i);
      await user.type(carrierNameInput, 'Test');

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/Number of unassigned CAGs/i)).toBeInTheDocument();
      });

      const checkboxes = screen.getAllByRole('checkbox');
      const firstCAGCheckbox = checkboxes.find(cb => 
        cb.parentElement?.textContent?.includes('Unassigned Carrier 1')
      );
      if (firstCAGCheckbox) {
        await user.click(firstCAGCheckbox);
      }

      const assignButton = screen.getByRole('button', { name: /Assign \(1\)/i });
      await user.click(assignButton);

      await waitFor(() => {
        expect(screen.getByText(/Confirm CAG Assignment/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /Yes, Assign/i });
      await user.click(confirmButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Assignment failed/i)).toBeInTheDocument();
      });
    });

    it('should display error when status update fails', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.updateCAGStatus).mockResolvedValue({
        error: 'Status update failed. Please try again.'
      });

      render(<ManageCAGsPage />);

      // Complete selection flow
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      await waitFor(() => {
        expect(screen.getByText(/Number of assigned CAGs: 2/i)).toBeInTheDocument();
      });

      const checkboxes = screen.getAllByRole('checkbox');
      const firstCAGCheckbox = checkboxes[1];
      await user.click(firstCAGCheckbox);

      const bulkActionSelect = screen.getByDisplayValue(/Bulk actions/i);
      await user.click(bulkActionSelect);
      
      const setActiveOption = await screen.findByText(/Set Active/i);
      await user.click(setActiveOption);

      const applyButton = screen.getByText(/Apply/i);
      await user.click(applyButton);

      // Verify error message is displayed
      await waitFor(() => {
        expect(screen.getByText(/Status update failed/i)).toBeInTheDocument();
      });
    });

    it('should maintain current state when error occurs', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchContracts).mockResolvedValue({
        error: 'Failed to fetch contracts'
      });

      render(<ManageCAGsPage />);

      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch contracts/i)).toBeInTheDocument();
      });

      // Verify client selection is maintained
      expect(clientSelect).toHaveTextContent('Test Client 1');

      // Verify contract dropdown is still disabled (no contracts loaded)
      const contractSelect = screen.getByLabelText(/contract/i);
      expect(contractSelect).toBeDisabled();
    });
  });

  describe('Empty States', () => {
    it('should display empty state when no assigned CAGs exist', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.fetchAssignedCAGs).mockResolvedValue({
        data: { ouCagList: [], count: 0 }
      });

      render(<ManageCAGsPage />);

      // Complete selection flow
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      // Verify empty state message is displayed
      await waitFor(() => {
        expect(screen.getByText(/No CAGs assigned to this operational unit/i)).toBeInTheDocument();
      });
    });

    it('should display empty state when search returns no results', async () => {
      const user = userEvent.setup();
      
      vi.mocked(cagApiService.searchCAGs).mockResolvedValue({
        data: { entities: [] }
      });

      render(<ManageCAGsPage />);

      // Complete setup and perform search
      await waitFor(() => {
        expect(cagApiService.fetchActiveClients).toHaveBeenCalled();
      });

      const clientSelect = screen.getByLabelText(/client/i);
      await user.click(clientSelect);
      await user.click(await screen.findByText('Test Client 1'));

      await waitFor(() => {
        expect(cagApiService.fetchContracts).toHaveBeenCalled();
      });

      const contractSelect = screen.getByLabelText(/contract/i);
      await user.click(contractSelect);
      await user.click(await screen.findByText(/CONTRACT-001/));

      await waitFor(() => {
        expect(cagApiService.fetchOperationalUnits).toHaveBeenCalled();
      });

      const ouSelect = screen.getByLabelText(/operational unit/i);
      await user.click(ouSelect);
      await user.click(await screen.findByText(/OP-001/));

      const assignAccordion = screen.getByText(/Assign CAGs -/);
      const expandButton = assignAccordion.parentElement?.querySelector('button');
      if (expandButton) {
        await user.click(expandButton);
      }

      const carrierNameInput = screen.getByPlaceholderText(/Enter carrier name/i);
      await user.type(carrierNameInput, 'NonExistent');

      const searchButton = screen.getByRole('button', { name: /Search/i });
      await user.click(searchButton);

      // Verify empty state message is displayed
      await waitFor(() => {
        expect(screen.getByText(/No unassigned CAGs found matching your search criteria/i)).toBeInTheDocument();
      });
    });
  });
});
