"use client";

import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom hook for using GSAP in React components
export const useGSAP = (callback: () => void, dependencies: any[] = []) => {
  useLayoutEffect(() => {
    const ctx = gsap.context(callback);
    
    return () => {
      ctx.revert(); // Cleanup animations when component unmounts
    };
  }, dependencies);
};

// Helper functions for common animations
export const fadeIn = (element: Element, delay: number = 0, duration: number = 1) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      delay, 
      ease: "power3.out" 
    }
  );
};

export const staggerFadeIn = (elements: Element[], staggerTime: number = 0.1, delay: number = 0, duration: number = 1) => {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration, 
      delay, 
      stagger: staggerTime, 
      ease: "power3.out" 
    }
  );
};

export const createScrollTrigger = (
  trigger: Element, 
  animation: gsap.core.Timeline | gsap.core.Tween, 
  start: string = "top 80%"
) => {
  return ScrollTrigger.create({
    trigger,
    start,
    animation
  });
};