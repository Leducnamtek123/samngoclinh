'use client';

import React, { createContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}


interface ScrollAnimationContextType {
  lenis: Lenis | null;
}

const ScrollAnimationContext = createContext<ScrollAnimationContextType>({ lenis: null });

interface ScrollAnimationProviderProps {
  children: React.ReactNode;
}

export function ScrollAnimationProvider({ children }: ScrollAnimationProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    setLenisInstance(lenis);

    // Sync Lenis scroll with GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScroll);

    // Integrate Lenis RAF with GSAP Ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // Disable GSAP lag smoothing to ensure synchronized momentum
    gsap.ticker.lagSmoothing(0);

    // Handle document size changes
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(updateTicker);
      lenis.off('scroll', handleScroll);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <ScrollAnimationContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </ScrollAnimationContext.Provider>
  );
}
