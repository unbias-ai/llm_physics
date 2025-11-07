/**
 * WebGL Mock for JSDOM
 * Three.js + device-detector require WebGL context
 */

// Mock WebGL2RenderingContext
class WebGL2RenderingContextMock {
  canvas = document.createElement('canvas');
  drawingBufferWidth = 1024;
  drawingBufferHeight = 768;

  // WebGL constants
  VENDOR = 0x1f00;
  RENDERER = 0x1f01;
  VERSION = 0x1f02;
  MAX_TEXTURE_SIZE = 0x0d33;
  MAX_VERTEX_ATTRIBS = 0x8869;

  getParameter(pname: number): unknown {
    const params: Record<number, unknown> = {
      0x1f00: 'WebKit', // VENDOR
      0x1f01: 'NVIDIA GeForce RTX 3080', // RENDERER
      0x1f02: 'WebGL 2.0', // VERSION
      0x0d33: 16384, // MAX_TEXTURE_SIZE
      0x8869: 16, // MAX_VERTEX_ATTRIBS
      37446: 'NVIDIA GeForce RTX 3080', // UNMASKED_RENDERER_WEBGL (0x9246)
    };
    return params[pname] || 0;
  }

  getExtension(name: string): unknown {
    if (name === 'WEBGL_debug_renderer_info') {
      return { UNMASKED_RENDERER_WEBGL: 0x1f01 };
    }
    if (name === 'ANGLE_instanced_arrays') {
      return {}; // Instancing support
    }
    return null;
  }

  createShader = jest.fn(() => ({}));
  shaderSource = jest.fn();
  compileShader = jest.fn();
  getShaderParameter = jest.fn(() => true);
  getShaderInfoLog = jest.fn(() => '');
  deleteShader = jest.fn();
  createProgram = jest.fn(() => ({}));
  attachShader = jest.fn();
  linkProgram = jest.fn();
  getProgramParameter = jest.fn(() => true);
  useProgram = jest.fn();
  createBuffer = jest.fn(() => ({}));
  bindBuffer = jest.fn();
  bufferData = jest.fn();
  enableVertexAttribArray = jest.fn();
  vertexAttribPointer = jest.fn();
  drawArrays = jest.fn();
  clear = jest.fn();
  clearColor = jest.fn();
  enable = jest.fn();
  viewport = jest.fn();
  getUniformLocation = jest.fn(() => ({}));
  uniformMatrix4fv = jest.fn();
}

// Mock Canvas.getContext
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
  contextType: string,
  contextAttributes?: unknown
): unknown {
  // SSR: If window or document are deleted from global, return null
  if (!(global as Record<string, unknown>).window || !(global as Record<string, unknown>).document) {
    return null;
  }

  if (contextType === 'webgl2') {
    return new WebGL2RenderingContextMock();
  }
  if (contextType === 'webgl' || contextType === 'experimental-webgl') {
    return new WebGL2RenderingContextMock(); // Use same mock
  }
  if (contextType === '2d') {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn((w: number, h: number) => ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    };
  }
  return originalGetContext.call(this, contextType, contextAttributes);
};

// Mock requestAnimationFrame
global.requestAnimationFrame = ((cb: FrameRequestCallback) => {
  setTimeout(cb, 16);
  return 0;
}) as unknown as typeof requestAnimationFrame;

global.cancelAnimationFrame = ((id: number) => clearTimeout(id)) as unknown as typeof cancelAnimationFrame;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
} as unknown as typeof ResizeObserver;

// Mock window.matchMedia for device pixel ratio
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

export {};
