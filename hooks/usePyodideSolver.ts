'use client';

/**
 * usePyodideSolver Hook
 * Manages Pyodide worker lifecycle and equation solving
 */

import { useEffect, useRef, useState, useCallback } from 'react';

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
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<SolverState>({
    isReady: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Create worker on mount
    try {
      const worker = new Worker(new URL('../workers/pyodide-solver.worker.ts', import.meta.url), {
        type: 'module',
      });

      workerRef.current = worker;

      // Listen for ready/error messages
      worker.addEventListener('message', (event) => {
        const data = event.data;

        if (data.type === 'ready') {
          setState({
            isReady: true,
            isLoading: false,
            error: null,
          });
        } else if (data.type === 'error') {
          setState({
            isReady: false,
            isLoading: false,
            error: data.message,
          });
        }
      });

      worker.addEventListener('error', (error) => {
        setState({
          isReady: false,
          isLoading: false,
          error: error.message,
        });
      });

      // Send init message
      worker.postMessage({ type: 'init' });
    } catch (error) {
      // Error state is valid to set synchronously in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        isReady: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Worker creation failed',
      });
    }

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const solve = useCallback(
    (
      equation: string,
      variable: string = 'x',
      xMin: number = -10,
      xMax: number = 10,
      numPoints: number = 100
    ): Promise<SolveResult> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current || !state.isReady) {
          reject(new Error('Solver not ready'));
          return;
        }

        const handleMessage = (event: MessageEvent) => {
          const data = event.data;

          if (data.type === 'solve-result') {
            workerRef.current?.removeEventListener('message', handleMessage);
            resolve({
              xValues: data.xValues,
              yValues: data.yValues,
            });
          } else if (data.type === 'error') {
            workerRef.current?.removeEventListener('message', handleMessage);
            reject(new Error(data.message));
          }
        };

        workerRef.current.addEventListener('message', handleMessage);

        workerRef.current.postMessage({
          type: 'solve',
          equation,
          variable,
          xMin,
          xMax,
          numPoints,
        });
      });
    },
    [state.isReady]
  );

  return {
    isReady: state.isReady,
    isLoading: state.isLoading,
    error: state.error,
    solve,
  };
}
