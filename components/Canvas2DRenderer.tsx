'use client';

/**
 * Canvas2DRenderer
 * 2D plot renderer with pan/zoom for devices without WebGL
 * Uses Pyodide for equation evaluation
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePyodideSolver } from '../hooks/usePyodideSolver';

interface Canvas2DRendererProps {
  equation: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  width?: number;
  height?: number;
}

export function Canvas2DRenderer({
  equation,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  width = 800,
  height = 600,
}: Canvas2DRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isReady, isLoading, error, solve } = usePyodideSolver();
  const [plotData, setPlotData] = useState<{
    xValues: Float32Array;
    yValues: Float32Array;
  } | null>(null);

  // Viewport state for pan/zoom
  const [viewport, setViewport] = useState({
    xMin,
    xMax,
    yMin,
    yMax,
    panStartX: 0,
    panStartY: 0,
    isPanning: false,
  });

  const [renderError, setRenderError] = useState<string | null>(null);

  // Evaluate equation when ready or equation changes
  useEffect(() => {
    if (!isReady || !equation) return;

    const evaluateEquation = async () => {
      try {
        setRenderError(null);
        const result = await solve(equation, 'x', viewport.xMin, viewport.xMax, 200);
        setPlotData(result);
      } catch (err) {
        setRenderError(err instanceof Error ? err.message : 'Evaluation failed');
      }
    };

    evaluateEquation();
  }, [isReady, equation, viewport.xMin, viewport.xMax, solve]);

  // Render plot on canvas
  useEffect(() => {
    if (!plotData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Request animation frame for smooth rendering
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a'; // Dark background
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      drawGrid(ctx, viewport, width, height);

      // Draw axes
      drawAxes(ctx, viewport, width, height);

      // Draw plot
      drawPlot(ctx, plotData, viewport, width, height);
    };

    requestAnimationFrame(render);
  }, [plotData, viewport, width, height]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setViewport((prev) => ({
      ...prev,
      isPanning: true,
      panStartX: e.clientX,
      panStartY: e.clientY,
    }));
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!viewport.isPanning) return;

      const dx = e.clientX - viewport.panStartX;
      const dy = e.clientY - viewport.panStartY;

      const xRange = viewport.xMax - viewport.xMin;
      const yRange = viewport.yMax - viewport.yMin;

      const xShift = -(dx / width) * xRange;
      const yShift = (dy / height) * yRange;

      setViewport((prev) => ({
        ...prev,
        xMin: prev.xMin + xShift,
        xMax: prev.xMax + xShift,
        yMin: prev.yMin + yShift,
        yMax: prev.yMax + yShift,
        panStartX: e.clientX,
        panStartY: e.clientY,
      }));
    },
    [viewport, width, height]
  );

  const handleMouseUp = useCallback(() => {
    setViewport((prev) => ({ ...prev, isPanning: false }));
  }, []);

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

    setViewport((prev) => {
      const xRange = prev.xMax - prev.xMin;
      const yRange = prev.yMax - prev.yMin;

      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;

      const newXRange = xRange * zoomFactor;
      const newYRange = yRange * zoomFactor;

      return {
        ...prev,
        xMin: xCenter - newXRange / 2,
        xMax: xCenter + newXRange / 2,
        yMin: yCenter - newYRange / 2,
        yMax: yCenter + newYRange / 2,
      };
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <p className="text-gray-400">Loading equation solver...</p>
      </div>
    );
  }

  if (error || renderError) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <p className="text-red-400">Error: {error || renderError}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="border border-gray-700 cursor-move"
        role="img"
        aria-label={`Plot of equation: ${equation}`}
        tabIndex={0}
      />
      <div className="mt-2 text-sm text-gray-400">
        <p>Pan: Click and drag | Zoom: Scroll</p>
        <p>
          View: x:[{viewport.xMin.toFixed(2)}, {viewport.xMax.toFixed(2)}] y:[
          {viewport.yMin.toFixed(2)}, {viewport.yMax.toFixed(2)}]
        </p>
      </div>
    </div>
  );
}

/**
 * Draw grid lines
 */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number },
  width: number,
  height: number
) {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;

  // Vertical grid lines
  for (let i = 0; i <= 10; i++) {
    const x = (i / 10) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let i = 0; i <= 10; i++) {
    const y = (i / 10) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/**
 * Draw x and y axes
 */
function drawAxes(
  ctx: CanvasRenderingContext2D,
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number },
  width: number,
  height: number
) {
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;

  const xRange = viewport.xMax - viewport.xMin;
  const yRange = viewport.yMax - viewport.yMin;

  // Y-axis (x = 0)
  if (viewport.xMin <= 0 && viewport.xMax >= 0) {
    const xPos = ((0 - viewport.xMin) / xRange) * width;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, height);
    ctx.stroke();
  }

  // X-axis (y = 0)
  if (viewport.yMin <= 0 && viewport.yMax >= 0) {
    const yPos = ((viewport.yMax - 0) / yRange) * height;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(width, yPos);
    ctx.stroke();
  }
}

/**
 * Draw plot line
 */
function drawPlot(
  ctx: CanvasRenderingContext2D,
  plotData: { xValues: Float32Array; yValues: Float32Array },
  viewport: { xMin: number; xMax: number; yMin: number; yMax: number },
  width: number,
  height: number
) {
  ctx.strokeStyle = '#00ffff'; // Cyan plot line
  ctx.lineWidth = 2;

  const xRange = viewport.xMax - viewport.xMin;
  const yRange = viewport.yMax - viewport.yMin;

  ctx.beginPath();

  for (let i = 0; i < plotData.xValues.length; i++) {
    const x = plotData.xValues[i];
    const y = plotData.yValues[i];

    const canvasX = ((x - viewport.xMin) / xRange) * width;
    const canvasY = ((viewport.yMax - y) / yRange) * height;

    if (i === 0) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }

  ctx.stroke();
}
