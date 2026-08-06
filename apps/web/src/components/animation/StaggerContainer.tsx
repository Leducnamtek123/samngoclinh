'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  stagger?: number; // Delay between items in seconds (default: 0.1s = 100ms)
  duration?: number;
  variant?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale';
  distance?: number;
  selector?: string; // CSS selector for child items (default: direct children)
  className?: string;
  as?: React.ElementType;
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  duration = 0.9,
  variant = 'fade-up',
  distance = 50,
  selector,
  className = '',
  as: Component = 'div',
  style,
  ...props
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = selector
      ? container.querySelectorAll(selector)
      : Array.from(container.children);

    if (items.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    let ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration: duration,
        stagger: stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      };

      switch (variant) {
        case 'fade-up':
          fromVars.y = distance;
          toVars.y = 0;
          break;
        case 'fade-left':
          fromVars.x = -distance;
          toVars.x = 0;
          break;
        case 'fade-right':
          fromVars.x = distance;
          toVars.x = 0;
          break;
        case 'scale':
          fromVars.scale = 0.92;
          toVars.scale = 1;
          break;
      }

      gsap.fromTo(items, fromVars, toVars);
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, duration, variant, distance, selector]);

  return (
    <Component ref={containerRef} className={className} style={style} {...props}>
      {children}
    </Component>
  );
}
