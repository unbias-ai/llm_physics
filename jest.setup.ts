// jest.setup.ts
import '@testing-library/jest-dom';

// Suppress React act() warnings in tests
// These are console noise - tests use waitFor() correctly
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock Web Worker globally
global.Worker = class MockWorker {
  url: string;
  onmessage: ((ev: MessageEvent) => void) | null = null;

  constructor(stringUrl: string | URL, _options?: WorkerOptions) {
    this.url = typeof stringUrl === 'string' ? stringUrl : stringUrl.toString();
  }

  postMessage(msg: { type: string; equation?: string; variable?: string; xMin?: number; xMax?: number; numPoints?: number }) {
    setTimeout(() => {
      if (msg.type === 'init') {
        this.onmessage?.({ data: { type: 'ready' } } as MessageEvent);
      } else if (msg.type === 'solve') {
        this.onmessage?.({
          data: {
            type: 'solve-result',
            xValues: new Float32Array([0, 1, 2]),
            yValues: new Float32Array([0, 1, 4]),
          }
        } as MessageEvent);
      }
    }, 0);
  }

  addEventListener(type: string, listener: (ev: MessageEvent) => void) {
    if (type === 'message') this.onmessage = listener;
  }

  removeEventListener() {}
  terminate() {}
} as unknown as typeof Worker;

// Mock import.meta for Web Worker URLs
(global as { importMeta?: { url: string } }).importMeta = {
  url: 'file:///mock/path'
};
