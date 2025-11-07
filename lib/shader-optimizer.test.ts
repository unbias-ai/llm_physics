/**
 * Shader Optimizer Tests
 * Verify validation, optimization suggestions, and shader compilation
 */

import {
  validateShader,
  suggestOptimizations,
  optimizeShader,
  testShaderCompilation,
} from './shader-optimizer';

describe('Shader Optimizer', () => {
  describe('validateShader', () => {
    it('should pass valid vertex shader', () => {
      const shader = `
        precision highp float;
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        void main() {
          gl_Position = modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const result = validateShader(shader, 'vertex');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass valid fragment shader', () => {
      const shader = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `;

      const result = validateShader(shader, 'fragment');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should error on missing precision qualifier', () => {
      const shader = `
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `;

      const result = validateShader(shader, 'fragment');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('precision'));
    });

    it('should warn about if-statements in fragment shader', () => {
      const shader = `
        precision mediump float;
        varying float value;
        void main() {
          if (value > 0.5) {
            gl_FragColor = vec4(1.0);
          } else {
            gl_FragColor = vec4(0.0);
          }
        }
      `;

      const result = validateShader(shader, 'fragment');
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('if-statement');
      expect(result.warnings[0]).toContain('step()');
    });

    it('should error on mediump precision for gl_Position', () => {
      const shader = `
        precision mediump float;
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      const result = validateShader(shader, 'vertex');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('gl_Position');
      expect(result.errors[0]).toContain('highp');
    });

    it('should warn about expensive operations in fragment shader', () => {
      const shader = `
        precision mediump float;
        varying vec2 uv;
        void main() {
          float a = sin(uv.x);
          float b = cos(uv.y);
          float c = pow(a, 2.0);
          gl_FragColor = vec4(a, b, c, 1.0);
        }
      `;

      const result = validateShader(shader, 'fragment');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should warn about loops', () => {
      const shader = `
        precision mediump float;
        void main() {
          float sum = 0.0;
          for (int i = 0; i < 10; i++) {
            sum += float(i);
          }
          gl_FragColor = vec4(sum);
        }
      `;

      const result = validateShader(shader, 'fragment');
      expect(result.warnings.some((w) => w.includes('loop'))).toBe(true);
    });
  });

  describe('suggestOptimizations', () => {
    it('should suggest step() replacement for simple conditionals', () => {
      const shader = `
        if (x > 0.5) {
          // code
        }
      `;

      const suggestions = suggestOptimizations(shader);
      expect(suggestions.conditionalReplacements.length).toBeGreaterThan(0);
      expect(suggestions.conditionalReplacements[0]).toContain('step');
    });

    it('should suggest mediump for color calculations', () => {
      const shader = `
        precision highp float;
        vec3 color = baseColor * intensity / 2.0;
      `;

      const suggestions = suggestOptimizations(shader);
      expect(suggestions.precisionIssues.some((i) => i.includes('mediump'))).toBe(true);
    });

    it('should warn about large uniform arrays', () => {
      const shader = `
        uniform vec4 lightPositions[32];
      `;

      const suggestions = suggestOptimizations(shader);
      expect(suggestions.performanceWarnings.some((w) => w.includes('uniform array'))).toBe(true);
    });
  });

  describe('optimizeShader', () => {
    it('should add precision qualifier if missing', () => {
      const shader = `
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
        }
      `;

      const optimized = optimizeShader(shader, 'fragment');
      expect(optimized).toContain('precision mediump float;');
    });

    it('should use highp for vertex shaders', () => {
      const shader = `
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      const optimized = optimizeShader(shader, 'vertex');
      expect(optimized).toContain('precision highp float;');
    });

    it('should replace simple if-else with step/mix', () => {
      const shader = `
        precision mediump float;
        float x;
        float y;
        void main() {
          if (x > 0.5) y = 1.0; else y = 0.0;
        }
      `;

      const optimized = optimizeShader(shader, 'fragment');
      expect(optimized).toContain('step');
      expect(optimized).toContain('mix');
      expect(optimized).not.toContain('if (x > 0.5)');
    });

    it('should preserve existing precision qualifiers', () => {
      const shader = `
        precision highp float;
        void main() {}
      `;

      const optimized = optimizeShader(shader, 'fragment');
      // Should not duplicate precision qualifier
      const precisionCount = (optimized.match(/precision\s+\w+\s+float;/g) || []).length;
      expect(precisionCount).toBe(1);
    });
  });

  // Skip WebGL compilation tests in JSDOM (no WebGL support)
  describe.skip('testShaderCompilation', () => {
    let mockGL: WebGL2RenderingContext;

    beforeEach(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');

      if (!gl) {
        throw new Error('WebGL 2 not available in test environment');
      }

      mockGL = gl;
    });

    it('should compile valid shader', () => {
      const shader = `
        precision highp float;
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      const result = testShaderCompilation(mockGL, shader, 'vertex');
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should detect syntax errors', () => {
      const invalidShader = `
        precision highp float;
        void main() {
          gl_Position = vec4(INVALID_SYNTAX
        }
      `;

      const result = testShaderCompilation(mockGL, invalidShader, 'vertex');
      expect(result.success).toBe(false);
      expect(result.error).not.toBeNull();
    });

    it('should handle fragment shader compilation', () => {
      const shader = `
        precision mediump float;
        void main() {
          gl_FragColor = vec4(1.0);
        }
      `;

      const result = testShaderCompilation(mockGL, shader, 'fragment');
      expect(result.success).toBe(true);
    });
  });
});
