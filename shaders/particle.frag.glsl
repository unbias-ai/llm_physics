/**
 * Particle Fragment Shader (Mobile-Optimized)
 * Minimal calculations, no conditionals
 * Uses step/mix instead of if-else
 */

precision mediump float;

// Input from vertex shader
varying vec3 vColor;

void main() {
  // Simple color output (no lighting calculations on mobile)
  gl_FragColor = vec4(vColor, 1.0);
}
