"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import ImageCard from './image-card';
import { GalleryImage } from '@/types/gallery';

// Dynamically import ImageModal to reduce initial bundle size
const ImageModal = dynamic(() => import('./image-modal'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="animate-pulse w-16 h-16 rounded-full bg-muted" />
  </div>
});

interface GalleryGridProps {
  images: GalleryImage[];
}

const GalleryGrid = ({ images }: GalleryGridProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [clickedCardRef, setClickedCardRef] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 12 });
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: '200px' // Preload images before they come into view
  });
  
  // Track whether we're currently loading more images
  const [isLoading, setIsLoading] = useState(false);

  // Memoize visible images to prevent unnecessary re-renders
  const visibleImages = useMemo(() => 
    images.slice(visibleRange.start, visibleRange.end),
    [images, visibleRange]
  );

  // Load more images when user scrolls near the bottom
  useEffect(() => {
    if (inView && visibleRange.end < images.length && !isLoading) {
      setIsLoading(true);
      // Use requestAnimationFrame to batch state updates
      requestAnimationFrame(() => {
        setVisibleRange(prev => ({
          start: prev.start,
          end: Math.min(prev.end + 12, images.length)
        }));
        setIsLoading(false);
      });
    }
  }, [inView, images.length, visibleRange.end, isLoading]);

  // Set up animations for newly loaded images with performance optimizations
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = Array.from(document.querySelectorAll('.gallery-card:not(.animated)'));
    if (cards.length === 0) return;

    // Use requestAnimationFrame to optimize animations
    requestAnimationFrame(() => {
      gsap.fromTo(
        cards,
        { 
          y: 30,  // Reduced distance for smoother animation
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.03, // Reduced stagger time
          duration: 0.4, // Slightly faster animation
          ease: "power2.out",
          onComplete: () => {
            cards.forEach(card => card.classList.add('animated'));
          }
        }
      );
    });
  }, [visibleImages.length]); // Only run when we have new images

  // Handle image click for modal
  const handleImageClick = (image: GalleryImage, cardRef: HTMLDivElement) => {
    setSelectedImage(image);
    setClickedCardRef(cardRef);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedImage(null);
    setClickedCardRef(null);
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = 'unset';
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setClickedCardRef(null);
    
    // Re-enable scrolling
    document.body.style.overflow = '';
  };

  return (
    <>
      <div
        ref={gridRef}
        style={{ willChange: 'transform' }} // Optimize for animations
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
      >
        {visibleImages.map((image, index) => (
          <ImageCard
            key={image.id}
            className="gallery-card"
            image={image}
            onClick={(img, cardRef) => {
              setSelectedImage(img);
              setClickedCardRef(cardRef);
            }}
          />
        ))}
        {visibleRange.end < images.length && (
          <div
            ref={loadMoreRef}
            className="col-span-full flex justify-center p-8"
          >
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {selectedImage && clickedCardRef && (
        <ImageModal
          image={selectedImage}
          cardRef={clickedCardRef}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default GalleryGrid;