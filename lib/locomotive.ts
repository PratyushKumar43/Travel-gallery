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

      // Create options object
      const locomotiveOptions: any = {
        el: containerRef.current,
        smooth: options.smooth ?? true,
        multiplier: options.multiplier ?? 1,
        class: options.class ?? 'is-inview',
        lerp: options.lerp ?? 0.1,
      };

      // Add optional properties
      if (options.getDirection !== undefined) locomotiveOptions.getDirection = options.getDirection;
      if (options.getSpeed !== undefined) locomotiveOptions.getSpeed = options.getSpeed;
      
      // Handle mobile/tablet configuration
      if (options.smartphone) {
        locomotiveOptions.mobile = {
          smooth: options.smartphone.smooth ?? false,
          breakpoint: options.smartphone.breakpoint ?? 0
        };
      }
      
      if (options.tablet) {
        locomotiveOptions.tablet = {
          smooth: options.tablet.smooth ?? true,
          breakpoint: options.tablet.breakpoint ?? 0
        };
      }
      
      // Initialize locomotive scroll
      scrollRef.current = new LocomotiveScroll(locomotiveOptions);

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
    // Use type assertion to handle missing update method in type definition
    if (scrollRef.current) {
      (scrollRef.current as any).update();
    }
  };

  const scrollTo = (target: string | HTMLElement, options = {}) => {
    // Use type assertion to handle missing scrollTo method in type definition
    if (scrollRef.current) {
      (scrollRef.current as any).scrollTo(target, options);
    }
  };

  return { containerRef, scrollRef, updateScroll, scrollTo };
};