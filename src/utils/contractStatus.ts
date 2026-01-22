/**
 * Utility functions for contract status calculations
 */

import type { Contract } from '../types/cag.types';

/**
 * Contract status type
 */
export type ContractStatus = 'Active' | 'Inactive';

/**
 * Calculates the contract status based on effective and termination dates
 * 
 * A contract is considered "Active" if:
 * - The current date is on or after the effective date, AND
 * - Either there is no termination date (ongoing contract), OR
 * - The current date is before or on the termination date
 * 
 * Otherwise, the contract is "Inactive"
 * 
 * @param contract - The contract object containing effectiveDate and terminateDate
 * @returns 'Active' if the contract is currently active, 'Inactive' otherwise
 * 
 * @example
 * // Contract with no termination date (ongoing)
 * calculateContractStatus({ 
 *   effectiveDate: '2024-01-01', 
 *   terminateDate: null 
 * }) // Returns 'Active'
 * 
 * @example
 * // Contract that has ended
 * calculateContractStatus({ 
 *   effectiveDate: '2020-01-01', 
 *   terminateDate: '2023-12-31' 
 * }) // Returns 'Inactive' (if current date is after 2023-12-31)
 */
export function calculateContractStatus(contract: Contract): ContractStatus {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to start of day for date comparison
  
  const effectiveDate = new Date(contract.effectiveDate);
  effectiveDate.setHours(0, 0, 0, 0);
  
  // Contract hasn't started yet
  if (now < effectiveDate) {
    return 'Inactive';
  }
  
  // Contract has no termination date (ongoing)
  if (contract.terminateDate === null) {
    return 'Active';
  }
  
  const terminateDate = new Date(contract.terminateDate);
  terminateDate.setHours(0, 0, 0, 0);
  
  // Contract is active if current date is on or before termination date
  if (now <= terminateDate) {
    return 'Active';
  }
  
  // Contract has ended
  return 'Inactive';
}
