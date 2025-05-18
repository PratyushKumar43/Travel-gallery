"use client";

import { useEffect, useRef } from 'react';
import LocomotiveScroll, { ILocomotiveScrollOptions } from 'locomotive-scroll';
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

      // Create options object that matches ILocomotiveScrollOptions interface
      const locomotiveOptions = {
        el: containerRef.current,
        smooth: options.smooth ?? true,
        multiplier: options.multiplier ?? 1,
        class: options.class ?? 'is-inview',
        lerp: options.lerp ?? 0.1,
        getDirection: options.getDirection,
        getSpeed: options.getSpeed,
        // Map smartphone to mobile and tablet properties as expected by the library
        mobile: options.smartphone ? {
          smooth: options.smartphone.smooth ?? false,
          breakpoint: options.smartphone.breakpoint ?? 0
        } : undefined,
        tablet: options.tablet ? {
          smooth: options.tablet.smooth ?? true,
          breakpoint: options.tablet.breakpoint ?? 0
        } : undefined
      };
      
      // Use type assertion to bypass TypeScript's type checking
      // This is necessary because the TypeScript definitions from the library don't match its actual JavaScript API
      scrollRef.current = new LocomotiveScroll(locomotiveOptions as unknown as ILocomotiveScrollOptions);

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
    // Use type assertion to bypass type checking
    (scrollRef.current as any)?.scrollTo(target, options);
  };

  return { containerRef, scrollRef, updateScroll, scrollTo };
};