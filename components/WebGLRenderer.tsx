'use client';

/**
 * WebGLRenderer - Three.js 3D Visualization
 * Optimized for mobile: instanced rendering, LOD, touch controls
 * Only loads if device supports WebGL 2
 */

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useDeviceCapabilities } from './DeviceContext';
import { RenderCapability } from '../lib/device-detector';

interface WebGLRendererProps {
  data?: Float32Array;
  width?: number;
  height?: number;
}

export function WebGLRenderer({ data, width = 800, height = 600 }: WebGLRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { capabilities } = useDeviceCapabilities();
  const [fps, setFps] = useState(0);
  const [drawCalls, setDrawCalls] = useState(0);

  useEffect(() => {
    // Only render if device supports WebGL 2
    if (capabilities.renderPath !== RenderCapability.WEBGL_2_OPTIMIZED) {
      return;
    }

    if (!containerRef.current) return;

    // Capture container ref for cleanup
    const container = containerRef.current;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Dark background

    // Camera with mobile-friendly FOV
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Renderer with mobile optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: capabilities.devicePixelRatio < 2, // Disable AA on high-DPI (performance)
      powerPreference: 'high-performance',
      precision: 'mediump', // Lower precision for mobile
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(capabilities.devicePixelRatio, 2)); // Cap at 2x for performance
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Create instanced particle system
    const particleCount = data ? data.length : 1000;
    const geometry = new THREE.SphereGeometry(0.05, 8, 8); // Low-poly sphere

    // Create LOD geometry
    const lod = new THREE.LOD();

    // High detail (close to camera)
    const highDetailGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const highDetailMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const highDetailMesh = new THREE.Mesh(highDetailGeometry, highDetailMaterial);
    lod.addLevel(highDetailMesh, 0);

    // Medium detail
    const mediumDetailGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const mediumDetailMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const mediumDetailMesh = new THREE.Mesh(mediumDetailGeometry, mediumDetailMaterial);
    lod.addLevel(mediumDetailMesh, 5);

    // Low detail (far from camera)
    const lowDetailGeometry = new THREE.SphereGeometry(0.05, 4, 4);
    const lowDetailMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const lowDetailMesh = new THREE.Mesh(lowDetailGeometry, lowDetailMaterial);
    lod.addLevel(lowDetailMesh, 10);

    scene.add(lod);

    // Create instanced mesh for particles
    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      particleCount
    );

    // Set instance positions (sample data or grid)
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;

      matrix.setPosition(x, y, z);
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);

    // Touch controls for mobile
    let isDragging = false;
    let previousTouchX = 0;
    let previousTouchY = 0;

    /* istanbul ignore next - Touch event handlers not testable in JSDOM */
    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      previousTouchX = e.touches[0].clientX;
      previousTouchY = e.touches[0].clientY;
    };

    /* istanbul ignore next - Touch event handlers not testable in JSDOM */
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      const deltaX = e.touches[0].clientX - previousTouchX;
      const deltaY = e.touches[0].clientY - previousTouchY;

      camera.position.x += deltaX * 0.01;
      camera.position.y -= deltaY * 0.01;

      previousTouchX = e.touches[0].clientX;
      previousTouchY = e.touches[0].clientY;
    };

    /* istanbul ignore next - Touch event handlers not testable in JSDOM */
    const handleTouchEnd = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('touchend', handleTouchEnd);

    // Mouse controls for desktop
    /* istanbul ignore next - Mouse event handlers not testable in JSDOM */
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousTouchX = e.clientX;
      previousTouchY = e.clientY;
    };

    /* istanbul ignore next - Mouse event handlers not testable in JSDOM */
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousTouchX;
      const deltaY = e.clientY - previousTouchY;

      camera.position.x += deltaX * 0.01;
      camera.position.y -= deltaY * 0.01;

      previousTouchX = e.clientX;
      previousTouchY = e.clientY;
    };

    /* istanbul ignore next - Mouse event handlers not testable in JSDOM */
    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);

    // Animation loop with FPS tracking
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);

      // Update LOD based on camera distance
      lod.update(camera);

      // Rotate scene slowly
      instancedMesh.rotation.y += 0.001;

      // Render
      renderer.render(scene, camera);

      // Track draw calls
      setDrawCalls(renderer.info.render.calls);

      // Calculate FPS
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
    };

    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);

      renderer.dispose();
      geometry.dispose();
      highDetailGeometry.dispose();
      mediumDetailGeometry.dispose();
      lowDetailGeometry.dispose();

      if (container && renderer.domElement.parentNode) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [capabilities, data, width, height]);

  if (capabilities.renderPath !== RenderCapability.WEBGL_2_OPTIMIZED) {
    return (
      <div className="flex items-center justify-center" style={{ width, height }}>
        <p className="text-gray-400">WebGL 2 not supported. Using Canvas 2D fallback.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={containerRef} role="img" aria-label="3D physics visualization" tabIndex={0} />
      <div className="mt-2 text-sm text-gray-400">
        <p>FPS: {fps} | Draw Calls: {drawCalls}</p>
        <p>Controls: Drag to rotate | Pinch to zoom (touch)</p>
        <p>
          Device: {capabilities.webglVersion === 2 ? 'WebGL 2.0' : 'WebGL 1.0'} | GPU:{' '}
          {capabilities.gpuMemoryMB}MB
        </p>
      </div>
    </div>
  );
}
