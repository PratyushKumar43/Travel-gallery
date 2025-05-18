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

      scrollRef.current = new LocomotiveScroll({
        el: containerRef.current,
        smooth: true,
        multiplier: 1,
        class: 'is-inview',
        lerp: 0.1,
        ...options,
        smartphone: {
          smooth: false,
          ...options.smartphone
        },
        tablet: {
          smooth: true,
          ...options.tablet
        }
      });

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
    scrollRef.current?.update();
  };

  const scrollTo = (target: string | HTMLElement, options = {}) => {
    scrollRef.current?.scrollTo(target, options);
  };

  return { containerRef, scrollRef, updateScroll, scrollTo };
};