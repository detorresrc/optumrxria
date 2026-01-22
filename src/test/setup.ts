import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock CSS imports
vi.mock('*.css', () => ({}));
vi.mock('@mui/x-data-grid/esm/index.css', () => ({}));
