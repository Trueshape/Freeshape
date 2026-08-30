import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { THEMES } from './themes';
import { Giveaway, ThemeType, Filters } from './types';
import ThemeSelector from './components/ThemeSelector';
import GiveawayFilters from './components/GiveawayFilters';
import GiveawayCard from './components/GiveawayCard';
import RetroScanlines from './components/RetroScanlines';
import NeonBackground from './components/NeonBackground';
import { 
  Sparkles, 
  Gamepad2, 
  RefreshCw, 
  AlertTriangle, 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Gift,
  LayoutGrid,
  List,
  AlignJustify
} from 'lucide-react';

export default function App() {
  // Theme state: Load from localStorage or default to 'cyber'
  const [themeId, setThemeId] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('gamerpower_theme');
    if (saved && Object.keys(THEMES).includes(saved)) {
      return saved as ThemeType;
    }
    return 'cyber';
  });

  const currentTheme = THEMES[themeId];

  // Sync theme selection to localStorage
  const handleThemeChange = (id: ThemeType) => {
    setThemeId(id);
    localStorage.setItem('gamerpower_theme', id);
  };

  // Giveaways data state
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active filters state
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'all',
    platform: 'all',
    sortBy: 'newest',
    sortDirection: 'desc'
  });

  // View mode state (grid, list or minimal)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>(() => {
    const saved = localStorage.getItem('gamerpower_view_mode');
    return (saved === 'list' || saved === 'grid' || saved === 'minimal') ? saved : 'grid';
  });

  const handleViewModeChange = (mode: 'grid' | 'list' | 'minimal') => {
    setViewMode(mode);
    localStorage.setItem('gamerpower_view_mode', mode);
  };

  // Fetch giveaways from proxy endpoint
  const fetchGiveaways = async (showRefreshAnimation = false) => {
    if (showRefreshAnimation) setIsRefreshing(true);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/giveaways');
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setGiveaways(data);
      } else if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(data.details || 'Error from proxy server');
      } else {
        throw new Error('Invalid data format from GamerPower');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to load active giveaways. Please try again later.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGiveaways();
  }, []);

  // Parse original prices to estimate total value/savings
  const getWorthNumeric = (worthStr: string): number => {
    if (!worthStr || worthStr === 'N/A' || worthStr.toUpperCase() === 'FREE') return 0;
    // Extract numbers and decimal point, e.g. "$19.99" -> 19.99
    const num = parseFloat(worthStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Compute stats based on loaded giveaways
  const stats = useMemo(() => {
    let totalSavings = 0;
    let gamesCount = 0;
    let dlcCount = 0;
    let lootCount = 0;
    let betaCount = 0;
    let earlyAccessCount = 0;

    giveaways.forEach((g) => {
      totalSavings += getWorthNumeric(g.worth);
      
      const typeLower = g.type.toLowerCase();
      if (typeLower === 'game') gamesCount++;
      else if (typeLower === 'dlc') dlcCount++;
      else if (typeLower === 'loot') lootCount++;
      else if (typeLower === 'beta') betaCount++;
      else if (typeLower === 'early access') earlyAccessCount++;
    });

    return {
      totalSavings: Math.round(totalSavings),
      gamesCount,
      dlcCount,
      lootCount,
      betaCount,
      earlyAccessCount
    };
  }, [giveaways]);

  // Client-side search, filtering and sorting
  const filteredGiveaways = useMemo(() => {
    let result = [...giveaways];

    // 1. Search Filter (by title or description)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
      );
    }

    // 2. Type Filter
    if (filters.type !== 'all') {
      if (filters.type === 'dlc_loot') {
        result = result.filter((g) => g.type.toLowerCase() === 'dlc' || g.type.toLowerCase() === 'loot');
      } else if (filters.type === 'beta_early') {
        result = result.filter((g) => g.type.toLowerCase() === 'beta' || g.type.toLowerCase() === 'early access');
      } else {
        result = result.filter((g) => g.type.toLowerCase() === filters.type);
      }
    }

    // 3. Platform Filter
    if (filters.platform !== 'all') {
      const platformQuery = filters.platform;
      
      result = result.filter((g) => {
        const platformsLower = g.platforms.toLowerCase();
        
        if (platformQuery === 'pc') {
          // General PC includes Steam, Epic, GOG, Origin, Ubisoft, PC, etc.
          return (
            platformsLower.includes('pc') ||
            platformsLower.includes('steam') ||
            platformsLower.includes('epic') ||
            platformsLower.includes('gog') ||
            platformsLower.includes('ubisoft') ||
            platformsLower.includes('ea app')
          );
        }
        if (platformQuery === 'steam') {
          return platformsLower.includes('steam');
        }
        if (platformQuery === 'epic') {
          return platformsLower.includes('epic');
        }
        if (platformQuery === 'gog') {
          return platformsLower.includes('gog');
        }
        if (platformQuery === 'drm-free') {
          return platformsLower.includes('drm-free') || platformsLower.includes('drm free');
        }
        if (platformQuery === 'itch') {
          return platformsLower.includes('itch');
        }
        if (platformQuery === 'playstation') {
          return (
            platformsLower.includes('playstation') ||
            platformsLower.includes('ps4') ||
            platformsLower.includes('ps5')
          );
        }
        if (platformQuery === 'xbox') {
          return platformsLower.includes('xbox');
        }
        if (platformQuery === 'switch') {
          return platformsLower.includes('switch') || platformsLower.includes('nintendo');
        }
        if (platformQuery === 'android') {
          return platformsLower.includes('android');
        }
        if (platformQuery === 'ios') {
          return platformsLower.includes('ios') || platformsLower.includes('apple');
        }
        return true;
      });
    }

    // 4. Sorting
    result.sort((a, b) => {
      const isAsc = filters.sortDirection === 'asc';
      
      if (filters.sortBy === 'popularity') {
        // More active users first
        return isAsc ? a.users - b.users : b.users - a.users;
      }
      if (filters.sortBy === 'worth') {
        // High retail value first
        return isAsc
          ? getWorthNumeric(a.worth) - getWorthNumeric(b.worth)
          : getWorthNumeric(b.worth) - getWorthNumeric(a.worth);
      }
      if (filters.sortBy === 'name') {
        // Alphabetical sort by title
        return isAsc
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      // 'newest' - Sort by ID descending (GamerPower sequential IDs represent date added)
      return isAsc ? a.id - b.id : b.id - a.id;
    });

    return result;
  }, [giveaways, filters]);

  const isVhs = themeId === 'vhs80s';

  return (
    <div className={`${currentTheme.bgClass} flex flex-col min-h-screen relative`}>
      {/* Conditionally render 80s VHS filter overlay */}
      {isVhs && <RetroScanlines />}

      {/* Conditionally render animated canvas backgrounds for Neon themes */}
      <NeonBackground themeId={themeId} />

      {/* Main Container */}
      <div className={`max-w-7xl w-full mx-auto px-4 py-5 md:py-8 flex-1 flex flex-col z-10 ${currentTheme.fontFamily}`}>
        
        {/* Header Block */}
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-current/10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl animate-bounce">
                {isVhs ? '👾' : '🎮'}
              </span>
              <h1 className={`text-xl md:text-3xl ${currentTheme.titleFontFamily} ${currentTheme.glowClass}`}>
                {isVhs ? 'FREESHAPE LOOT' : 'Freeshape'}
              </h1>
              {isVhs && (
                <span className="bg-[#ff007f] text-white text-[9px] font-mono font-extrabold px-1 py-0.5 tracking-wider uppercase ml-1 animate-pulse">
                  SYSTEM ACTIVE
                </span>
              )}
            </div>
          </div>

          {/* Theme Selector & Refresh Container */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            {/* Manual Refresh Button */}
            <button
              id="refresh-button"
              type="button"
              onClick={() => fetchGiveaways(true)}
              disabled={loading}
              className={`${currentTheme.buttonSecondaryClass} flex items-center gap-1.5 cursor-pointer`}
              title="Refresh data"
            >
              <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-xs font-semibold">REFRESH</span>
            </button>

            {/* Custom Interactive Styles Dropdown */}
            <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />
          </div>
        </header>

        {/* Filters and Compact Stats Section */}
        {!loading && !error && giveaways.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {/* Filters panel (Takes 4/5 width on large screens) */}
            <div className="lg:col-span-4">
              <GiveawayFilters
                filters={filters}
                onChange={setFilters}
                currentTheme={currentTheme}
                totalCount={giveaways.length}
                filteredCount={filteredGiveaways.length}
                giveaways={giveaways}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
              />
            </div>

            {/* Compact Stats Panel (Takes 1/5 width on large screens) */}
            <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              {/* Stat 1: Regali Attivi */}
              <div className={`p-2 px-3 ${currentTheme.cardClass} flex items-center justify-between gap-2.5 transition-all duration-300 lg:h-full`}>
                <div className="flex items-center gap-1.5 opacity-75">
                  <Gift size={13} className={isVhs ? 'text-[#ff007f]' : 'text-current'} />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Active Giveaways</span>
                </div>
                <span className={`text-sm md:text-base font-extrabold ${currentTheme.titleFontFamily}`}>
                  {giveaways.length}
                </span>
              </div>

              {/* Stat 2: Giochi Completi */}
              <div className={`p-2 px-3 ${currentTheme.cardClass} flex items-center justify-between gap-2.5 transition-all duration-300 lg:h-full`}>
                <div className="flex items-center gap-1.5 opacity-75">
                  <Gamepad2 size={13} className={isVhs ? 'text-[#00ffff]' : 'text-current'} />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Games</span>
                </div>
                <span className={`text-sm md:text-base font-extrabold ${currentTheme.titleFontFamily}`}>
                  {stats.gamesCount}
                </span>
              </div>

              {/* Stat 3: DLC & Extra */}
              <div className={`p-2 px-3 ${currentTheme.cardClass} flex items-center justify-between gap-2.5 transition-all duration-300 lg:h-full`}>
                <div className="flex items-center gap-1.5 opacity-75">
                  <Sparkles size={13} className={isVhs ? 'text-[#ff007f]' : 'text-current'} />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">DLC & Extra</span>
                </div>
                <span className={`text-sm md:text-base font-extrabold ${currentTheme.titleFontFamily}`}>
                  {stats.dlcCount + stats.lootCount + stats.betaCount + stats.earlyAccessCount}
                </span>
              </div>

              {/* Stat 4: Valore Totale */}
              <div className={`p-2 px-3 ${currentTheme.cardClass} flex items-center justify-between gap-2.5 transition-all duration-300 lg:h-full`}>
                <div className="flex items-center gap-1.5 opacity-75">
                  <DollarSign size={13} className={isVhs ? 'text-[#00ffff]' : 'text-current'} />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">Value</span>
                </div>
                <span className={`text-sm md:text-base font-extrabold text-emerald-400 ${currentTheme.titleFontFamily}`}>
                  {stats.totalSavings > 0 ? `$${stats.totalSavings.toLocaleString()}` : 'N/A'}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Content Area */}
        <main className="flex-1 flex flex-col">
          {loading && giveaways.length === 0 ? (
            /* Elegant loading skeletal representation */
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw size={44} className="animate-spin text-indigo-500" />
              <p className="text-base font-medium opacity-85 font-mono animate-pulse">
                FETCHING GIVEAWAYS FROM GAMERPOWER...
              </p>
            </div>
          ) : error ? (
            /* Detailed visual error feedback */
            <div className={`p-6 md:p-8 rounded-2xl text-center flex flex-col items-center gap-4 max-w-xl mx-auto my-12 ${currentTheme.cardClass} border-red-500/50`}>
              <AlertTriangle size={48} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-bounce" />
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-bold">Unable to Connect to Offers</h2>
                <p className={`text-sm ${currentTheme.textMutedClass}`}>
                  There was a problem connecting to the GamerPower API. This might be caused by temporary network limitations.
                </p>
              </div>
              {error && (
                <div className="bg-black/20 p-3 rounded-lg font-mono text-xs text-left text-red-400 border border-red-500/10 w-full break-all">
                  Error Code: {error}
                </div>
              )}
              <button
                type="button"
                onClick={() => fetchGiveaways()}
                className={currentTheme.buttonPrimaryClass}
              >
                Retry Loading
              </button>
            </div>
          ) : filteredGiveaways.length === 0 ? (
            /* Empty results placeholder */
            <div className="text-center py-16 px-4 flex flex-col items-center justify-center gap-3">
              <Gamepad2 size={48} className="opacity-40 animate-pulse" />
              <p className="text-lg font-bold">No giveaways found</p>
              <p className={`text-sm max-w-md ${currentTheme.textMutedClass}`}>
                There are no active giveaways matching the selected filters. Try modifying your search or choosing another platform.
              </p>
              <button
                type="button"
                onClick={() => setFilters({ search: '', type: 'all', platform: 'all', sortBy: 'newest' })}
                className={`${currentTheme.buttonSecondaryClass} mt-2 cursor-pointer`}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Rendering Griglia, Lista o Minimal con animazione di transizione di modalità */}
              <motion.div
                key={viewMode}
                initial={isVhs ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: isVhs ? 0 : 0.25 }}
                className="w-full"
              >
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-4.5">
                    {filteredGiveaways.map((giveaway, idx) => (
                      <GiveawayCard
                        key={giveaway.id}
                        giveaway={giveaway}
                        currentTheme={currentTheme}
                        index={idx}
                        viewMode="grid"
                        activePlatformFilter={filters.platform}
                      />
                    ))}
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="flex flex-col gap-4">
                    {filteredGiveaways.map((giveaway, idx) => (
                      <GiveawayCard
                        key={giveaway.id}
                        giveaway={giveaway}
                        currentTheme={currentTheme}
                        index={idx}
                        viewMode="list"
                        activePlatformFilter={filters.platform}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredGiveaways.map((giveaway, idx) => (
                      <GiveawayCard
                        key={giveaway.id}
                        giveaway={giveaway}
                        currentTheme={currentTheme}
                        index={idx}
                        viewMode="minimal"
                        activePlatformFilter={filters.platform}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`mt-10 pt-6 border-t border-current/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-center sm:text-left ${currentTheme.textMutedClass}`}>
          <div>
            Powered by{' '}
            <a 
              href="https://www.gamerpower.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-current font-bold"
            >
              GamerPower API
            </a>{' '}
            • No user data collected.
          </div>
          <div className="flex items-center gap-1.5">
            Developed with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> for Gamers in 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
