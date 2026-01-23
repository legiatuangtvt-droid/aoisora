'use client';

import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  fallbackSrc?: string;
  aspectRatio?: string; // e.g., "16/9", "1/1", "4/3"
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage - Image component with lazy loading and placeholder support
 *
 * Features:
 * - Native lazy loading (loading="lazy")
 * - Intersection Observer for better control
 * - Blur placeholder while loading
 * - Error fallback image
 * - Fade-in animation on load
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  fallbackSrc = '/images/placeholder.png',
  aspectRatio,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use Intersection Observer for better lazy loading control
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${placeholderClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* Actual image - only render src when in view */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            ${className}
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
    </div>
  );
}

/**
 * LazyImageSimple - Simpler version using just native lazy loading
 * Use this for images that don't need fancy loading states
 */
export function LazyImageSimple({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.png',
}: Omit<LazyImageProps, 'placeholderClassName' | 'aspectRatio' | 'onLoad' | 'onError'>) {
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

/**
 * LazyThumbnail - Optimized for small thumbnail images
 * Includes blur-up effect from low-quality placeholder
 */
interface LazyThumbnailProps extends LazyImageProps {
  lowQualitySrc?: string;
}

export function LazyThumbnail({
  src,
  alt,
  className = '',
  lowQualitySrc,
  fallbackSrc = '/images/placeholder.png',
}: LazyThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div className="relative overflow-hidden">
      {/* Low quality placeholder (blur up effect) */}
      {lowQualitySrc && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt=""
          aria-hidden="true"
          className={`${className} filter blur-sm scale-105`}
        />
      )}

      {/* Skeleton placeholder if no low quality src */}
      {!lowQualitySrc && !isLoaded && (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse`} />
      )}

      {/* Full quality image */}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          ${className}
          ${lowQualitySrc ? 'absolute inset-0' : ''}
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </div>
  );
}
