"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface TransitionOverlayProps {
  color?: string;
  isPresent: boolean;
  onAnimationComplete?: () => void;
}

const TransitionOverlay = ({
  color = 'rgb(15 23 42 / 0.98)', // slate-900 with opacity
  isPresent,
  onAnimationComplete
}: TransitionOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isPresent) {
        // Entering - fade in the overlay
        gsap.fromTo(overlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: onAnimationComplete
          }
        );
      } else {
        // Exiting - fade out the overlay
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: onAnimationComplete
        });
      }
    });

    return () => ctx.revert();
  }, [isPresent, onAnimationComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        backgroundColor: color,
        opacity: 0
      }}
    />
  );
};

export default TransitionOverlay;
