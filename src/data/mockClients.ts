/**
 * Mock client data for the Client List Page
 * Requirements: 3.1
 */

import type { Client, ClientStatus } from '../types/client';

const clientNames = [
  'Acme Corporation',
  'Global Health Systems',
  'United Medical Group',
  'Premier Healthcare',
  'Wellness Partners',
  'MedCare Solutions',
  'HealthFirst Network',
  'Community Health Alliance',
  'Pacific Medical Center',
  'Atlantic Healthcare',
  'Midwest Health Services',
  'Southern Medical Associates',
  'Northern Health Partners',
  'Eastern Care Network',
  'Western Medical Group',
  'Central Health Systems',
  'Regional Care Partners',
  'National Health Alliance',
  'Metro Medical Services',
  'Valley Healthcare Group',
  'Mountain Health Network',
  'Coastal Care Systems',
  'Lakeside Medical Partners',
  'Riverside Health Services',
  'Sunrise Healthcare',
  'Sunset Medical Group',
  'Horizon Health Partners',
  'Summit Care Network',
  'Pinnacle Health Systems',
  'Foundation Medical Group',
  'Legacy Healthcare Partners',
  'Heritage Health Services',
  'Landmark Medical Center',
  'Beacon Health Network',
  'Compass Care Systems',
  'Anchor Medical Partners',
  'Bridge Health Services',
  'Gateway Healthcare Group',
  'Keystone Medical Network',
  'Cornerstone Health Partners',
  'Milestone Care Systems',
  'Pathway Medical Services',
  'Trailblazer Healthcare',
  'Pioneer Health Network',
  'Frontier Medical Group',
  'Discovery Health Partners',
  'Innovation Care Systems',
  'Excellence Medical Services',
  'Quality Healthcare Group',
  'Integrity Health Network',
];

const statuses: ClientStatus[] = ['Complete', 'Draft', 'Pending', 'Inactive'];

/**
 * Generates a random date within the past 2 years
 */
function generateRandomDate(): string {
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  const date = new Date(randomTime);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

/**
 * Generates a client ID in format CXXXXXX
 */
function generateClientId(index: number): string {
  return `C${String(100000 + index).padStart(6, '0')}`;
}

/**
 * Generates a client reference ID in format REF-XXXX
 */
function generateReferenceId(index: number): string {
  return `REF-${String(1000 + index).padStart(4, '0')}`;
}

/**
 * Mock client data array with 50+ clients for pagination testing
 */
export const mockClients: Client[] = clientNames.map((name, index) => ({
  id: `client-${index + 1}`,
  clientName: name,
  clientId: generateClientId(index),
  status: statuses[index % statuses.length],
  clientReferenceId: generateReferenceId(index),
  effectiveDate: generateRandomDate(),
  operationalUnitsCount: Math.floor(Math.random() * 20) + 1,
}));

/** Total number of mock clients */
export const totalMockClients = mockClients.length;
