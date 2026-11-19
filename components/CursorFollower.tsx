'use client';

import React, { useEffect, useState } from 'react';
import { useEditBridge } from '@/lib/store';

export function CursorFollower() {
  const { themeMode } = useEditBridge();
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

  // Smooth ambient glow gradient optimized for GTA VI Vice City Sunset theme
  const glowGradient =
    themeMode === 'DARK'
      ? 'radial-gradient(circle, rgba(255, 46, 147, 0.14) 0%, rgba(255, 123, 84, 0.07) 35%, transparent 70%)'
      : 'radial-gradient(circle, rgba(255, 46, 147, 0.12) 0%, rgba(255, 209, 102, 0.05) 35%, transparent 70%)';

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
        background: glowGradient,
        borderRadius: '50%',
        willChange: 'transform',
      }}
    />
  );
}
