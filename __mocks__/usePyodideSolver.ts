/**
 * Mock usePyodideSolver for Jest
 * Avoids import.meta.url issue with Web Workers
 */

import { useState, useCallback } from 'react';

interface SolverState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

interface SolveResult {
  xValues: Float32Array;
  yValues: Float32Array;
}

export function usePyodideSolver() {
  const [state] = useState<SolverState>({
    isReady: true, // Mock as ready immediately
    isLoading: false,
    error: null,
  });

  const solve = useCallback(
    (
      equation: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _variable: string = 'x',
      xMin: number = -10,
      xMax: number = 10,
      numPoints: number = 100
    ): Promise<SolveResult> => {
      return new Promise((resolve) => {
        // Mock solver response
        setTimeout(() => {
          const xValues = new Float32Array(numPoints);
          const yValues = new Float32Array(numPoints);

          for (let i = 0; i < numPoints; i++) {
            const x = xMin + (i / (numPoints - 1)) * (xMax - xMin);
            xValues[i] = x;
            // Simple mock: y = x^2
            yValues[i] = x * x;
          }

          resolve({ xValues, yValues });
        }, 0);
      });
    },
    []
  );

  return {
    isReady: state.isReady,
    isLoading: state.isLoading,
    error: state.error,
    solve,
  };
}
