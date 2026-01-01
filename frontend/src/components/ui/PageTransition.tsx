'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Fade out
    setIsVisible(false);

    // After fade out, update children and fade in
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`transition-opacity duration-150 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {displayChildren}
    </div>
  );
}
