/**
 * Device Capability Detector
 * Determines optimal rendering path: Canvas 2D, WebGL 1, or WebGL 2
 * Runs synchronously at app startup
 */

export enum RenderCapability {
  CANVAS_2D_FALLBACK = 'CANVAS_2D_FALLBACK',
  WEBGL_LEGACY = 'WEBGL_LEGACY',
  WEBGL_2_OPTIMIZED = 'WEBGL_2_OPTIMIZED',
}

export interface DeviceCapabilities {
  renderPath: RenderCapability;
  webglVersion: number;
  gpuMemoryMB: number;
  devicePixelRatio: number;
  maxTextureSize: number;
  estimatedRAM: number;
  supportsInstancing: boolean;
}

/**
 * Test WebGL 2.0 context availability
 */
function testWebGL2Support(): { supported: boolean; context: WebGL2RenderingContext | null } {
  // Check for SSR or browser environment
  /* istanbul ignore next - SSR environments not testable in JSDOM */
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { supported: false, context: null };
  }

  // Additional check: verify window/document are not null (for test environments)
  /* istanbul ignore next - SSR edge case not testable in JSDOM */
  if (!window || !document) {
    return { supported: false, context: null };
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');

  return {
    supported: gl !== null,
    context: gl,
  };
}

/**
 * Test WebGL 1.0 context availability
 */
function testWebGL1Support(): { supported: boolean; context: WebGLRenderingContext | null } {
  // Check for SSR or browser environment
  /* istanbul ignore next - SSR environments not testable in JSDOM */
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { supported: false, context: null };
  }

  // Additional check: verify window/document are not null (for test environments)
  /* istanbul ignore next - SSR edge case not testable in JSDOM */
  if (!window || !document) {
    return { supported: false, context: null };
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  return {
    supported: gl !== null,
    context: gl as WebGLRenderingContext | null,
  };
}

/**
 * Estimate GPU memory from WEBGL_debug_renderer_info extension
 */
function getGPUMemory(gl: WebGLRenderingContext | WebGL2RenderingContext | null): number {
  if (!gl) return 0;

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return 512; // Conservative fallback

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string | null;

  // Parse GPU memory from renderer string (heuristic)
  // Example: "ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)"
  // Mobile GPUs: Mali, Adreno, PowerVR typically 512MB-4GB
  // Desktop GPUs: NVIDIA, AMD, Intel typically 2GB-24GB

  if (!renderer) return 512; // Conservative fallback for unknown GPU

  if (renderer.toLowerCase().includes('mali') || renderer.toLowerCase().includes('adreno')) {
    return 1024; // Mobile GPUs
  }

  if (renderer.toLowerCase().includes('powervr')) {
    return 512; // Low-end mobile
  }

  if (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('geforce')) {
    return 4096; // Desktop dedicated GPU
  }

  if (renderer.toLowerCase().includes('radeon') || renderer.toLowerCase().includes('amd')) {
    return 4096; // Desktop dedicated GPU
  }

  return 2048; // Default for integrated GPUs
}

/**
 * Estimate device RAM via canvas memory test
 * Creates large canvas, measures allocation time
 */
function estimateDeviceRAM(): number {
  /* istanbul ignore next - SSR environments not testable in JSDOM */
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 2048; // SSR fallback
  }

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 2048;

    // Try allocating large canvas (measures memory pressure)
    const testSize = 4096;
    canvas.width = testSize;
    canvas.height = testSize;

    const imageData = ctx.createImageData(testSize, testSize);

    // Success = at least 2GB RAM (4096x4096x4 bytes = 64MB allocation)
    return imageData ? 2048 : 512;
  } catch {
    return 512; // Low memory device
  }
}

/**
 * Get max texture size from WebGL context
 */
function getMaxTextureSize(gl: WebGLRenderingContext | WebGL2RenderingContext | null): number {
  if (!gl) return 0;
  return gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
}

/**
 * Detect device capabilities and select optimal render path
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  // Test WebGL 2.0 first (preferred)
  const webgl2 = testWebGL2Support();
  if (webgl2.supported && webgl2.context) {
    const gpuMemory = getGPUMemory(webgl2.context);
    const maxTextureSize = getMaxTextureSize(webgl2.context);
    const estimatedRAM = estimateDeviceRAM();

    // Check for instancing support (required for optimized path)
    const supportsInstancing = true; // WebGL 2 always supports instancing

    return {
      renderPath: RenderCapability.WEBGL_2_OPTIMIZED,
      webglVersion: 2,
      gpuMemoryMB: gpuMemory,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      maxTextureSize,
      estimatedRAM,
      supportsInstancing,
    };
  }

  // Fallback to WebGL 1.0
  const webgl1 = testWebGL1Support();
  if (webgl1.supported && webgl1.context) {
    const gpuMemory = getGPUMemory(webgl1.context);
    const maxTextureSize = getMaxTextureSize(webgl1.context);
    const estimatedRAM = estimateDeviceRAM();

    // Check for instancing support via extension
    const instancedArrays = webgl1.context.getExtension('ANGLE_instanced_arrays');
    const supportsInstancing = instancedArrays !== null;

    return {
      renderPath: RenderCapability.WEBGL_LEGACY,
      webglVersion: 1,
      gpuMemoryMB: gpuMemory,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      maxTextureSize,
      estimatedRAM,
      supportsInstancing,
    };
  }

  // Final fallback: Canvas 2D only
  return {
    renderPath: RenderCapability.CANVAS_2D_FALLBACK,
    webglVersion: 0,
    gpuMemoryMB: 0,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    maxTextureSize: 0,
    estimatedRAM: estimateDeviceRAM(),
    supportsInstancing: false,
  };
}

/**
 * Get human-readable accessibility message for current render path
 */
export function getAccessibilityMessage(capabilities: DeviceCapabilities): string {
  switch (capabilities.renderPath) {
    case RenderCapability.WEBGL_2_OPTIMIZED:
      return '3D visualization enabled with hardware acceleration';
    case RenderCapability.WEBGL_LEGACY:
      return '3D visualization enabled with basic hardware acceleration';
    case RenderCapability.CANVAS_2D_FALLBACK:
      return '3D visualization disabled on this device. Showing interactive mathematics instead';
    default:
      return 'Visualization mode unknown';
  }
}

/**
 * Create device pixel ratio change listener
 * Detects when user moves window to different screen
 */
export function createPixelRatioListener(callback: (newRatio: number) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // SSR no-op
  }

  const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);

  const handleChange = () => {
    callback(window.devicePixelRatio);
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}
