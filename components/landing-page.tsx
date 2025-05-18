"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ArrowRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import TransitionOverlay from '@/components/ui/transition-overlay';

const LandingPage = () => {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEnterGallery = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        router.push('/gallery');
      }
    });

    // Animate out current content
    tl.to([titleRef.current, subtitleRef.current, buttonRef.current, logoRef.current], {
      y: -20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.03
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(logoRef.current, 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2 }
      )
      .fromTo(titleRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
        "-=0.8"
      )
      .fromTo(subtitleRef.current, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(buttonRef.current, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background text-foreground" 
      data-scroll-container
    >
      {isAnimating && (
        <TransitionOverlay
          isPresent={true}
          color="rgb(15 23 42 / 0.98)"
        />
      )}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-100"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/70 backdrop-transparent z-10" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center relative z-20">
        <div 
          ref={logoRef}
          className="mb-12 bg-primary/10 dark:bg-primary/20 p-5 rounded-full transform hover:scale-105 transition-transform duration-300"
        >
          <Camera className="w-12 h-12 text-primary" />
        </div>
        
        <h1 
          ref={titleRef}
          className="font-['Rosaline'] text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight tracking-normal text-foreground max-w-3xl mx-auto px-4"
        >
          <div className="flex flex-wrap justify-center items-center gap-x-2">
            {"Explore The ".split('').map((letter, index) => (
              <span 
                key={`letter-1-${index}`} 
                className="animate-letter inline-block transform hover:scale-110 transition-transform duration-200"
                style={{ display: letter === ' ' ? 'inline-block' : 'inline-block', width: letter === ' ' ? '0.5em' : 'auto' }}
              >
                {letter}
              </span>
            ))}
            <span className="text-primary inline-flex">
              {"World".split('').map((letter, index) => (
                <span 
                  key={`letter-2-${index}`} 
                  className="animate-letter inline-block transform hover:scale-110 transition-transform duration-200"
                >
                  {letter}
                </span>
              ))}
            </span>
            {" Through Our Lens".split('').map((letter, index) => (
              <span 
                key={`letter-3-${index}`} 
                className="animate-letter inline-block transform hover:scale-110 transition-transform duration-200"
                style={{ display: letter === ' ' ? 'inline-block' : 'inline-block', width: letter === ' ' ? '0.5em' : 'auto' }}
              >
                {letter}
              </span>
            ))}
          </div>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        >
          Immerse yourself in stunning imagery from breathtaking destinations around the globe, 
          captured through the eyes of passionate travelers.
        </p>
        
        <div ref={buttonRef}>
          <Button 
            size="lg" 
            className="group" 
            onClick={handleEnterGallery}
            disabled={isAnimating}
          >
            Enter Gallery
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;