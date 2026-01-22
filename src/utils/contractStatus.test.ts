/**
 * Unit tests for contract status calculation utility
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { calculateContractStatus } from './contractStatus';
import type { Contract } from '../types/cag.types';

describe('calculateContractStatus', () => {
  beforeEach(() => {
    // Mock the current date to 2024-06-15 for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Active contracts', () => {
    it('should return Active for ongoing contract with no termination date', () => {
      const contract: Contract = {
        contractInternalId: '1',
        contractId: 'C001',
        effectiveDate: '2024-01-01',
        terminateDate: null,
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should return Active for contract with future termination date', () => {
      const contract: Contract = {
        contractInternalId: '2',
        contractId: 'C002',
        effectiveDate: '2024-01-01',
        terminateDate: '2024-12-31',
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should return Active for contract terminating today', () => {
      const contract: Contract = {
        contractInternalId: '3',
        contractId: 'C003',
        effectiveDate: '2024-01-01',
        terminateDate: '2024-06-15', // Same as current date
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should return Active for contract starting today with no termination', () => {
      const contract: Contract = {
        contractInternalId: '4',
        contractId: 'C004',
        effectiveDate: '2024-06-15', // Same as current date
        terminateDate: null,
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should return Active for contract starting today with future termination', () => {
      const contract: Contract = {
        contractInternalId: '5',
        contractId: 'C005',
        effectiveDate: '2024-06-15', // Same as current date
        terminateDate: '2024-12-31',
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });
  });

  describe('Inactive contracts', () => {
    it('should return Inactive for contract with past termination date', () => {
      const contract: Contract = {
        contractInternalId: '6',
        contractId: 'C006',
        effectiveDate: '2023-01-01',
        terminateDate: '2024-06-14', // One day before current date
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });

    it('should return Inactive for contract with future effective date', () => {
      const contract: Contract = {
        contractInternalId: '7',
        contractId: 'C007',
        effectiveDate: '2024-06-16', // One day after current date
        terminateDate: '2024-12-31',
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });

    it('should return Inactive for contract with future effective date and no termination', () => {
      const contract: Contract = {
        contractInternalId: '8',
        contractId: 'C008',
        effectiveDate: '2024-07-01',
        terminateDate: null,
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });

    it('should return Inactive for expired contract', () => {
      const contract: Contract = {
        contractInternalId: '9',
        contractId: 'C009',
        effectiveDate: '2020-01-01',
        terminateDate: '2023-12-31',
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });
  });

  describe('Edge cases', () => {
    it('should handle contracts with same effective and termination date (today)', () => {
      const contract: Contract = {
        contractInternalId: '10',
        contractId: 'C010',
        effectiveDate: '2024-06-15',
        terminateDate: '2024-06-15',
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should handle contracts with same effective and termination date (past)', () => {
      const contract: Contract = {
        contractInternalId: '11',
        contractId: 'C011',
        effectiveDate: '2024-01-01',
        terminateDate: '2024-01-01',
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });

    it('should handle contracts with ISO date format', () => {
      const contract: Contract = {
        contractInternalId: '12',
        contractId: 'C012',
        effectiveDate: '2024-01-01T00:00:00Z',
        terminateDate: '2024-12-31T23:59:59Z',
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should handle contracts with different date formats', () => {
      const contract: Contract = {
        contractInternalId: '13',
        contractId: 'C013',
        effectiveDate: '2024-01-01',
        terminateDate: '2024-12-31',
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });
  });

  describe('Boundary conditions', () => {
    it('should return Active for contract effective yesterday with no termination', () => {
      const contract: Contract = {
        contractInternalId: '14',
        contractId: 'C014',
        effectiveDate: '2024-06-14',
        terminateDate: null,
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });

    it('should return Inactive for contract terminating yesterday', () => {
      const contract: Contract = {
        contractInternalId: '15',
        contractId: 'C015',
        effectiveDate: '2024-01-01',
        terminateDate: '2024-06-14',
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });

    it('should return Inactive for contract effective tomorrow', () => {
      const contract: Contract = {
        contractInternalId: '16',
        contractId: 'C016',
        effectiveDate: '2024-06-16',
        terminateDate: null,
      };

      expect(calculateContractStatus(contract)).toBe('Inactive');
    });

    it('should return Active for contract terminating tomorrow', () => {
      const contract: Contract = {
        contractInternalId: '17',
        contractId: 'C017',
        effectiveDate: '2024-01-01',
        terminateDate: '2024-06-16',
      };

      expect(calculateContractStatus(contract)).toBe('Active');
    });
  });
});
