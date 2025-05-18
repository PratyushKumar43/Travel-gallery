"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLocomotiveScroll } from '@/lib/locomotive';
import { useGSAP } from '@/lib/gsap';
import { gsap } from 'gsap';
import { ChevronLeft, Home } from 'lucide-react';
import TransitionOverlay from '@/components/ui/transition-overlay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GalleryFilters from './gallery-filters';
import GalleryGrid from './gallery-grid';
import { GalleryImage } from '@/types/gallery';

// Gallery categories
const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Cities', 'Nature', 'Architecture'];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const { containerRef } = useLocomotiveScroll();
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [showOverlay, setShowOverlay] = useState(true);

  // Entrance animation
  useGSAP(() => {
    // Initial state for elements
    gsap.set([titleRef.current, '.gallery-filters', '.gallery-grid'], {
      opacity: 0,
      y: 20
    });

    // Create timeline for content animation
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      delay: 0.2 // Small delay to ensure overlay is fading out
    });

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4
    })
    .to('.gallery-filters', {
      opacity: 1,
      y: 0,
      duration: 0.3
    }, '-=0.2')
    .to('.gallery-grid', {
      opacity: 1,
      y: 0,
      duration: 0.3
    }, '-=0.2');

    // Start fading out the overlay
    setTimeout(() => setShowOverlay(false), 100);
  }, []);

  useEffect(() => {
    // Simulate fetching images from an API
    const fetchImages = async () => {
      // In a real app, you would fetch from an API
      const galleryImages: GalleryImage[] = [
        {
          id: 1,
          src: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg",
          alt: "Beach with palm trees",
          location: "Bali, Indonesia",
          category: "Beaches",
          width: 1200,
          height: 800
        },
        {
          id: 2,
          src: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
          alt: "Mountain landscape",
          location: "Swiss Alps, Switzerland",
          category: "Mountains",
          width: 800,
          height: 1200
        },
        {
          id: 3,
          src: "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg",
          alt: "City skyline",
          location: "Tokyo, Japan",
          category: "Cities",
          width: 1200,
          height: 900
        },
        {
          id: 4,
          src: "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg",
          alt: "Nature landscape",
          location: "Yosemite, USA",
          category: "Nature",
          width: 1000,
          height: 1400
        },
        {
          id: 5,
          src: "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg",
          alt: "Historic architecture",
          location: "Rome, Italy",
          category: "Architecture",
          width: 1200,
          height: 800
        },
        {
          id: 6,
          src: "https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg",
          alt: "Tropical beach",
          location: "Maldives",
          category: "Beaches",
          width: 1200,
          height: 900
        },
        {
          id: 7,
          src: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
          alt: "Mountain range",
          location: "Himalayas, Nepal",
          category: "Mountains",
          width: 1200,
          height: 800
        },
        {
          id: 8,
          src: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg",
          alt: "City street",
          location: "New York, USA",
          category: "Cities",
          width: 800,
          height: 1200
        },
        {
          id: 9,
          src: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
          alt: "Forest landscape",
          location: "Black Forest, Germany",
          category: "Nature",
          width: 1200,
          height: 800
        }
      ];
      
      setImages(galleryImages);
    };

    fetchImages();
  }, []);

  // Filter images by category
  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(image => image.category === selectedCategory);

  return (
    <div 
      ref={containerRef as React.MutableRefObject<HTMLDivElement | null>}
      className="min-h-screen bg-background text-foreground"
      data-scroll-container
    >
      {showOverlay && (
        <TransitionOverlay
          isPresent={false}
          color="rgb(15 23 42 / 0.98)"
          onAnimationComplete={() => setShowOverlay(false)}
        />
      )}
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <Button variant="secondary" size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 
            ref={titleRef}
            className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-center opacity-0"
          >
            Discover Beautiful Destinations
          </h1>
          
          <div className="gallery-filters">
            <GalleryFilters 
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-7xl gallery-grid">
          <GalleryGrid images={filteredImages} />
        </div>
      </section>

      {/* Floating Home Button */}
      <Link href="/" className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-white/90 backdrop-blur-sm"
          aria-label="Go to homepage"
        >
          <Home className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default GalleryPage;