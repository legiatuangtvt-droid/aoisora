'use client';

import { useEffect, useState, useRef } from 'react';

interface FlipCardProps {
  value: string;
  prevValue: string;
}

function FlipCard({ value, prevValue }: FlipCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="relative w-10 h-14 perspective-500">
      {/* Static bottom half (shows new value) */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
          <span className="font-mono text-2xl font-bold text-emerald-400">{value}</span>
        </div>
        {/* Top half mask */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-700 to-gray-800 flex items-end justify-center overflow-hidden rounded-t-lg">
          <span className="font-mono text-2xl font-bold text-emerald-400 translate-y-1/2">{value}</span>
        </div>
        {/* Bottom half mask */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-800 to-gray-900 flex items-start justify-center overflow-hidden rounded-b-lg">
          <span className="font-mono text-2xl font-bold text-emerald-400 -translate-y-1/2">{value}</span>
        </div>
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-950/50" />
      </div>

      {/* Flipping top card (shows old value, flips down) */}
      {isFlipping && (
        <div
          className="absolute top-0 left-0 right-0 h-1/2 origin-bottom rounded-t-lg overflow-hidden animate-flip-top"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 flex items-end justify-center">
            <span className="font-mono text-2xl font-bold text-emerald-400 translate-y-1/2">{prevValue}</span>
          </div>
        </div>
      )}

      {/* Flipping bottom card (shows new value, flips up) */}
      {isFlipping && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 origin-top rounded-b-lg overflow-hidden animate-flip-bottom"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 flex items-start justify-center">
            <span className="font-mono text-2xl font-bold text-emerald-400 -translate-y-1/2">{value}</span>
          </div>
        </div>
      )}

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}

export default function FlipClock() {
  const [time, setTime] = useState(new Date());
  const prevTimeRef = useRef(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      prevTimeRef.current = time;
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const prevHours = prevTimeRef.current.getHours().toString().padStart(2, '0');
  const prevMinutes = prevTimeRef.current.getMinutes().toString().padStart(2, '0');
  const prevSeconds = prevTimeRef.current.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {/* Hours */}
      <div className="flex gap-0.5">
        <FlipCard value={hours[0]} prevValue={prevHours[0]} />
        <FlipCard value={hours[1]} prevValue={prevHours[1]} />
      </div>

      {/* Separator */}
      <div className="flex flex-col gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Minutes */}
      <div className="flex gap-0.5">
        <FlipCard value={minutes[0]} prevValue={prevMinutes[0]} />
        <FlipCard value={minutes[1]} prevValue={prevMinutes[1]} />
      </div>

      {/* Separator */}
      <div className="flex flex-col gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Seconds */}
      <div className="flex gap-0.5">
        <FlipCard value={seconds[0]} prevValue={prevSeconds[0]} />
        <FlipCard value={seconds[1]} prevValue={prevSeconds[1]} />
      </div>
    </div>
  );
}
