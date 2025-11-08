/**
 * Web Worker Mock for Jest
 * Fixes: import.meta.url issues in tests
 */

export class MockWorker implements Worker {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;
  onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null = null;
  onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null = null;

  private listeners: Map<string, Set<EventListenerOrEventListenerObject>> = new Map();

  constructor(stringUrl: string | URL, options?: WorkerOptions) {
    // Mock constructor - don't actually create worker in tests
  }

  postMessage(message: any): void {
    // Simulate worker response
    if (message.type === 'init') {
      setTimeout(() => {
        this.onmessage?.({
          data: { type: 'ready' },
        } as MessageEvent);
      }, 0);
    } else if (message.type === 'solve') {
      setTimeout(() => {
        this.onmessage?.({
          data: {
            type: 'solve-result',
            xValues: new Float32Array([0, 1, 2]),
            yValues: new Float32Array([0, 1, 4]),
          },
        } as MessageEvent);
      }, 0);
    }
  }

  terminate(): void {
    // Mock termination
  }

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        if (typeof listener === 'function') {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      });
      return true;
    }
    return false;
  }
}

// Replace global Worker in Jest
if (typeof global !== 'undefined') {
  (global as any).Worker = MockWorker;
}

export default MockWorker;
