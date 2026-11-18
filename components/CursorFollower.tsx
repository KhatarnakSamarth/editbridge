'use client';

import React, { useEffect, useState } from 'react';
import { useEditBridge } from '@/lib/store';

export function CursorFollower() {
  const { accentTheme, themeMode } = useEditBridge();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only mobile devices to avoid unnecessary rendering
    if (typeof window !== 'undefined') {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
      if (isTouch) return;

      const handleMouseMove = (e: MouseEvent) => {
        setPos({ x: e.clientX, y: e.clientY });
        if (!isVisible) setIsVisible(true);
      };

      const handleMouseLeave = () => {
        setIsVisible(false);
      };

      window.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  // Get glow colors based on theme
  const getGlowColor = () => {
    switch (accentTheme) {
      case 'PURPLE':
        return themeMode === 'DARK'
          ? 'rgba(168, 85, 247, 0.15)'
          : 'rgba(147, 51, 234, 0.1)';
      case 'EMERALD':
        return themeMode === 'DARK'
          ? 'rgba(16, 185, 129, 0.15)'
          : 'rgba(5, 150, 105, 0.1)';
      case 'AMBER':
        return themeMode === 'DARK'
          ? 'rgba(245, 158, 11, 0.15)'
          : 'rgba(217, 119, 6, 0.1)';
      case 'ROSE':
        return themeMode === 'DARK'
          ? 'rgba(244, 63, 94, 0.15)'
          : 'rgba(225, 29, 72, 0.1)';
      case 'CYAN':
      default:
        return themeMode === 'DARK'
          ? 'rgba(6, 182, 212, 0.16)'
          : 'rgba(2, 132, 199, 0.1)';
    }
  };

  const glowColor = getGlowColor();

  return (
    <div
      aria-hidden="true"
      className="fixed pointer-events-none z-30 transition-opacity duration-300 ease-out"
      style={{
        left: 0,
        top: 0,
        width: '500px',
        height: '500px',
        transform: `translate3d(${pos.x - 250}px, ${pos.y - 250}px, 0)`,
        background: `radial-gradient(circle, ${glowColor} 0%, rgba(59, 130, 246, 0.04) 35%, transparent 70%)`,
        borderRadius: '50%',
        willChange: 'transform',
      }}
    />
  );
}
