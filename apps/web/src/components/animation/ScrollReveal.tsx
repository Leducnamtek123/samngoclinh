'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type AnimationVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'blur'
  | 'parallax';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number; // In seconds (e.g. 0.15)
  duration?: number; // In seconds (e.g. 1.0)
  distance?: number; // Distance in px (e.g. 60)
  scaleFrom?: number; // Initial scale (e.g. 0.92)
  once?: boolean; // Trigger only once
  speed?: number; // For parallax effect
  as?: React.ElementType;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 1.0,
  distance = 60,
  scaleFrom = 0.92,
  once = true,
  speed = 0.3,
  as: Component = 'div',
  className = '',
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, filter: 'none' });
      return;
    }

    let ctx = gsap.context(() => {
      if (variant === 'parallax') {
        gsap.fromTo(
          el,
          { y: -distance * speed },
          {
            y: distance * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
        return;
      }

      // Initial state config
      const fromState: gsap.TweenVars = { opacity: 0 };
      const toState: gsap.TweenVars = {
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
        },
      };

      switch (variant) {
        case 'fade-up':
          fromState.y = distance;
          toState.y = 0;
          break;
        case 'fade-down':
          fromState.y = -distance;
          toState.y = 0;
          break;
        case 'fade-left':
          fromState.x = -distance;
          toState.x = 0;
          break;
        case 'fade-right':
          fromState.x = distance;
          toState.x = 0;
          break;
        case 'scale':
          fromState.scale = scaleFrom;
          toState.scale = 1;
          break;
        case 'blur':
          fromState.filter = 'blur(12px)';
          fromState.y = distance * 0.5;
          toState.filter = 'blur(0px)';
          toState.y = 0;
          break;
      }

      gsap.fromTo(el, fromState, toState);
    }, ref);

    return () => ctx.revert();
  }, [variant, delay, duration, distance, scaleFrom, once, speed]);

  return (
    <Component ref={ref} className={className} style={style} {...props}>
      {children}
    </Component>
  );
}
