import type { AddClientCombinedFormData } from '../schemas/addClientSchema';

// Storage key for draft data
const DRAFT_STORAGE_KEY = 'addClient_draft';

// Helper functions for localStorage persistence
export const saveDraftToStorage = (data: AddClientCombinedFormData): void => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft to localStorage:', error);
  }
};

export const loadDraftFromStorage = (): AddClientCombinedFormData | null => {
  try {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AddClientCombinedFormData;
    }
  } catch (error) {
    console.error('Failed to load draft from localStorage:', error);
  }
  return null;
};

export const clearDraftFromStorage = (): void => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear draft from localStorage:', error);
  }
};
