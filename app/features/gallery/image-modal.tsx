"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryImage } from '@/types/gallery';

interface ImageModalProps {
  image: GalleryImage;
  cardRef: HTMLDivElement;
  onClose: () => void;
}

const ImageModal = ({ image, cardRef, onClose }: ImageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modalRef.current || !imageRef.current || !contentRef.current || !overlayRef.current) return;

    // Get card position
    const cardRect = cardRef.getBoundingClientRect();
    
    // Create GSAP context
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(imageRef.current, { 
        width: cardRect.width,
        height: cardRect.height,
        top: cardRect.top,
        left: cardRect.left,
        position: 'fixed',
        zIndex: 100
      });
      
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0, y: 20 });
      gsap.set(closeRef.current, { opacity: 0, scale: 0.8 });
      
      // Animate overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut"
      });
      
      // Animate image to center screen
      gsap.to(imageRef.current, {
        width: "80vw",
        height: "80vh",
        maxWidth: "1200px",
        maxHeight: "80vh",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        duration: 0.7,
        ease: "power3.inOut"
      });
      
      // Animate content
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.3,
        ease: "power3.out"
      });
      
      // Animate close button
      gsap.to(closeRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 0.4,
        ease: "back.out(1.7)"
      });
    });
    
    // Cleanup
    return () => ctx.revert();
  }, [cardRef]);
  
  const handleClose = () => {
    if (!modalRef.current || !imageRef.current || !contentRef.current || !overlayRef.current) return;
    
    const cardRect = cardRef.getBoundingClientRect();
    
    // Create GSAP context for closing animation
    const ctx = gsap.context(() => {
      // Animation timeline
      const tl = gsap.timeline({
        onComplete: onClose
      });
      
      // Animate content out
      tl.to(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power3.in"
      });
      
      // Animate close button out
      tl.to(closeRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power3.in"
      }, "<");
      
      // Animate image back to original position
      tl.to(imageRef.current, {
        width: cardRect.width,
        height: cardRect.height,
        top: cardRect.top,
        left: cardRect.left,
        duration: 0.5,
        ease: "power3.inOut"
      }, "-=0.1");
      
      // Animate overlay out
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, "-=0.3");
    });
    
    // No need to clean up as component will unmount
  };

  return (
    <div 
      ref={modalRef} 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Background overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      {/* Image container */}
      <div 
        ref={imageRef}
        className="overflow-hidden rounded-lg shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
          />
          
          {/* Content overlay */}
          <div 
            ref={contentRef}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-white" />
              <h3 className="text-white text-xl font-medium">
                {image.location}
              </h3>
            </div>
            <p className="text-white/80 text-sm">
              {image.alt}
            </p>
          </div>
          
          {/* Close button */}
          <Button
            ref={closeRef}
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 border-0 text-white hover:bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;