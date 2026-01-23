'use client';

import { useRef, useState, useEffect, useMemo, ReactNode, CSSProperties } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactNode;
  overscan?: number; // Number of items to render above/below visible area
  containerHeight?: number; // Fixed height, or calculated from parent
  className?: string;
  getItemKey?: (item: T, index: number) => string | number;
}

/**
 * VirtualList - Efficient list rendering for large datasets
 *
 * Only renders items visible in the viewport plus overscan buffer.
 * Use this when rendering 100+ items where scroll performance matters.
 *
 * Note: For most paginated lists (15-50 items), regular rendering is fine.
 *
 * Usage:
 * <VirtualList
 *   items={stores}
 *   itemHeight={60}
 *   renderItem={(store, index, style) => (
 *     <div key={store.id} style={style}>
 *       <StoreRow store={store} />
 *     </div>
 *   )}
 * />
 */
export default function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 3,
  containerHeight,
  className = '',
  getItemKey,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(containerHeight || 400);

  // Update container height on resize
  useEffect(() => {
    if (containerHeight) {
      setHeight(containerHeight);
      return;
    }

    const updateHeight = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          setHeight(parent.clientHeight);
        }
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [containerHeight]);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate visible items
  const { visibleItems, startIndex, totalHeight } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + height) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex).map((item, i) => ({
      item,
      index: startIndex + i,
    }));

    return { visibleItems, startIndex, totalHeight };
  }, [items, itemHeight, scrollTop, height, overscan]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight || '100%' }}
    >
      {/* Total height spacer for proper scrollbar */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index }) => {
          const style: CSSProperties = {
            position: 'absolute',
            top: index * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          };

          const key = getItemKey ? getItemKey(item, index) : index;

          return (
            <div key={key} style={style}>
              {renderItem(item, index, {})}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * SimpleVirtualTable - Virtual scrolling for table rows
 *
 * Wraps table body with virtual scrolling while keeping headers visible.
 */
interface VirtualTableProps<T> {
  items: T[];
  rowHeight: number;
  maxHeight: number;
  renderRow: (item: T, index: number) => ReactNode;
  getRowKey?: (item: T, index: number) => string | number;
  className?: string;
}

export function VirtualTable<T>({
  items,
  rowHeight,
  maxHeight,
  renderRow,
  getRowKey,
  className = '',
}: VirtualTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const { visibleItems, totalHeight } = useMemo(() => {
    const totalHeight = items.length * rowHeight;
    const overscan = 3;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + maxHeight) / rowHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex).map((item, i) => ({
      item,
      index: startIndex + i,
      offset: (startIndex + i) * rowHeight,
    }));

    return { visibleItems, totalHeight, startIndex };
  }, [items, rowHeight, scrollTop, maxHeight]);

  // If items fit without scrolling, render normally
  if (items.length * rowHeight <= maxHeight) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={getRowKey ? getRowKey(item, index) : index}>
            {renderRow(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ maxHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, offset }) => (
          <div
            key={getRowKey ? getRowKey(item, index) : index}
            style={{
              position: 'absolute',
              top: offset,
              left: 0,
              right: 0,
              height: rowHeight,
            }}
          >
            {renderRow(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * useVirtualization hook - For custom virtualization needs
 *
 * Returns calculated start/end indices for visible items.
 */
export function useVirtualization(
  totalItems: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan: number = 3
) {
  return useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      totalItems,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    const visibleCount = endIndex - startIndex;
    const totalHeight = totalItems * itemHeight;
    const offsetTop = startIndex * itemHeight;

    return {
      startIndex,
      endIndex,
      visibleCount,
      totalHeight,
      offsetTop,
    };
  }, [totalItems, itemHeight, containerHeight, scrollTop, overscan]);
}
