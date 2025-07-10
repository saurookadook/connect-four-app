import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const originalLocation = window.location;

const mockLocation = vi.fn(() => {
  return {
    ...originalLocation,
    assign: vi.fn((url) => url),
  };
})();

vi.stubGlobal('location', mockLocation);
