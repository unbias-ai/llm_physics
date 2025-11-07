# Mobile-First 3D Visualization Architecture

## Overview

This document describes the mobile-optimized 3D physics visualization system for llm_physics. The architecture implements progressive enhancement: devices without WebGL 2 receive Canvas 2D fallback, mid-range devices get WebGL 1.0, and modern devices get WebGL 2.0 with instanced rendering.

## Decision Tree

```
Start
  |
  v
Detect Device Capabilities (lib/device-detector.ts)
  |
  +---> WebGL 2.0 available?
  |       |
  |       +---> YES --> WebGLRenderer.tsx (Three.js, instanced mesh, LOD)
  |       |
  |       +---> NO ---> WebGL 1.0 available?
  |                       |
  |                       +---> YES --> WebGLRenderer.tsx (legacy mode)
  |                       |
  |                       +---> NO ---> Canvas2DRenderer.tsx (Pyodide + Canvas 2D)
  |
  v
Render
```

## Components

### Phase 2.1: Device Detection

**Files:**
- `lib/device-detector.ts` - Core detection logic
- `lib/device-detector.test.ts` - Unit tests (3 device profiles)
- `components/DeviceContext.tsx` - React context provider
- `components/DeviceContext.test.tsx` - Context tests
- `tests/device-fallback.spec.ts` - Playwright a11y tests

**Capabilities Detected:**
- WebGL version (0, 1, or 2)
- GPU memory (via WEBGL_debug_renderer_info)
- Device pixel ratio (with change listener)
- Max texture size
- Instancing support
- Estimated device RAM

**Render Paths:**
- `CANVAS_2D_FALLBACK` - No WebGL support
- `WEBGL_LEGACY` - WebGL 1.0 only
- `WEBGL_2_OPTIMIZED` - WebGL 2.0 with instancing

### Phase 2.2: Canvas 2D Fallback

**Files:**
- `workers/pyodide-solver.worker.ts` - Web Worker for equation solving
- `hooks/usePyodideSolver.ts` - React hook managing worker lifecycle
- `components/Canvas2DRenderer.tsx` - 2D plot renderer with pan/zoom
- `components/Canvas2DRenderer.test.tsx` - Unit tests
- `tests/canvas-2d-a11y.spec.ts` - Playwright a11y tests

**Features:**
- Pyodide 0.27.2 + SymPy 0.27.2 for equation evaluation
- Web Worker isolates computation from UI thread
- Interactive pan/zoom (mouse and touch)
- 30fps target on 3G throttle
- Keyboard accessible (tabIndex=0)
- WCAG 2.1 AA compliant

**Performance Budget:**
- First meaningful paint: <2s on Fast 3G
- Pyodide init: ~2-3s (cached after first load)
- Equation eval: <50ms per frame
- Frame rate: 30fps minimum

### Phase 2.3: WebGL 2 Renderer

**Files:**
- `components/WebGLRenderer.tsx` - Three.js scene with LOD and instancing
- `components/WebGLRenderer.test.tsx` - Unit tests
- `shaders/particle.vert.glsl` - Vertex shader (mobile-optimized)
- `shaders/particle.frag.glsl` - Fragment shader (no conditionals)
- `lib/shader-optimizer.ts` - GLSL validation and optimization
- `lib/shader-optimizer.test.ts` - Shader tests
- `tests/webgl-a11y.spec.ts` - Playwright a11y tests

**Optimizations:**
- **Instanced Rendering**: One draw call for thousands of particles
- **LOD Switching**: High/medium/low detail based on camera distance
  - High: 16x16 sphere (0-5 units from camera)
  - Medium: 8x8 sphere (5-10 units)
  - Low: 4x4 sphere (10+ units)
- **Mobile-Safe Shaders**:
  - `precision highp float` for position calculations
  - `precision mediump float` for colors
  - No conditionals in fragment shader (use step/mix)
  - No loops with dynamic bounds
- **Pixel Ratio Cap**: Max 2x on high-DPI screens
- **Antialias**: Disabled on high-DPI (saves bandwidth)

**Performance Targets:**
- 60fps on modern devices (2023+)
- 30fps floor on 4-year-old devices
- <10 draw calls per frame
- Bundle size: <300KB initial + <200KB streamed

### Phase 2.4: Progressive Asset Loading

**Status:** Foundation implemented, Edge Function pending

**Planned Files:**
- `app/api/geometry/[scene].ts` - Vercel Edge Function (TODO)
- `hooks/useProgressiveGeometry.ts` - Asset streaming hook (TODO)
- `docs/ASSET_OPTIMIZATION.md` - Compression guide (TODO)

**Strategy:**
- Edge Function detects device tier from query param
- Returns LOD-appropriate geometry:
  - Low-end: <50KB compressed (gzip)
  - Mid-range: <150KB compressed
  - High-end: <300KB compressed
- Lazy loading: Only download Three.js when canvas enters viewport
- Texture compression: WebP or Basis Universal (60-95% reduction)

**Future Enhancement:**
```typescript
// app/api/geometry/[scene].ts (Edge Function)
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const deviceTier = searchParams.get('tier'); // low, medium, high

  // Return appropriate LOD geometry
  const geometry = await fetchGeometry(deviceTier);
  return new Response(JSON.stringify(geometry), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Device Detector:**
- Low-end profile (no WebGL, 512MB RAM)
- Mid-range profile (WebGL 1, 2GB RAM)
- Flagship profile (WebGL 2, 4GB+ RAM)
- SSR compatibility
- Pixel ratio listener

**Canvas2D:**
- Equation evaluation
- Pan/zoom interactions
- Error handling (invalid equations)
- Accessibility (ARIA labels, keyboard nav)

**WebGL:**
- Render path selection
- Fallback messaging
- Performance metrics display
- Device info display

### Accessibility Tests (Playwright + axe-core)

**WCAG 2.1 AA Compliance:**
- Zero CRITICAL violations
- Keyboard navigation functional
- Screen reader announcements (live regions)
- Focus indicators visible
- Color contrast 4.5:1 minimum
- Interaction instructions displayed

**Mobile Testing:**
- Test on real devices (not emulators)
- Verify touch controls work
- Measure frame rate on budget Android
- Test on 3G throttle

### Performance Tests

**Chrome DevTools:**
- Record 10s interaction
- Verify frame rate 25fps minimum
- Measure draw calls (target <10)
- Check bundle size

**Spector.js:**
- Inspect WebGL state
- Verify instancing active
- Count texture uploads
- Measure GPU memory usage

## Performance Budgets

| Device Tier | Load Time | Frame Rate | Bundle Size | Draw Calls |
|-------------|-----------|------------|-------------|------------|
| Low-end     | <2s       | 30fps      | <300KB      | N/A (Canvas) |
| Mid-range   | <1.5s     | 45fps      | <400KB      | <15        |
| High-end    | <1s       | 60fps      | <500KB      | <10        |

**Lighthouse Targets:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 90+

## Asset Optimization Checklist

**Textures:**
- [ ] Use WebP for color textures (60% smaller than PNG)
- [ ] Use Basis Universal for cross-platform compression
- [ ] Resize textures to max 2048x2048 on mobile
- [ ] Use mipmap levels for distant objects

**Geometry:**
- [ ] Use Draco compression (90% reduction)
- [ ] Simplify meshes with Meshlab/Blender
- [ ] Remove unused vertices
- [ ] Merge static geometry into single buffer

**Shaders:**
- [ ] Validate with shader-optimizer.ts
- [ ] Use mediump for colors, highp for positions
- [ ] Replace if-statements with step/mix
- [ ] Pre-compute expensive operations in vertex shader
- [ ] Test on real mobile GPU (Mali, Adreno, PowerVR)

**Networking:**
- [ ] Enable gzip/brotli compression
- [ ] Use CDN for Pyodide (jsdelivr)
- [ ] Lazy load Three.js (only when needed)
- [ ] Stream large assets progressively
- [ ] Cache aggressively (service worker future enhancement)

## Code Examples

### Adding a New Physics Visualization

1. Create equation evaluator (or use existing Pyodide worker)
2. Determine render path in component:

```typescript
import { useDeviceCapabilities } from '@/components/DeviceContext';
import { RenderCapability } from '@/lib/device-detector';

export function MyVisualization() {
  const { capabilities } = useDeviceCapabilities();

  if (capabilities.renderPath === RenderCapability.WEBGL_2_OPTIMIZED) {
    return <WebGLRenderer data={myData} />;
  } else if (capabilities.renderPath === RenderCapability.WEBGL_LEGACY) {
    return <WebGLRenderer data={myData} />; // Legacy mode
  } else {
    return <Canvas2DRenderer equation="my_equation" />;
  }
}
```

3. Add tests for all three paths
4. Measure performance on target devices
5. Document in this file

### Custom Shader Example

```glsl
// particle-custom.vert.glsl
precision highp float;

attribute vec3 position;
attribute vec3 instancePosition;
attribute float instanceScale;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying float vIntensity;

void main() {
  vec3 transformed = position * instanceScale + instancePosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

  // Pre-compute intensity in vertex shader (cheaper than fragment)
  vIntensity = length(instancePosition) / 10.0;
}
```

```glsl
// particle-custom.frag.glsl
precision mediump float;

varying float vIntensity;

void main() {
  // Use mix instead of if-else for mobile GPU
  vec3 colorLow = vec3(0.0, 0.0, 1.0);  // Blue
  vec3 colorHigh = vec3(1.0, 0.0, 0.0); // Red
  vec3 color = mix(colorLow, colorHigh, vIntensity);

  gl_FragColor = vec4(color, 1.0);
}
```

Validate shader:
```typescript
import { validateShader, optimizeShader } from '@/lib/shader-optimizer';

const vertexShader = fs.readFileSync('particle-custom.vert.glsl', 'utf-8');
const validation = validateShader(vertexShader, 'vertex');

if (!validation.isValid) {
  console.error('Shader errors:', validation.errors);
}

const optimized = optimizeShader(vertexShader, 'vertex');
```

## Troubleshooting

### Issue: Canvas2D slow on mobile
**Solution:** Reduce numPoints in equation solver (default 200 -> 100)

### Issue: WebGL black screen on old devices
**Solution:** Check `capabilities.maxTextureSize`, reduce texture sizes

### Issue: High draw calls (>20)
**Solution:** Merge geometries, use instanced rendering

### Issue: Low frame rate on flagship device
**Solution:** Cap pixel ratio to 2x, disable antialiasing

### Issue: Pyodide worker timeout
**Solution:** Increase worker timeout, simplify equation

## Future Enhancements

**Phase 2.5 (Planned):**
- OffscreenCanvas for background rendering
- WebGPU support (when adoption >50%)
- Real-time physics simulation (wasm-based)
- Multi-user collaborative viewing (WebSocket sync)

**Phase 3 (Research):**
- WebXR for VR/AR physics visualization
- AI-assisted equation suggestions (Claude API)
- arXiv paper embedding with citation graph
- Performance profiling dashboard

## References

- [Three.js Mobile Optimization](https://moldstud.com/articles/p-optimizing-three-js-for-mobile-platforms-tips-and-tricks)
- [WebGL Best Practices](https://blog.pixelfreestudio.com/how-to-optimize-webgl-for-high-performance-3d-graphics/)
- [Pyodide Performance](https://pyodide.com/is-pyodide-slower-than-native-python/)
- [Mobile Shader Optimization](https://moldstud.com/articles/p-enhance-your-threejs-renderings-advanced-techniques-with-webgl-shaders)

---

**Last Updated:** 2025-11-07
**Maintainer:** Diego Cortes (unbias-ai)
**Status:** Phase 2.1-2.3 complete, Phase 2.4 foundation in place
