import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEMES } from '../themes';
import { ThemeType, ThemeConfig } from '../types';
import { Palette, ChevronDown, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onThemeChange: (themeId: ThemeType) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute theme-specific styles for the button and list
  const isVhs = currentTheme.id === 'vhs80s';
  const isCyber = currentTheme.id === 'cyber';
  const isSunset = currentTheme.id === 'sunset';
  
  let buttonStyle = '';
  let listStyle = '';
  let itemHoverStyle = '';
  let activeItemStyle = '';

  if (isVhs) {
    buttonStyle = 'bg-black border border-[#ff007f] text-[#00ffff] font-mono rounded-none uppercase px-3 py-1.5 tracking-widest flex items-center gap-2 hover:bg-[#ff007f] hover:text-white transition-colors cursor-pointer text-xs';
    listStyle = 'bg-black border-2 border-[#ff007f] rounded-none p-0.5 shadow-brutalist-vhs z-30 min-w-[180px] md:min-w-[200px]';
    itemHoverStyle = 'hover:bg-[#00ffff] hover:text-black rounded-none';
    activeItemStyle = 'bg-[#ff007f] text-white';
  } else if (isCyber) {
    buttonStyle = 'bg-[#1f2833]/90 border border-[#45f3ff]/30 text-[#45f3ff] rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-[#45f3ff] hover:bg-[#1f2833] shadow-[0_0_10px_rgba(69,243,255,0.1)] transition-all cursor-pointer text-xs';
    listStyle = 'bg-[#1f2833] border border-[#45f3ff]/30 rounded-xl p-1 shadow-[0_0_25px_rgba(0,0,0,0.5)] z-30 min-w-[180px] md:min-w-[200px] backdrop-blur-md';
    itemHoverStyle = 'hover:bg-indigo-500/20 hover:text-[#45f3ff] rounded-lg';
    activeItemStyle = 'bg-indigo-600/40 text-[#45f3ff] border-l-2 border-[#45f3ff]';
  } else if (isSunset) {
    buttonStyle = 'bg-[#fffdfa] border border-stone-200 text-[#e06d53] rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm hover:bg-stone-50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer font-outfit font-bold text-xs';
    listStyle = 'bg-[#fffdfa] border border-stone-200 rounded-xl p-1 shadow-lg z-30 min-w-[180px] md:min-w-[200px]';
    itemHoverStyle = 'hover:bg-amber-50 hover:text-[#e06d53] rounded-lg';
    activeItemStyle = 'bg-[#e06d53]/10 text-[#e06d53] font-bold border-l-4 border-[#e06d53]';
  } else if (currentTheme.id === 'neongreen') {
    buttonStyle = 'bg-zinc-950 border border-emerald-500/30 text-emerald-400 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-emerald-400 transition-all cursor-pointer font-sans text-xs';
    listStyle = 'bg-zinc-950 border border-emerald-500/30 rounded-xl p-1 shadow-md z-30 min-w-[180px] md:min-w-[200px]';
    itemHoverStyle = 'hover:bg-emerald-500/10 hover:text-emerald-300 rounded-lg';
    activeItemStyle = 'bg-emerald-600/10 text-emerald-400 font-semibold border-l-2 border-emerald-500';
  } else if (currentTheme.id === 'space') {
    buttonStyle = 'bg-slate-950/90 border border-cyan-500/30 text-cyan-400 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all cursor-pointer font-sans text-xs';
    listStyle = 'bg-slate-950 border border-cyan-500/30 rounded-xl p-1 shadow-xl z-30 min-w-[180px] md:min-w-[200px] backdrop-blur-md';
    itemHoverStyle = 'hover:bg-purple-500/15 hover:text-cyan-300 rounded-lg';
    activeItemStyle = 'bg-purple-600/20 text-cyan-400 font-semibold border-l-2 border-purple-500';
  } else {
    // Neon Blu / default fallback
    buttonStyle = 'bg-slate-900 border border-blue-500/30 text-blue-400 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-blue-400 transition-all cursor-pointer font-sans text-xs';
    listStyle = 'bg-slate-900 border border-blue-500/30 rounded-xl p-1 shadow-md z-30 min-w-[180px] md:min-w-[200px]';
    itemHoverStyle = 'hover:bg-blue-500/10 hover:text-blue-300 rounded-lg';
    activeItemStyle = 'bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500';
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="theme-select-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Palette size={isVhs ? 14 : 14} />
        <span className={`font-bold flex items-center gap-1.5 ${isVhs ? 'text-[10px]' : 'text-xs'}`}>
          STYLE: {currentTheme.name}
        </span>
        <ChevronDown 
          size={isVhs ? 14 : 14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isVhs ? { opacity: 1, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
            animate={isVhs ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isVhs ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: isVhs ? 0.05 : 0.2 }}
            className={`absolute right-0 mt-2 origin-top-right ${listStyle}`}
          >
            <div className="py-0.5" role="menu" aria-orientation="vertical" aria-labelledby="theme-select-button">
              {Object.values(THEMES).map((theme) => {
                const isSelected = theme.id === currentTheme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id as ThemeType);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 flex items-center gap-2 transition-colors cursor-pointer ${
                      isSelected ? activeItemStyle : 'text-current'
                    } ${itemHoverStyle}`}
                    role="menuitem"
                  >
                    <span className="text-lg shrink-0 select-none">{theme.emoji}</span>
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className={`text-xs font-bold ${
                        isSelected && isVhs ? 'text-white' : ''
                      }`}>
                        {theme.name}
                      </span>
                      {isSelected && <Check size={12} className="shrink-0 text-current ml-2" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
