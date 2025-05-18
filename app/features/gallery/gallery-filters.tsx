"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

interface GalleryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const GalleryFilters = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: GalleryFiltersProps) => {
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersRef.current) return;
    
    const filters = filtersRef.current.querySelectorAll('button');
    
    gsap.fromTo(
      filters,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.5
      }
    );
  }, []);

  return (
    <div 
      ref={filtersRef}
      className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8"
      data-scroll
      data-scroll-speed="1"
    >
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className="rounded-full px-5 py-2 transition-all duration-300"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default GalleryFilters;