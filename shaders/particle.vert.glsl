/**
 * Particle Vertex Shader (Mobile-Optimized)
 * Uses highp for position calculations, mediump for colors
 * Instanced rendering for performance
 */

precision highp float;

// Per-vertex attributes (from geometry)
attribute vec3 position;

// Per-instance attributes (one per particle)
attribute vec3 instancePosition;
attribute vec3 instanceColor;
attribute float instanceScale;

// Uniforms (shared across all vertices)
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

// Varying (passed to fragment shader)
varying vec3 vColor;

void main() {
  // Apply instance transformations
  vec3 transformed = position * instanceScale + instancePosition;

  // Standard MVP transform (use highp for precision)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  // Pass color to fragment shader (mediump sufficient)
  vColor = instanceColor;
}
