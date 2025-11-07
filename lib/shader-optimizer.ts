/**
 * Shader Optimizer
 * Validates and optimizes GLSL shaders for mobile devices
 */

export interface ShaderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ShaderOptimizationSuggestions {
  conditionalReplacements: string[];
  precisionIssues: string[];
  performanceWarnings: string[];
}

/**
 * Validate shader code for mobile compatibility
 */
export function validateShader(shaderCode: string, type: 'vertex' | 'fragment'): ShaderValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for if-statements in fragment shader (performance issue on mobile)
  if (type === 'fragment') {
    const ifStatements = shaderCode.match(/\bif\s*\(/g);
    if (ifStatements && ifStatements.length > 0) {
      warnings.push(
        `Found ${ifStatements.length} if-statement(s) in fragment shader. Consider using step() or mix() for better mobile performance.`
      );
    }
  }

  // Check precision qualifiers
  const hasHighp = /precision\s+highp/.test(shaderCode);
  const hasMediump = /precision\s+mediump/.test(shaderCode);

  if (!hasHighp && !hasMediump) {
    errors.push('Missing precision qualifier. Add "precision highp float;" or "precision mediump float;"');
  }

  // Check for expensive operations in fragment shader
  if (type === 'fragment') {
    const expensiveOps = [
      { pattern: /\bpow\s*\(/g, name: 'pow()' },
      { pattern: /\bexp\s*\(/g, name: 'exp()' },
      { pattern: /\blog\s*\(/g, name: 'log()' },
      { pattern: /\bsin\s*\(/g, name: 'sin()' },
      { pattern: /\bcos\s*\(/g, name: 'cos()' },
    ];

    for (const { pattern, name } of expensiveOps) {
      const matches = shaderCode.match(pattern);
      if (matches && matches.length > 2) {
        warnings.push(
          `Multiple ${name} operations in fragment shader (${matches.length} occurrences). Consider pre-computing in vertex shader.`
        );
      }
    }
  }

  // Check for loops (can be expensive on mobile)
  const forLoops = shaderCode.match(/\bfor\s*\(/g);
  if (forLoops && forLoops.length > 0) {
    warnings.push(
      `Found ${forLoops.length} for-loop(s). Ensure loop bounds are constants for mobile GPU compatibility.`
    );
  }

  // Verify precision on position calculations (vertex shader)
  if (type === 'vertex') {
    const positionCalc = /gl_Position\s*=/;
    if (positionCalc.test(shaderCode) && !hasHighp) {
      errors.push(
        'gl_Position calculations require "precision highp float;" for accurate rendering on all devices.'
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Suggest optimizations for shader code
 */
export function suggestOptimizations(shaderCode: string): ShaderOptimizationSuggestions {
  const conditionalReplacements: string[] = [];
  const precisionIssues: string[] = [];
  const performanceWarnings: string[] = [];

  // Find if-statements that can be replaced with step()
  const ifPattern = /if\s*\(\s*(\w+)\s*([<>]=?)\s*([\d.]+)\s*\)/g;
  let match;

  while ((match = ifPattern.exec(shaderCode)) !== null) {
    const [fullMatch, variable, operator, threshold] = match;
    let suggestion = '';

    if (operator === '>') {
      suggestion = `Replace "${fullMatch}" with "float result = step(${threshold}, ${variable});"`;
    } else if (operator === '<') {
      suggestion = `Replace "${fullMatch}" with "float result = step(${variable}, ${threshold});"`;
    }

    if (suggestion) {
      conditionalReplacements.push(suggestion);
    }
  }

  // Check precision on color calculations
  if (/vec[34]\s+\w+\s*=.*\*.*\//.test(shaderCode)) {
    if (!/precision\s+mediump/.test(shaderCode)) {
      precisionIssues.push(
        'Color calculations detected. Use "precision mediump float;" for colors to save bandwidth on mobile.'
      );
    }
  }

  // Check for large uniform arrays (expensive on mobile)
  const uniformArrays = shaderCode.match(/uniform\s+\w+\s+\w+\[\s*(\d+)\s*\]/g);
  if (uniformArrays) {
    for (const array of uniformArrays) {
      const sizeMatch = array.match(/\[\s*(\d+)\s*\]/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1], 10);
        if (size > 16) {
          performanceWarnings.push(
            `Large uniform array detected: ${array}. Consider using textures instead for mobile.`
          );
        }
      }
    }
  }

  return {
    conditionalReplacements,
    precisionIssues,
    performanceWarnings,
  };
}

/**
 * Optimize shader for mobile (auto-apply safe optimizations)
 */
export function optimizeShader(shaderCode: string, type: 'vertex' | 'fragment'): string {
  let optimized = shaderCode;

  // Ensure precision qualifier exists
  if (!/precision\s+(highp|mediump)/.test(optimized)) {
    const precision = type === 'vertex' ? 'highp' : 'mediump';
    optimized = `precision ${precision} float;\n\n${optimized}`;
  }

  // Replace simple if-statements with step (safe optimization)
  // Example: if (x > 0.5) y = 1.0; else y = 0.0;
  // Becomes: y = step(0.5, x);

  const simpleIfElse = /if\s*\(\s*(\w+)\s*>\s*([\d.]+)\s*\)\s*(\w+)\s*=\s*([\d.]+)\s*;\s*else\s*\3\s*=\s*([\d.]+)\s*;/g;

  optimized = optimized.replace(simpleIfElse, (match, variable, threshold, target, trueVal, falseVal) => {
    // step(threshold, variable) returns 0 if variable < threshold, 1 if variable >= threshold
    // mix(falseVal, trueVal, step(threshold, variable))
    return `${target} = mix(${falseVal}, ${trueVal}, step(${threshold}, ${variable}));`;
  });

  return optimized;
}

/**
 * Check if WebGL context supports shader compilation
 */
export function testShaderCompilation(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  shaderCode: string,
  type: 'vertex' | 'fragment'
): { success: boolean; error: string | null } {
  const shaderType = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
  const shader = gl.createShader(shaderType);

  if (!shader) {
    return { success: false, error: 'Failed to create shader object' };
  }

  gl.shaderSource(shader, shaderCode);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  const error = success ? null : gl.getShaderInfoLog(shader);

  gl.deleteShader(shader);

  return { success: Boolean(success), error };
}
