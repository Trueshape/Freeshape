import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Giveaway, ThemeConfig } from '../types';
import { 
  ExternalLink, 
  Users, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  Sparkles, 
  Monitor, 
  Info,
  Clock,
  Smartphone,
  Gamepad2
} from 'lucide-react';

interface CountdownTimerProps {
  endDateStr: string;
}

function CountdownTimer({ endDateStr }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!endDateStr || endDateStr === 'N/A') {
        return 'No expiry';
      }

      let targetTime = Date.parse(endDateStr);
      if (isNaN(targetTime)) {
        const formatted = endDateStr.replace(/-/g, '/');
        targetTime = Date.parse(formatted);
      }

      if (isNaN(targetTime)) {
        return `Expires on: ${endDateStr.split(' ')[0]}`;
      }

      const diffMs = targetTime - Date.now();

      if (diffMs <= 0) {
        return 'Expired';
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      return `${parts.join(' ')}`;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endDateStr]);

  if (timeLeft === 'Expired') {
    return (
      <div className="flex items-center gap-1 text-red-500/80 font-mono font-semibold">
        <Clock size={12} />
        <span>Expired</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-red-500 font-bold font-mono">
      <Clock size={12} className="animate-pulse shrink-0" />
      <span>Expires in: {timeLeft}</span>
    </div>
  );
}

interface GiveawayCardProps {
  key?: any;
  giveaway: Giveaway;
  currentTheme: ThemeConfig;
  index: number;
  viewMode?: 'grid' | 'list' | 'minimal';
  activePlatformFilter?: string;
}

export default function GiveawayCard({ giveaway, currentTheme, index, viewMode = 'grid', activePlatformFilter = 'all' }: GiveawayCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const isVhs = currentTheme.id === 'vhs80s';
  const isXboxGamePassCore = giveaway.platforms?.toLowerCase().includes('xbox game pass core');
  const buttonText = isXboxGamePassCore ? 'PLAY NOW' : 'CLAIM NOW';

  const getPlatformBadgeClass = (plat: string) => {
    const pLower = plat.toLowerCase();
    if (isVhs) {
      if (pLower.includes('playstation plus')) {
        return 'bg-black text-[#00ffff] border border-[#00ffff] font-extrabold shadow-[0_0_8px_rgba(0,255,255,0.4)] px-1.5 py-0.5';
      }
      if (pLower.includes('xbox game pass')) {
        return 'bg-black text-[#39ff14] border border-[#39ff14] font-extrabold shadow-[0_0_8px_rgba(57,255,20,0.4)] px-1.5 py-0.5';
      }
      return 'bg-black text-[#ff007f] border border-[#ff007f]/40 px-1.5 py-0.5';
    }

    if (pLower.includes('playstation plus')) {
      return 'bg-blue-600/95 text-white font-extrabold shadow-[0_0_8px_rgba(30,144,255,0.4)] rounded px-1.5 py-0.5';
    }
    if (pLower.includes('xbox game pass')) {
      return 'bg-emerald-600 text-white font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.4)] rounded px-1.5 py-0.5';
    }
    
    return 'bg-stone-200/50 text-stone-700 dark:bg-slate-800 dark:text-slate-300 rounded px-1.5 py-0.5';
  };

  // Format type name to English
  const formatType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'game': return 'Game';
      case 'dlc': return 'DLC';
      case 'loot': return 'Loot';
      case 'beta': return 'Beta';
      case 'early access': return 'Early Access';
      default: return type;
    }
  };

  // Select badge class based on type
  const getBadgeClass = (type: string) => {
    if (type.toLowerCase() === 'early access') {
      return currentTheme.badgeClass.EarlyAccess;
    }
    const key = type as keyof typeof currentTheme.badgeClass;
    return currentTheme.badgeClass[key] || currentTheme.badgeClass.default;
  };

  // Handle original value formatting
  const renderWorth = () => {
    const value = giveaway.worth;
    if (!value || value === 'N/A' || value.toUpperCase() === 'FREE') {
      return (
        <span className={`text-xs font-extrabold px-2 py-0.5 font-mono rounded ${
          isVhs ? 'bg-black text-[#00ffff] border border-[#00ffff]' : 'bg-stone-100 text-stone-600'
        }`}>
          FREE
        </span>
      );
    }
    
    return (
      <div className="flex items-center gap-1.5">
        <span className="line-through text-xs opacity-60 font-mono">
          {value}
        </span>
        <span className={`text-xs font-extrabold px-2 py-0.5 font-mono ${
          isVhs ? 'bg-[#ff007f] text-white border border-[#ff007f]' : 'bg-red-500 text-white rounded'
        }`}>
          100% OFF
        </span>
      </div>
    );
  };

  // Helper to remove redundant platform and giveaway words from title
  const cleanTitle = (title: string, platforms: string) => {
    let cleaned = title;

    // First remove any parenthesized or bracketed parts containing platform keywords or giveaway jargon
    cleaned = cleaned.replace(/\s*[\(\[][^\]\)]*(steam|epic|gog|pc|key|giveaway|loot|ps4|ps5|xbox|playstation|switch|nintendo|android|ios|itch|ubisoft|origin|ea|drm-free|game|pack|beta|dlc|free|bundle)[^\]\)*]*[\)\]]/gi, '');

    const wordsToRemove = [
      /\bgiveaways?\b/gi,
      /\bfree(bies?)?\b/gi,
      /\bkeys?\b/gi,
      /\bloots?\b/gi,
      /\bpromo(tion)?s?\b/gi,
      /\bearly access\b/gi,
      /\bpacks?\b/gi,
      /\bbetas?\b/gi,
      /\bdlcs?\b/gi,
      /\bbundles?\b/gi,
      /\bsteam\b/gi,
      /\bepic games store\b/gi,
      /\bepic games\b/gi,
      /\bepic\b/gi,
      /\bgog\b/gi,
      /\bubisoft\b/gi,
      /\borigin\b/gi,
      /\bitch\.io\b/gi,
      /\bplaystation\b/gi,
      /\bxbox\b/gi,
      /\bnintendo\b/gi,
      /\bandroid\b/gi,
      /\bios\b/gi,
      /\bon\s+steam\b/gi,
      /\bon\s+epic\b/gi,
      /\bon\s+gog\b/gi,
      /\bon\s+ubisoft\b/gi,
      /\bfor\s+steam\b/gi,
      /\bfor\s+epic\b/gi,
      /\bfor\s+pc\b/gi,
      /\bpc\s+key\b/gi,
      /\bpc\s+giveaway\b/gi,
    ];

    if (platforms) {
      const plats = platforms.split(',').map(p => p.trim());
      plats.forEach(p => {
        if (p.length > 2) {
          const regex = new RegExp('\\b' + p.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
          cleaned = cleaned.replace(regex, '');
        }
      });
    }

    wordsToRemove.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });

    cleaned = cleaned
      .replace(/\(\s*\)/g, '')
      .replace(/\[\s*\]/g, '')
      .replace(/-\s*-/g, '-')
      .replace(/\s+/g, ' ')
      .trim();

    cleaned = cleaned.replace(/^[\s\-\|:\(\)\[\]]+|[\s\-\|:\(\)\[\]]+$/g, '').trim();

    return cleaned || title;
  };

  // Helper to get platform icon based on active filter and the giveaway's platforms
  const getPlatformIcon = (platformsStr: string, activeFilter: string = 'all') => {
    const lowerPlatforms = platformsStr.toLowerCase();
    const lowerFilter = activeFilter.toLowerCase();

    // 1. If activeFilter is a specific platform (not 'all'), use the corresponding icon
    if (lowerFilter !== 'all') {
      if (['pc', 'steam', 'epic', 'gog', 'drm-free', 'itch'].includes(lowerFilter)) {
        return <Monitor size={14} className="text-blue-400 shrink-0" title={platformsStr} />;
      }
      if (['playstation', 'xbox', 'switch'].includes(lowerFilter)) {
        return <Gamepad2 size={14} className="text-indigo-400 shrink-0" title={platformsStr} />;
      }
      if (['android', 'ios'].includes(lowerFilter)) {
        return <Smartphone size={14} className="text-emerald-400 shrink-0" title={platformsStr} />;
      }
    }

    // 2. If filtered for 'all' (or no filter specified)
    // Identify which categories are present in the giveaway's platforms
    const hasPC = lowerPlatforms.includes('pc') || 
                  lowerPlatforms.includes('steam') || 
                  lowerPlatforms.includes('epic') || 
                  lowerPlatforms.includes('gog') || 
                  lowerPlatforms.includes('itch.io') ||
                  lowerPlatforms.includes('drm-free') ||
                  lowerPlatforms.includes('ubisoft') ||
                  lowerPlatforms.includes('origin') ||
                  lowerPlatforms.includes('ea app');
                  
    const hasConsole = lowerPlatforms.includes('playstation') || 
                      lowerPlatforms.includes('ps4') || 
                      lowerPlatforms.includes('ps5') || 
                      lowerPlatforms.includes('xbox') || 
                      lowerPlatforms.includes('switch') ||
                      lowerPlatforms.includes('nintendo');
                      
    const hasMobile = lowerPlatforms.includes('android') || 
                     lowerPlatforms.includes('ios') ||
                     lowerPlatforms.includes('apple');

    // Count how many categories are supported
    const categoriesCount = (hasPC ? 1 : 0) + (hasConsole ? 1 : 0) + (hasMobile ? 1 : 0);

    // If it's for multiple platform categories, use a generic icon (Gamepad2 in neutral stone/gray/current style)
    if (categoriesCount > 1) {
      return <Gamepad2 size={14} className="text-stone-400 shrink-0" title={platformsStr} />;
    }

    // If single category, use its specific icon
    if (hasPC) {
      return <Monitor size={14} className="text-blue-400 shrink-0" title={platformsStr} />;
    }
    if (hasConsole) {
      return <Gamepad2 size={14} className="text-indigo-400 shrink-0" title={platformsStr} />;
    }
    if (hasMobile) {
      return <Smartphone size={14} className="text-emerald-400 shrink-0" title={platformsStr} />;
    }

    // Fallback generic icon
    return <Gamepad2 size={14} className="text-stone-400 shrink-0" title={platformsStr} />;
  };

  // Convert platform tags into readable list or icons
  const getPlatformList = (platformsStr: string) => {
    return platformsStr.split(',').map(p => p.trim());
  };

  const cleanedTitle = cleanTitle(giveaway.title, giveaway.platforms);

  if (viewMode === 'minimal') {
    return (
      <motion.article
        initial={isVhs ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isVhs ? 0 : 0.2, delay: isVhs ? 0 : Math.min(index * 0.02, 0.2) }}
        whileHover={{ scale: 1.012, zIndex: 10 }}
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 relative ${currentTheme.cardClass}`}
        id={`giveaway-card-${giveaway.id}`}
      >
        {/* Left Side: Logo, Title & Expiration side-by-side */}
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 min-w-0">
            {getPlatformIcon(giveaway.platforms, activePlatformFilter)}
            <h3 className={`text-xs sm:text-sm md:text-base font-bold leading-snug truncate ${
              isVhs ? 'text-[#00ffff]' : 'text-current'
            } ${currentTheme.titleFontFamily}`} title={cleanedTitle}>
              {cleanedTitle}
            </h3>
          </div>
          
          {/* Expiration beside the Title */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
            {giveaway.end_date && giveaway.end_date !== 'N/A' ? (
              <CountdownTimer endDateStr={giveaway.end_date} />
            ) : (
              <div className={`flex items-center gap-1 opacity-65 ${currentTheme.textMutedClass}`}>
                <Calendar size={11} />
                <span>No expiry</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Claim Button (No icon on the right) */}
        <div className="shrink-0 sm:w-44 w-full">
          <a
            href={giveaway.open_giveaway_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${currentTheme.buttonPrimaryClass} py-1.5 px-3 text-xs`}
          >
            <span className="flex items-center justify-center w-full font-bold">
              {buttonText}
            </span>
          </a>
        </div>
      </motion.article>
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.article
        initial={isVhs ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isVhs ? 0 : 0.3, delay: isVhs ? 0 : Math.min(index * 0.04, 0.3) }}
        whileHover={{ scale: 1.012, zIndex: 10 }}
        className={`flex flex-col md:flex-row overflow-hidden relative ${currentTheme.cardClass}`}
        id={`giveaway-card-${giveaway.id}`}
      >
        {/* Card Image Cover with Type Badge Overlay */}
        <div className="relative aspect-[16/9] md:aspect-auto md:w-56 overflow-hidden bg-black/20 shrink-0">
          <img
            src={giveaway.image || giveaway.thumbnail}
            alt={cleanedTitle}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
            loading="lazy"
          />
          
          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={getBadgeClass(giveaway.type)}>
              {formatType(giveaway.type)}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col md:flex-row flex-1 gap-4 justify-between">
          {/* Details Column */}
          <div className="flex-1 flex flex-col gap-2">
            <h3 className={`text-sm md:text-base font-bold leading-snug ${
              isVhs ? 'text-[#00ffff]' : 'text-current'
            } ${currentTheme.titleFontFamily}`}>
              {cleanedTitle}
            </h3>

            {/* Platforms row */}
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-50 mr-1 flex items-center gap-1 font-mono">
                <Monitor size={10} /> Platforms:
              </span>
              {getPlatformList(giveaway.platforms).map((plat, i) => (
                <span 
                  key={i} 
                  className={`text-[9px] font-semibold font-mono ${getPlatformBadgeClass(plat)}`}
                >
                  {plat}
                </span>
              ))}
            </div>

            {/* Description text */}
            <p className={`text-xs leading-relaxed ${currentTheme.textMutedClass}`}>
              {giveaway.description}
            </p>

            {/* Dates and claim window status */}
            <div className={`flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono py-1.5 border-y border-stone-200/20 ${currentTheme.textMutedClass} mt-1`}>
              {giveaway.end_date && giveaway.end_date !== 'N/A' ? (
                <CountdownTimer endDateStr={giveaway.end_date} />
              ) : (
                <div className="flex items-center gap-1 opacity-65">
                  <Calendar size={11} />
                  <span>No expiry</span>
                </div>
              )}
            </div>

            {/* Price/Worth section in place of instructions */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-50 font-mono">Value:</span>
              {renderWorth()}
            </div>

            {/* Expanding claimed instructions toggler */}
            {giveaway.instructions && giveaway.instructions !== 'N/A' && (
              <div className="w-full">
                <div className="border-t mt-0.5 mb-1 border-stone-200/20" />
                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className={`w-full flex items-center justify-between text-[11px] font-semibold py-0.5 px-1 opacity-85 hover:opacity-100 transition-opacity cursor-pointer ${
                    isVhs ? 'font-mono text-[#00ffff] mt-0.5' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Info size={11} />
                    Redemption Instructions
                  </span>
                  {showInstructions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                
                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: isVhs ? 0 : 0.2 }}
                    className={`text-[10px] mt-1.5 p-2 rounded-lg border leading-relaxed overflow-hidden font-mono ${
                      isVhs 
                        ? 'bg-black text-[#ff007f] border-[#ff007f]/40 rounded-none' 
                        : 'bg-stone-50/50 text-stone-600 border-stone-100 dark:bg-slate-900/40 dark:border-slate-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {giveaway.instructions}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Claim Button Column */}
          <div className="md:w-44 shrink-0 flex flex-col justify-center items-stretch md:items-end border-t md:border-t-0 md:border-l border-stone-200/10 pt-3 md:pt-0 md:pl-4">
            <div className="w-full">
              <a
                href={giveaway.open_giveaway_url}
                target="_blank"
                rel="noopener noreferrer"
                className={currentTheme.buttonPrimaryClass}
              >
                <span className="flex items-center justify-center w-full font-bold">
                  {buttonText}
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={isVhs ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isVhs ? 0 : 0.4, delay: isVhs ? 0 : Math.min(index * 0.05, 0.4) }}
      whileHover={{ scale: 1.012, zIndex: 10 }}
      className={`flex flex-col h-full overflow-hidden relative ${currentTheme.cardClass}`}
      id={`giveaway-card-${giveaway.id}`}
    >
      {/* Card Image Cover with Type Badge Overlay */}
      <div className="relative aspect-[16/9] overflow-hidden bg-black/20 shrink-0">
        <img
          src={giveaway.image || giveaway.thumbnail}
          alt={cleanedTitle}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover select-none transition-transform duration-500 ${
            isVhs ? '' : 'hover:scale-105'
          }`}
          loading="lazy"
        />
        
        {/* Type Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={getBadgeClass(giveaway.type)}>
            {formatType(giveaway.type)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 md:p-3.5 flex flex-col flex-1 gap-2">
        {/* Title row */}
        <div className="flex justify-between items-start gap-2">
          <h3 className={`text-sm md:text-base font-bold leading-snug line-clamp-2 shrink-0 flex-1 ${
            isVhs ? 'text-[#00ffff]' : 'text-current'
          } ${currentTheme.titleFontFamily}`}>
            {cleanedTitle}
          </h3>
        </div>

        {/* Platforms row */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-[9px] uppercase font-bold tracking-wider opacity-50 mr-1 flex items-center gap-1 font-mono">
            <Monitor size={10} /> Platforms:
          </span>
          {getPlatformList(giveaway.platforms).map((plat, i) => (
            <span 
              key={i} 
              className={`text-[9px] font-semibold font-mono ${getPlatformBadgeClass(plat)}`}
            >
              {plat}
            </span>
          ))}
        </div>

        {/* Description text */}
        <p className={`text-xs line-clamp-2 leading-relaxed flex-1 ${currentTheme.textMutedClass}`}>
          {giveaway.description}
        </p>

        {/* Dates and claim window status */}
        <div className={`flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono py-1.5 border-y border-stone-200/20 ${currentTheme.textMutedClass}`}>
          {giveaway.end_date && giveaway.end_date !== 'N/A' ? (
            <CountdownTimer endDateStr={giveaway.end_date} />
          ) : (
            <div className="flex items-center gap-1 opacity-65">
              <Calendar size={11} />
              <span>No expiry</span>
            </div>
          )}
        </div>

        {/* Price/Worth section in place of instructions */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[9px] uppercase font-bold tracking-wider opacity-50 font-mono">Value:</span>
          {renderWorth()}
        </div>

        {/* Expanding claimed instructions toggler */}
        {giveaway.instructions && giveaway.instructions !== 'N/A' && (
          <div className="w-full">
            <div className="border-t mt-0.5 mb-1 border-stone-200/20" />
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className={`w-full flex items-center justify-between text-[11px] font-semibold py-0.5 px-1 opacity-85 hover:opacity-100 transition-opacity cursor-pointer ${
                isVhs ? 'font-mono text-[#00ffff] mt-0.5' : ''
              }`}
            >
              <span className="flex items-center gap-1">
                <Info size={11} />
                Istruzioni per riscattare
              </span>
              {showInstructions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: isVhs ? 0 : 0.2 }}
                className={`text-[10px] mt-1.5 p-2 rounded-lg border leading-relaxed overflow-hidden font-mono ${
                  isVhs 
                    ? 'bg-black text-[#ff007f] border-[#ff007f]/40 rounded-none' 
                    : 'bg-stone-50/50 text-stone-600 border-stone-100 dark:bg-slate-900/40 dark:border-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {giveaway.instructions}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-1.5 pt-0.5">
          <a
            href={giveaway.open_giveaway_url}
            target="_blank"
            rel="noopener noreferrer"
            className={currentTheme.buttonPrimaryClass}
          >
            <span className="flex items-center justify-center font-bold">
              {buttonText}
            </span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
