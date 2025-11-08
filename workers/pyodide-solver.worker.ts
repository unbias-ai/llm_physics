/**
 * Pyodide Solver Web Worker
 * Loads Pyodide once, evaluates equations in background thread
 * Keeps main thread responsive
 */

// Web Worker type safety
// eslint-disable-next-line no-var
declare var self: Worker;

interface SolveRequest {
  type: 'solve';
  equation: string;
  variable: string;
  xMin: number;
  xMax: number;
  numPoints: number;
}

interface InitRequest {
  type: 'init';
}

type WorkerRequest = SolveRequest | InitRequest;

interface SolveResponse {
  type: 'solve-result';
  xValues: Float32Array;
  yValues: Float32Array;
}

interface ErrorResponse {
  type: 'error';
  message: string;
}

interface ReadyResponse {
  type: 'ready';
}

// Pyodide doesn't have official types, using any is acceptable here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;

/**
 * Initialize Pyodide (loads ~3MB WASM, takes 2-3s first time)
 */
async function initPyodide() {
  if (pyodide) return;

  try {
    // @ts-expect-error Pyodide loaded from CDN
    const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs');

    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
    });

    // Load SymPy (required for equation evaluation)
    await pyodide.loadPackage('sympy');
    await pyodide.loadPackage('numpy');

    self.postMessage({ type: 'ready' } as ReadyResponse);
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: `Pyodide init failed: ${error}`,
    } as ErrorResponse);
  }
}

/**
 * Evaluate equation over range using Pyodide + SymPy
 */
async function solveEquation(
  equation: string,
  variable: string,
  xMin: number,
  xMax: number,
  numPoints: number
): Promise<{ xValues: Float32Array; yValues: Float32Array }> {
  if (!pyodide) {
    throw new Error('Pyodide not initialized');
  }

  try {
    // Create Python code to evaluate equation
    const code = `
import numpy as np
from sympy import symbols, lambdify, sympify

# Parse equation
${variable} = symbols('${variable}')
expr = sympify('${equation}')

# Create numpy-compatible function
f = lambdify(${variable}, expr, 'numpy')

# Evaluate over range
x_vals = np.linspace(${xMin}, ${xMax}, ${numPoints})
y_vals = f(x_vals)

# Return as lists (will be converted to typed arrays)
{
  'x': x_vals.tolist(),
  'y': y_vals.tolist() if hasattr(y_vals, 'tolist') else [float(y_vals)] * len(x_vals)
}
`;

    const result = await pyodide.runPythonAsync(code);
    const data = result.toJs();

    // Convert to typed arrays for efficient transfer
    const xValues = new Float32Array(data.get('x'));
    const yValues = new Float32Array(data.get('y'));

    return { xValues, yValues };
  } catch (error) {
    throw new Error(`Equation evaluation failed: ${error}`);
  }
}

/**
 * Message handler
 */
self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;

  try {
    switch (request.type) {
      case 'init':
        await initPyodide();
        break;

      case 'solve': {
        const { equation, variable, xMin, xMax, numPoints } = request;
        const { xValues, yValues } = await solveEquation(
          equation,
          variable,
          xMin,
          xMax,
          numPoints
        );

        // Transfer typed arrays (zero-copy)
        self.postMessage(
          {
            type: 'solve-result',
            xValues,
            yValues,
          } as SolveResponse,
          [xValues.buffer, yValues.buffer]
        );
        break;
      }

      default:
        self.postMessage({
          type: 'error',
          message: 'Unknown request type',
        } as ErrorResponse);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    } as ErrorResponse);
  }
});

// Auto-initialize on worker start
initPyodide();

export type { SolveRequest, InitRequest, SolveResponse, ErrorResponse, ReadyResponse };
