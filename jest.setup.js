// jest.setup.js
require('@testing-library/jest-dom');

// Mock Web Worker globally
global.Worker = class MockWorker {
  constructor(stringUrl, options) {
    this.url = stringUrl;
    this.onmessage = null;
  }

  postMessage(msg) {
    setTimeout(() => {
      if (msg.type === 'init') {
        this.onmessage?.({ data: { type: 'ready' } });
      } else if (msg.type === 'solve') {
        this.onmessage?.({
          data: {
            type: 'solve-result',
            xValues: new Float32Array([0, 1, 2]),
            yValues: new Float32Array([0, 1, 4]),
          }
        });
      }
    }, 0);
  }

  addEventListener(type, listener) {
    if (type === 'message') this.onmessage = listener;
  }

  removeEventListener() {}
  terminate() {}
};

// Mock import.meta for Web Worker URLs
global.importMeta = {
  url: 'file:///mock/path'
};
