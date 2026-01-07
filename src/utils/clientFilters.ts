import type { Client } from '../types/client';

/**
 * Filters clients by search query.
 * Matches against clientName, clientId, or clientReferenceId (case-insensitive).
 * 
 * Requirements: 2.2
 * 
 * @param clients - Array of clients to filter
 * @param searchQuery - Search string to match against
 * @returns Filtered array of clients matching the search query
 */
export function filterClientsBySearch(clients: Client[], searchQuery: string): Client[] {
  if (!searchQuery || searchQuery.trim() === '') {
    return clients;
  }

  const normalizedQuery = searchQuery.toLowerCase().trim();

  return clients.filter((client) => {
    const clientName = client.clientName.toLowerCase();
    const clientId = client.clientId.toLowerCase();
    const clientReferenceId = client.clientReferenceId.toLowerCase();

    return (
      clientName.includes(normalizedQuery) ||
      clientId.includes(normalizedQuery) ||
      clientReferenceId.includes(normalizedQuery)
    );
  });
}
