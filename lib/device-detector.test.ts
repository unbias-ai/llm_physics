/**
 * Device Detector Tests
 * Tests three device profiles: low-end, mid-range, flagship
 */

import {
  detectDeviceCapabilities,
  RenderCapability,
  getAccessibilityMessage,
  createPixelRatioListener,
} from './device-detector';

describe('Device Capability Detection', () => {
  let mockCanvas: HTMLCanvasElement;
  let createElementSpy: jest.SpyInstance;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    createElementSpy = jest.spyOn(document, 'createElement');
  });

  afterEach(() => {
    createElementSpy.mockRestore();
  });

  describe('WebGL 2.0 Support (Flagship Device)', () => {
    beforeEach(() => {
      // Mock flagship device: WebGL 2, 4GB GPU, high-res screen
      const mockGL2 = {
        getParameter: jest.fn((param: number) => {
          if (param === 3379) return 16384; // MAX_TEXTURE_SIZE
          return null;
        }),
        getExtension: jest.fn((name: string) => {
          if (name === 'WEBGL_debug_renderer_info') {
            return {
              UNMASKED_RENDERER_WEBGL: 37446,
            };
          }
          return null;
        }),
      } as unknown as WebGL2RenderingContext;

      jest.spyOn(mockCanvas, 'getContext').mockImplementation((contextId: string) => {
        if (contextId === 'webgl2') return mockGL2;
        return null;
      });

      createElementSpy.mockReturnValue(mockCanvas);

      // Mock high-DPI screen
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 2,
      });
    });

    it('should detect WebGL 2 optimized path', () => {
      const capabilities = detectDeviceCapabilities();

      expect(capabilities.renderPath).toBe(RenderCapability.WEBGL_2_OPTIMIZED);
      expect(capabilities.webglVersion).toBe(2);
      expect(capabilities.supportsInstancing).toBe(true);
      expect(capabilities.maxTextureSize).toBeGreaterThan(0);
    });

    it('should report correct device pixel ratio', () => {
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.devicePixelRatio).toBe(2);
    });

    it('should provide optimized accessibility message', () => {
      const capabilities = detectDeviceCapabilities();
      const message = getAccessibilityMessage(capabilities);
      expect(message).toContain('hardware acceleration');
      expect(message).toContain('3D visualization enabled');
    });
  });

  describe('WebGL 1.0 Support (Mid-Range Device)', () => {
    beforeEach(() => {
      // Mock mid-range device: WebGL 1 only, 2GB GPU, standard screen
      const mockGL1 = {
        getParameter: jest.fn((param: number) => {
          if (param === 3379) return 8192; // MAX_TEXTURE_SIZE
          return null;
        }),
        getExtension: jest.fn((name: string) => {
          if (name === 'WEBGL_debug_renderer_info') {
            return {
              UNMASKED_RENDERER_WEBGL: 37446,
            };
          }
          if (name === 'ANGLE_instanced_arrays') {
            return {}; // Instancing supported via extension
          }
          return null;
        }),
      } as unknown as WebGLRenderingContext;

      jest.spyOn(mockCanvas, 'getContext').mockImplementation((contextId: string) => {
        if (contextId === 'webgl2') return null; // No WebGL 2
        if (contextId === 'webgl' || contextId === 'experimental-webgl') {
          return mockGL1;
        }
        return null;
      });

      createElementSpy.mockReturnValue(mockCanvas);

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 1,
      });
    });

    it('should detect WebGL legacy path', () => {
      const capabilities = detectDeviceCapabilities();

      expect(capabilities.renderPath).toBe(RenderCapability.WEBGL_LEGACY);
      expect(capabilities.webglVersion).toBe(1);
      expect(capabilities.maxTextureSize).toBe(8192);
    });

    it('should detect instancing via extension', () => {
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.supportsInstancing).toBe(true);
    });

    it('should provide legacy WebGL accessibility message', () => {
      const capabilities = detectDeviceCapabilities();
      const message = getAccessibilityMessage(capabilities);
      expect(message).toContain('basic hardware acceleration');
    });
  });

  describe('Canvas 2D Fallback (Low-End Device)', () => {
    beforeEach(() => {
      // Mock low-end device: no WebGL, 512MB RAM, low-res screen
      jest.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      createElementSpy.mockReturnValue(mockCanvas);

      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: 1,
      });
    });

    it('should fallback to Canvas 2D', () => {
      const capabilities = detectDeviceCapabilities();

      expect(capabilities.renderPath).toBe(RenderCapability.CANVAS_2D_FALLBACK);
      expect(capabilities.webglVersion).toBe(0);
      expect(capabilities.gpuMemoryMB).toBe(0);
      expect(capabilities.supportsInstancing).toBe(false);
    });

    it('should provide fallback accessibility message', () => {
      const capabilities = detectDeviceCapabilities();
      const message = getAccessibilityMessage(capabilities);
      expect(message).toContain('3D visualization disabled');
      expect(message).toContain('interactive mathematics');
    });

    it('should still report device pixel ratio', () => {
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.devicePixelRatio).toBe(1);
    });
  });

  describe('Device Pixel Ratio Listener', () => {
    it('should create listener for pixel ratio changes', () => {
      const callback = jest.fn();
      const matchMediaMock = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as MediaQueryList;

      jest.spyOn(window, 'matchMedia').mockReturnValue(matchMediaMock);

      const cleanup = createPixelRatioListener(callback);

      expect(window.matchMedia).toHaveBeenCalled();
      expect(matchMediaMock.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      cleanup();

      expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should handle SSR gracefully', () => {
      const originalWindow = global.window;
      // @ts-expect-error Testing SSR
      delete global.window;

      const callback = jest.fn();
      const cleanup = createPixelRatioListener(callback);

      expect(cleanup).toBeInstanceOf(Function);
      expect(() => cleanup()).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('SSR Compatibility', () => {
    it('should handle missing window in SSR', () => {
      const originalWindow = global.window;
      const originalDocument = global.document;

      // @ts-expect-error Testing SSR
      delete global.window;
      // @ts-expect-error Testing SSR
      delete global.document;

      const capabilities = detectDeviceCapabilities();

      expect(capabilities.renderPath).toBe(RenderCapability.CANVAS_2D_FALLBACK);
      expect(capabilities.devicePixelRatio).toBe(1);

      global.window = originalWindow;
      global.document = originalDocument;
    });
  });

  describe('Edge Cases', () => {
    it('should handle null WebGL context gracefully', () => {
      jest.spyOn(mockCanvas, 'getContext').mockReturnValue(null);
      createElementSpy.mockReturnValue(mockCanvas);

      expect(() => detectDeviceCapabilities()).not.toThrow();
    });

    it('should handle missing GPU memory extension', () => {
      const mockGL2 = {
        getParameter: jest.fn(() => 8192),
        getExtension: jest.fn(() => null), // No extensions
      } as unknown as WebGL2RenderingContext;

      jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockGL2);
      createElementSpy.mockReturnValue(mockCanvas);

      const capabilities = detectDeviceCapabilities();
      expect(capabilities.gpuMemoryMB).toBeGreaterThan(0); // Should use fallback
    });
  });

  describe('GPU Vendor Detection', () => {
    it('should detect NVIDIA GPU', () => {
      const mockGL2 = {
        getParameter: jest.fn((param: number) => {
          if (param === 3379) return 16384;
          if (param === 37446) return 'NVIDIA GeForce RTX 3080';
          return null;
        }),
        getExtension: jest.fn((name: string) => {
          if (name === 'WEBGL_debug_renderer_info') {
            return { UNMASKED_RENDERER_WEBGL: 37446 };
          }
          return null;
        }),
      } as unknown as WebGL2RenderingContext;

      jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockGL2);
      createElementSpy.mockReturnValue(mockCanvas);

      const capabilities = detectDeviceCapabilities();
      expect(capabilities.gpuMemoryMB).toBeGreaterThan(2048);
    });

    it('should detect mobile Mali GPU', () => {
      const mockGL1 = {
        getParameter: jest.fn((param: number) => {
          if (param === 3379) return 4096;
          if (param === 37446) return 'Mali-G76 MP12';
          return null;
        }),
        getExtension: jest.fn((name: string) => {
          if (name === 'WEBGL_debug_renderer_info') {
            return { UNMASKED_RENDERER_WEBGL: 37446 };
          }
          return {};
        }),
      } as unknown as WebGLRenderingContext;

      jest.spyOn(mockCanvas, 'getContext').mockImplementation((contextId: string) => {
        if (contextId === 'webgl2') return null;
        if (contextId === 'webgl') return mockGL1;
        return null;
      });
      createElementSpy.mockReturnValue(mockCanvas);

      const capabilities = detectDeviceCapabilities();
      expect(capabilities.gpuMemoryMB).toBeLessThan(2048); // Mobile GPU
    });
  });
});
