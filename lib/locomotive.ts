"use client";

import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export type LocomotiveScrollOptions = {
  el?: HTMLElement | null;
  smooth?: boolean;
  multiplier?: number;
  class?: string;
  lerp?: number;
  getDirection?: boolean;
  getSpeed?: boolean;
  smartphone?: {
    smooth?: boolean;
    breakpoint?: number;
  };
  tablet?: {
    smooth?: boolean;
    breakpoint?: number;
  };
};

export const useLocomotiveScroll = (options: LocomotiveScrollOptions = {}) => {
  const scrollRef = useRef<LocomotiveScroll | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Locomotive Scroll
    const initLocomotiveScroll = async () => {
      if (!containerRef.current) return;

      // Use type assertion to bypass type checking
      // This is necessary because the type definitions don't match the actual API
      const locomotiveOptions = {
        el: containerRef.current,
        smooth: options.smooth ?? true,
        multiplier: options.multiplier ?? 1,
        class: options.class ?? 'is-inview',
        lerp: options.lerp ?? 0.1,
        getDirection: options.getDirection,
        getSpeed: options.getSpeed,
        // Use mobile instead of smartphone
        mobile: {
          smooth: false,
          ...(options.smartphone ? { breakpoint: options.smartphone.breakpoint ?? 0 } : {})
        },
        tablet: {
          smooth: true,
          ...(options.tablet ? { breakpoint: options.tablet.breakpoint ?? 0 } : {})
        }
      };
      
      // Use type assertion to bypass the type checking
      scrollRef.current = new LocomotiveScroll(locomotiveOptions as any);

      // Setup ScrollTrigger integration if needed
      // This would go here
    };

    // Wait for fonts and images to load
    window.addEventListener('load', () => {
      initLocomotiveScroll();
    });

    // Try to init even if load event already fired
    initLocomotiveScroll();

    return () => {
      scrollRef.current?.destroy();
    };
  }, [options]);

  const updateScroll = () => {
    // Use type assertion to bypass type checking
    (scrollRef.current as any)?.update();
  };

  const scrollTo = (target: string | HTMLElement, options = {}) => {
    scrollRef.current?.scrollTo(target, options);
  };

  return { containerRef, scrollRef, updateScroll, scrollTo };
};