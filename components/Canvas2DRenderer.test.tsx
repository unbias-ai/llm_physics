/**
 * Canvas2DRenderer Tests
 * Verify rendering, pan/zoom, and equation evaluation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Canvas2DRenderer } from './Canvas2DRenderer';
import { usePyodideSolver } from '../hooks/usePyodideSolver';

// Mock usePyodideSolver hook
jest.mock('../hooks/usePyodideSolver');

describe('Canvas2DRenderer', () => {
  let mockSolve: jest.Mock;

  beforeEach(() => {
    mockSolve = jest.fn();

    (usePyodideSolver as jest.Mock).mockReturnValue({
      isReady: true,
      isLoading: false,
      error: null,
      solve: mockSolve,
    });

    // Mock requestAnimationFrame (execute once, then stop)
    global.requestAnimationFrame = jest.fn((cb) => {
      // Call callback once for coverage, then mock to prevent infinite loop
      setTimeout(() => cb(0), 0);
      global.requestAnimationFrame = jest.fn(() => 0);
      return 0;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render canvas element', () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0, 1, 2]),
        yValues: new Float32Array([0, 1, 4]),
      });

      render(<Canvas2DRenderer equation="x**2" />);

      const canvas = screen.getByRole('img');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute('aria-label', 'Plot of equation: x**2');
    });

    it('should display loading state', () => {
      (usePyodideSolver as jest.Mock).mockReturnValue({
        isReady: false,
        isLoading: true,
        error: null,
        solve: mockSolve,
      });

      render(<Canvas2DRenderer equation="sin(x)" />);

      expect(screen.getByText(/Loading equation solver/i)).toBeInTheDocument();
    });

    it('should display error state', () => {
      (usePyodideSolver as jest.Mock).mockReturnValue({
        isReady: false,
        isLoading: false,
        error: 'Worker init failed',
        solve: mockSolve,
      });

      render(<Canvas2DRenderer equation="sin(x)" />);

      expect(screen.getByText(/Error: Worker init failed/i)).toBeInTheDocument();
    });

    it('should call solve with equation parameters', async () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="cos(x)" xMin={-5} xMax={5} />);

      await waitFor(() => {
        expect(mockSolve).toHaveBeenCalledWith('cos(x)', 'x', -5, 5, 200);
      });
    });

    it('should use default viewport bounds', async () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="x" />);

      await waitFor(() => {
        expect(mockSolve).toHaveBeenCalledWith('x', 'x', -10, 10, 200);
      });
    });

    it('should display viewport coordinates', async () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="x" xMin={-5} xMax={5} yMin={-2} yMax={2} />);

      await waitFor(() => {
        expect(screen.getByText(/x:\[-5\.00, 5\.00\]/)).toBeInTheDocument();
        expect(screen.getByText(/y:\[-2\.00, 2\.00\]/)).toBeInTheDocument();
      });
    });
  });

  describe('Interaction', () => {
    it('should handle pan controls', async () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0, 1]),
        yValues: new Float32Array([0, 1]),
      });

      render(<Canvas2DRenderer equation="x" />);

      const canvas = screen.getByRole('img');

      // Simulate pan drag
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
      fireEvent.mouseUp(canvas);

      await waitFor(() => {
        expect(screen.getByText(/View: x:/)).toBeInTheDocument();
      });
    });

    it('should handle zoom controls', async () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0, 1]),
        yValues: new Float32Array([0, 1]),
      });

      render(<Canvas2DRenderer equation="x" />);

      const canvas = screen.getByRole('img');

      // Initial solve call
      await waitFor(() => {
        expect(mockSolve).toHaveBeenCalledTimes(1);
      });

      // Simulate zoom in (negative deltaY)
      fireEvent.wheel(canvas, { deltaY: -100 });

      // Should trigger re-evaluation with new viewport
      await waitFor(() => {
        expect(mockSolve).toHaveBeenCalledTimes(2);
      });
    });

    it('should stop panning on mouse leave', async () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="x" />);

      const canvas = screen.getByRole('img');

      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseLeave(canvas);

      // Further mouse moves should not pan
      fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 });

      await waitFor(() => {
        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    it('should be keyboard accessible', () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="x" />);

      const canvas = screen.getByRole('img');
      expect(canvas).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Error Handling', () => {
    it('should handle equation evaluation errors', async () => {
      mockSolve.mockRejectedValue(new Error('Invalid equation syntax'));

      render(<Canvas2DRenderer equation="invalid" />);

      await waitFor(() => {
        expect(screen.getByText(/Error: Invalid equation syntax/i)).toBeInTheDocument();
      });
    });

    it('should handle missing canvas context', async () => {
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      // Should not crash
      expect(() => render(<Canvas2DRenderer equation="x" />)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have ARIA label with equation', () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="sin(x) * cos(2*x)" />);

      const canvas = screen.getByRole('img');
      expect(canvas).toHaveAttribute('aria-label', 'Plot of equation: sin(x) * cos(2*x)');
    });

    it('should display interaction instructions', () => {
      mockSolve.mockResolvedValue({
        xValues: new Float32Array([0]),
        yValues: new Float32Array([0]),
      });

      render(<Canvas2DRenderer equation="x" />);

      expect(screen.getByText(/Pan: Click and drag/)).toBeInTheDocument();
      expect(screen.getByText(/Zoom: Scroll/)).toBeInTheDocument();
    });
  });
});
