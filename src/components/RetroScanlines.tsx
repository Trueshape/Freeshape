import React, { useState, useEffect } from 'react';

export default function RetroScanlines() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format like: "01:23:45"
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Horizontal Scanlines traveling across the screen */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent h-[10px] w-full animate-scanlines opacity-40"></div>
        
        {/* Subtle overlay lines pattern */}
        <div 
          className="absolute inset-0 opacity-[0.12]" 
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px)'
          }}
        ></div>
        
        {/* CRT flicker effect */}
        <div className="absolute inset-0 pointer-events-none bg-indigo-500/5 mix-blend-color-dodge animate-crt-flicker"></div>
      </div>

      {/* VHS OSD (On-Screen Display) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 p-4 font-mono text-[11px] md:text-sm tracking-widest text-[#00ffff] select-none uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex justify-between items-start">
        {/* Left corner: PLAY status */}
        <div className="flex flex-col gap-1 items-start bg-black/60 px-2 py-1 border border-[#ff007f]/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse inline-block"></span>
            <span>PLAY  ▶</span>
          </div>
          <div className="text-xs text-[#ff007f]">SP MODE</div>
        </div>

        {/* Right corner: Date / Time stamp */}
        <div className="flex flex-col gap-1 items-end bg-black/60 px-2 py-1 border border-[#ff007f]/40">
          <div>12 LUGLIO 2026</div>
          <div className="font-bold text-[#00ffff] tabular-nums">{currentTime || '00:00:00'}</div>
          <div className="text-[9px] text-[#ff007f]">TRACKING OK</div>
        </div>
      </div>

      {/* Bottom corner tracking noise line */}
      <div className="pointer-events-none fixed bottom-0 inset-x-0 h-4 z-40 bg-[#120024] opacity-25 animate-vhs-glitch border-t border-[#00ffff]/20"></div>
    </>
  );
}
