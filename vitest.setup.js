import { vi } from 'vitest';

const IntersectionObserverMock = vi.fn(
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  },
);

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
