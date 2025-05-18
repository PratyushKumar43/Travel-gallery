"use client";

import React, { useState, memo, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { GalleryImage } from '@/types/gallery';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  image: GalleryImage;
  onClick: (image: GalleryImage, cardRef: HTMLDivElement) => void;
  className?: string;
}

const ImageCard = memo(({ image, onClick, className }: ImageCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Debounce hover state changes to reduce unnecessary re-renders
    const debouncedSetHover = useMemo(
      () => {
        let timeoutId: NodeJS.Timeout;
        return (value: boolean) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => setIsHovered(value), 50);
        };
      },
      []
    );



    return (
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-lg shadow-md cursor-pointer bg-card",
          className
        )}
        onMouseEnter={() => debouncedSetHover(true)}
        onMouseLeave={() => debouncedSetHover(false)}
        onClick={(e) => onClick(image, e.currentTarget)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={image.src}
            alt={image.alt}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={75}
            priority={false}
            decoding="async"
            fetchPriority="auto"
            style={{ willChange: 'transform' }}
          />
          
          {/* Location overlay */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0.9,
              y: 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="flex items-center gap-2"
              role="region"
              aria-label={`Location: ${image.location}`}
            >
              <MapPin className="h-4 w-4 text-white drop-shadow-sm" />
              <span className="text-white text-sm font-semibold tracking-wide drop-shadow-sm">
                {image.location}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

ImageCard.displayName = 'ImageCard';

export default ImageCard;