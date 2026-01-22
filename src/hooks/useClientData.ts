/**
 * Custom hook for managing client, contract, and operational unit data
 * 
 * This hook provides state management for the cascading dropdown hierarchy:
 * Client → Contract → Operational Unit
 * 
 * It handles fetching data from the API, managing loading states, and error handling.
 */

import { useState, useEffect } from 'react';
import { cagApiService } from '../services/cagApiService';
import type { Client, Contract, OperationalUnit } from '../types/cag.types';

/**
 * Return type for useClientData hook
 */
export interface UseClientDataReturn {
  /** List of all active clients */
  clients: Client[];
  /** List of contracts for the selected client */
  contracts: Contract[];
  /** List of operational units for the selected contract */
  operationalUnits: OperationalUnit[];
  /** Currently selected client ID */
  selectedClient: string;
  /** Currently selected contract internal ID */
  selectedContract: string;
  /** Currently selected operational unit internal ID */
  selectedOperationalUnit: string;
  /** Loading state for clients fetch */
  isLoadingClients: boolean;
  /** Loading state for contracts fetch */
  isLoadingContracts: boolean;
  /** Loading state for operational units fetch */
  isLoadingOUs: boolean;
  /** Error message if any API call fails */
  error: string | null;
  /** Function to update selected client */
  setSelectedClient: (clientId: string) => void;
  /** Function to update selected contract */
  setSelectedContract: (contractId: string) => void;
  /** Function to update selected operational unit */
  setSelectedOperationalUnit: (ouId: string) => void;
}

/**
 * Custom hook for managing client data and cascading selections
 * 
 * @returns UseClientDataReturn object with state and methods
 */
export const useClientData = (): UseClientDataReturn => {
  // State for data lists
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [operationalUnits, setOperationalUnits] = useState<OperationalUnit[]>([]);
  
  // State for selected values
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [selectedOperationalUnit, setSelectedOperationalUnit] = useState('');
  
  // State for loading indicators
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [isLoadingOUs, setIsLoadingOUs] = useState(false);
  
  // State for error handling
  const [error, setError] = useState<string | null>(null);

  // Fetch clients on mount
  useEffect(() => {
    const loadClients = async () => {
      setIsLoadingClients(true);
      setError(null);
      const response = await cagApiService.fetchActiveClients();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setClients(response.data.clientList);
      }
      setIsLoadingClients(false);
    };

    loadClients();
  }, []);

  // Fetch contracts when client changes
  useEffect(() => {
    if (!selectedClient) {
      setContracts([]);
      setSelectedContract('');
      return;
    }

    const loadContracts = async () => {
      setIsLoadingContracts(true);
      setError(null);
      const response = await cagApiService.fetchContracts(selectedClient);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setContracts(response.data.contractList);
      }
      setIsLoadingContracts(false);
    };

    loadContracts();
  }, [selectedClient]);

  // Fetch operational units when contract changes
  useEffect(() => {
    if (!selectedContract) {
      setOperationalUnits([]);
      setSelectedOperationalUnit('');
      return;
    }

    const loadOUs = async () => {
      setIsLoadingOUs(true);
      setError(null);
      const response = await cagApiService.fetchOperationalUnits(selectedContract);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setOperationalUnits(response.data.operationUnitList);
      }
      setIsLoadingOUs(false);
    };

    loadOUs();
  }, [selectedContract]);

  return {
    clients,
    contracts,
    operationalUnits,
    selectedClient,
    selectedContract,
    selectedOperationalUnit,
    isLoadingClients,
    isLoadingContracts,
    isLoadingOUs,
    error,
    setSelectedClient,
    setSelectedContract,
    setSelectedOperationalUnit,
  };
};
