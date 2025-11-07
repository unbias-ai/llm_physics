/**
 * WebGLRenderer Tests
 * Verify Three.js rendering, LOD, and performance metrics
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { WebGLRenderer } from './WebGLRenderer';
import { DeviceProvider } from './DeviceContext';
import { RenderCapability } from '../lib/device-detector';
import * as deviceDetector from '../lib/device-detector';

// Mock device detector
jest.mock('../lib/device-detector', () => ({
  ...jest.requireActual('../lib/device-detector'),
  detectDeviceCapabilities: jest.fn(),
  createPixelRatioListener: jest.fn(() => jest.fn()),
  getAccessibilityMessage: jest.fn(() => '3D visualization enabled'),
}));

// Mock Three.js
jest.mock('three', () => ({
  Scene: jest.fn(() => ({
    add: jest.fn(),
    background: null,
  })),
  PerspectiveCamera: jest.fn(() => ({
    position: { set: jest.fn(), x: 0, y: 0 },
    lookAt: jest.fn(),
  })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    domElement: document.createElement('canvas'),
    dispose: jest.fn(),
    render: jest.fn(),
    info: {
      render: {
        calls: 5,
      },
    },
  })),
  AmbientLight: jest.fn(() => ({})),
  DirectionalLight: jest.fn(() => ({
    position: { set: jest.fn() },
  })),
  SphereGeometry: jest.fn(() => ({
    dispose: jest.fn(),
  })),
  MeshPhongMaterial: jest.fn(() => ({})),
  MeshBasicMaterial: jest.fn(() => ({})),
  Mesh: jest.fn(() => ({})),
  LOD: jest.fn(() => ({
    addLevel: jest.fn(),
    update: jest.fn(),
  })),
  InstancedMesh: jest.fn(() => ({
    setMatrixAt: jest.fn(),
    instanceMatrix: { needsUpdate: false },
    rotation: { y: 0 },
  })),
  Matrix4: jest.fn(() => ({
    setPosition: jest.fn(),
  })),
  Color: jest.fn(),
}));

describe('WebGLRenderer', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame (execute once, then stop)
    global.requestAnimationFrame = jest.fn((cb) => {
      // Call callback once for coverage, then mock to prevent infinite loop
      setTimeout(() => cb(0), 0);
      global.requestAnimationFrame = jest.fn(() => 0) as unknown as typeof requestAnimationFrame;
      return 0;
    }) as unknown as typeof requestAnimationFrame;

    // Mock performance.now
    global.performance.now = jest.fn(() => 0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when WebGL 2 is supported', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 4096,
        devicePixelRatio: 2,
        maxTextureSize: 16384,
        estimatedRAM: 8192,
        supportsInstancing: true,
      });

      render(
        <DeviceProvider>
          <WebGLRenderer />
        </DeviceProvider>
      );

      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('aria-label', '3D physics visualization');
    });

    it('should show fallback message when WebGL 2 not supported', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.CANVAS_2D_FALLBACK,
        webglVersion: 0,
        gpuMemoryMB: 0,
        devicePixelRatio: 1,
        maxTextureSize: 0,
        estimatedRAM: 512,
        supportsInstancing: false,
      });

      render(
        <DeviceProvider>
          <WebGLRenderer />
        </DeviceProvider>
      );

      expect(screen.getByText(/WebGL 2 not supported/i)).toBeInTheDocument();
      expect(screen.getByText(/Canvas 2D fallback/i)).toBeInTheDocument();
    });

    it('should display performance metrics', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 2048,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      });

      render(
        <DeviceProvider>
          <WebGLRenderer />
        </DeviceProvider>
      );

      expect(screen.getByText(/FPS:/)).toBeInTheDocument();
      expect(screen.getByText(/Draw Calls:/)).toBeInTheDocument();
    });

    it('should display device info', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 4096,
        devicePixelRatio: 2,
        maxTextureSize: 16384,
        estimatedRAM: 8192,
        supportsInstancing: true,
      });

      render(
        <DeviceProvider>
          <WebGLRenderer />
        </DeviceProvider>
      );

      expect(screen.getByText(/WebGL 2\.0/)).toBeInTheDocument();
      expect(screen.getByText(/GPU: 4096MB/)).toBeInTheDocument();
    });

    it('should accept custom width and height props', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 2048,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      });

      const { container } = render(
        <DeviceProvider>
          <WebGLRenderer width={1024} height={768} />
        </DeviceProvider>
      );

      // Verify component renders with custom dimensions
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard focusable', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 2048,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      });

      render(
        <DeviceProvider>
          <WebGLRenderer />
        </DeviceProvider>
      );

      const container = screen.getByRole('img');
      expect(container).toHaveAttribute('tabIndex', '0');
    });

    it('should display control instructions', () => {
      (deviceDetector.detectDeviceCapabilities as jest.Mock).mockReturnValue({
        renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
        webglVersion: 2,
        gpuMemoryMB: 2048,
        devicePixelRatio: 1,
        maxTextureSize: 8192,
        estimatedRAM: 4096,
        supportsInstancing: true,
      });

      render(
        <DeviceProvider>
          <WebGLRenderer />
        </DeviceProvider>
      );

      expect(screen.getByText(/Drag to rotate/)).toBeInTheDocument();
      expect(screen.getByText(/Pinch to zoom/)).toBeInTheDocument();
    });
  });
});
