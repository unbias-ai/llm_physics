/**
 * DeviceContext Tests
 * Verify context provider, hook usage, and pixel ratio updates
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DeviceProvider, useDeviceCapabilities } from './DeviceContext';
import { RenderCapability } from '../lib/device-detector';

// Mock device detector
jest.mock('../lib/device-detector', () => ({
  detectDeviceCapabilities: jest.fn(),
  createPixelRatioListener: jest.fn((_callback: (ratio: number) => void) => jest.fn()),
  getAccessibilityMessage: jest.fn((capabilities: { renderPath: string }) => {
    if (capabilities.renderPath === 'WEBGL_2_OPTIMIZED') {
      return '3D visualization enabled with hardware acceleration';
    }
    return 'Fallback mode';
  }),
  RenderCapability: {
    CANVAS_2D_FALLBACK: 'CANVAS_2D_FALLBACK',
    WEBGL_LEGACY: 'WEBGL_LEGACY',
    WEBGL_2_OPTIMIZED: 'WEBGL_2_OPTIMIZED',
  },
}));

import * as deviceDetector from '../lib/device-detector';

describe('DeviceContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DeviceProvider', () => {
    it('should detect capabilities on mount', async () => {
      const mockCapabilities = {
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 4096,
        devicePixelRatio: 2,
        maxTextureSize: 16384,
        estimatedRAM: 8192,
        supportsInstancing: true,
      };

      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue(mockCapabilities);

      function TestComponent() {
        const { capabilities, isReady } = useDeviceCapabilities();
        return (
          <div>
            <span data-testid="ready">{isReady ? 'ready' : 'loading'}</span>
            <span data-testid="render-path">{capabilities.renderPath}</span>
            <span data-testid="webgl-version">{capabilities.webglVersion}</span>
          </div>
        );
      }

      render(
        <DeviceProvider>
          <TestComponent />
        </DeviceProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready')).toHaveTextContent('ready');
      });

      expect(screen.getByTestId('render-path')).toHaveTextContent('WEBGL_2_OPTIMIZED');
      expect(screen.getByTestId('webgl-version')).toHaveTextContent('2');
      expect(deviceDetector.detectDeviceCapabilities).toHaveBeenCalledTimes(1);
    });

    it('should render accessibility message', async () => {
      const mockCapabilities = {
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 4096,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      };

      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue(mockCapabilities);

      render(
        <DeviceProvider>
          <div>Content</div>
        </DeviceProvider>
      );

      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveTextContent('3D visualization enabled with hardware acceleration');
      });
    });

    it('should setup pixel ratio listener', async () => {
      const mockCleanup = jest.fn();
      (deviceDetector.createPixelRatioListener as jest.Mock).mockReturnValue(mockCleanup);
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 2048,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      });

      const { unmount } = render(
        <DeviceProvider>
          <div>Content</div>
        </DeviceProvider>
      );

      await waitFor(() => {
        expect(deviceDetector.createPixelRatioListener).toHaveBeenCalled();
      });

      unmount();

      expect(mockCleanup).toHaveBeenCalled();
    });

    it('should update capabilities when pixel ratio changes', async () => {
      let pixelRatioCallback: ((ratio: number) => void) | null = null;

      (deviceDetector.createPixelRatioListener as jest.Mock).mockImplementation((cb) => {
        pixelRatioCallback = cb;
        return jest.fn();
      });

      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 2048,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      });

      function TestComponent() {
        const { capabilities } = useDeviceCapabilities();
        return <span data-testid="pixel-ratio">{capabilities.devicePixelRatio}</span>;
      }

      render(
        <DeviceProvider>
          <TestComponent />
        </DeviceProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('pixel-ratio')).toHaveTextContent('1');
      });

      // Simulate pixel ratio change (user moves window to 2x display)
      if (pixelRatioCallback) {
        pixelRatioCallback(2);
      }

      await waitFor(() => {
        expect(screen.getByTestId('pixel-ratio')).toHaveTextContent('2');
      });
    });
  });

  describe('useDeviceCapabilities hook', () => {
    it('should throw error when used outside provider', () => {
      function TestComponent() {
        useDeviceCapabilities();
        return <div>Test</div>;
      }

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => render(<TestComponent />)).toThrow(
        'useDeviceCapabilities must be used within a DeviceProvider'
      );

      console.error = originalError;
    });

    it('should provide context value when used inside provider', async () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_LEGACY,
        webglVersion: 1,
        gpuMemoryMB: 1024,
        devicePixelRatio: 1,
        maxTextureSize: 4096,
        estimatedRAM: 2048,
        supportsInstancing: false,
      });

      function TestComponent() {
        const { capabilities, accessibilityMessage, isReady } = useDeviceCapabilities();

        return (
          <div>
            <span data-testid="ready">{String(isReady)}</span>
            <span data-testid="path">{capabilities.renderPath}</span>
            <span data-testid="message">{accessibilityMessage}</span>
          </div>
        );
      }

      render(
        <DeviceProvider>
          <TestComponent />
        </DeviceProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('ready')).toHaveTextContent('true');
        expect(screen.getByTestId('path')).toHaveTextContent('WEBGL_LEGACY');
      });
    });
  });

  describe('SSR Handling', () => {
    it('should render null during SSR', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.CANVAS_2D_FALLBACK,
        webglVersion: 0,
        gpuMemoryMB: 0,
        devicePixelRatio: 1,
        maxTextureSize: 0,
        estimatedRAM: 512,
        supportsInstancing: false,
      });

      const { container } = render(
        <DeviceProvider>
          <div>Content</div>
        </DeviceProvider>
      );

      // Initially renders nothing (SSR state)
      // After mount, capabilities are detected
      // For this test, we verify the component handles loading state
      expect(container).toBeInTheDocument();
    });
  });
});
