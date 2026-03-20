import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  beforeUrl: string;
  afterUrl: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeUrl, afterUrl }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent | any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relativeX = x - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = () => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = () => {
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchEnd = () => {
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl cursor-col-resize select-none border-2 md:border-4 border-white mx-auto"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After Image (Background) */}
      <img
        src={afterUrl}
        alt="After"
        className="absolute inset-0 w-full h-full object-contain bg-premium-100"
      />

      {/* Before Image (Foreground with Clip) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeUrl}
          alt="Before"
          className="absolute inset-0 w-full h-full object-contain bg-premium-100"
          style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: 'none' }}
        />
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/40 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          Original
        </div>
      </div>

      <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-premium-700/60 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
        Enhanced
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 md:border-4 border-premium-100">
          <div className="flex gap-1">
            <div className="w-0.5 h-2.5 md:w-1 md:h-3 bg-premium-300 rounded-full"></div>
            <div className="w-0.5 h-2.5 md:w-1 md:h-3 bg-premium-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
