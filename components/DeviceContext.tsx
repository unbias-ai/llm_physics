'use client';

/**
 * DeviceContext - React Context for Device Capabilities
 * Provides device detection state to all child components
 * Listens for device pixel ratio changes (multi-monitor scenarios)
 */

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  detectDeviceCapabilities,
  createPixelRatioListener,
  getAccessibilityMessage,
  type DeviceCapabilities,
} from '../lib/device-detector';

interface DeviceContextValue {
  capabilities: DeviceCapabilities;
  accessibilityMessage: string;
  isReady: boolean;
}

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
}

export function DeviceProvider({ children }: DeviceProviderProps) {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detect capabilities on mount (client-side only)
    const detected = detectDeviceCapabilities();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapabilities(detected);
    setIsReady(true);

    // Listen for pixel ratio changes (user moves window to different screen)
    const cleanup = createPixelRatioListener((newRatio) => {
      setCapabilities((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          devicePixelRatio: newRatio,
        };
      });
    });

    return cleanup;
  }, []);

  if (!isReady || !capabilities) {
    // SSR or loading state
    return null;
  }

  const accessibilityMessage = getAccessibilityMessage(capabilities);

  return (
    <DeviceContext.Provider value={{ capabilities, accessibilityMessage, isReady }}>
      <div role="status" aria-live="polite" className="sr-only">
        {accessibilityMessage}
      </div>
      {children}
    </DeviceContext.Provider>
  );
}

/**
 * Hook to access device capabilities
 * Throws if used outside DeviceProvider
 */
export function useDeviceCapabilities(): DeviceContextValue {
  const context = useContext(DeviceContext);

  if (context === undefined) {
    throw new Error('useDeviceCapabilities must be used within a DeviceProvider');
  }

  return context;
}
