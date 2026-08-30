import React from 'react';
import { Giveaway, Filters, ThemeConfig } from '../types';
import { ArrowUpDown, Gamepad2, Gift, FlaskConical, Search, LayoutGrid, List, AlignJustify } from 'lucide-react';

interface GiveawayFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  currentTheme: ThemeConfig;
  totalCount: number;
  filteredCount: number;
  giveaways: Giveaway[];
  viewMode: 'grid' | 'list' | 'minimal';
  onViewModeChange: (mode: 'grid' | 'list' | 'minimal') => void;
}

// Loghi SVG inline personalizzati e super curati
const SteamLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
    <path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.2 2.2 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.22 2.22 0 0 1-1.312-1.568L.33 10.333Z"/>
    <path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.7 1.7 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027m2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048"/>
  </svg>
);

const EpicLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L3.5 5.5v12L12 22l8.5-4.5v-12L12 2zm6.5 14.5L12 19.5l-6.5-3v-9.5l6.5-3 6.5 3v9.5z"/>
    <path d="M8.5 7h7v2h-4.5v1.5H15v2h-4v1.5H16v2H8.5V7z"/>
  </svg>
);

const GOGLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 3.5l.4-1 1 .1-.7.7.2 1-.9-.5-.9.5.2-1-.7-.7 1-.1.4-1zm8-2l.4-1 1 .1-.7.7.2 1-.9-.5-.9.5.2-1-.7-.7 1-.1.4-1zm8 2l.4-1 1 .1-.7.7.2 1-.9-.5-.9.5.2-1-.7-.7 1-.1.4-1z"/>
    <text x="50%" y="19" textAnchor="middle" fontSize="10.5" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.4">GOG</text>
  </svg>
);

const DRMFreeLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.61-.14.52.17 1.04.69 1.18.52.14 1.05-.17 1.18-.69C9.44 3.73 10.63 2.8 12 2.8c1.65 0 3 1.35 3 3v2.2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
  </svg>
);

const ItchLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.389 7.042c-.221-.07-.481-.137-.777-.202a35.845 35.845 0 0 0-4.043-.635 15.65 15.65 0 0 0-2.573-.186c-.886 0-1.748.064-2.573.186a36.433 36.433 0 0 0-4.043.635c-.296.065-.556.132-.777.202l-.128.044c-1.127.387-2.073 1.488-2.348 2.748l-.004.015c-.212.981-.227 2.128-.216 3.447.01 1.319.049 2.766.195 4.341l.004.04c.148 1.573 1.378 2.87 2.94 3.09a2.385 2.385 0 0 0 .341.025c1.472 0 2.213-.804 3.256-1.928.328-.354.672-.724 1.066-1.109.479-.47.962-.907 1.442-1.311.238-.201.476-.395.711-.58a3.184 3.184 0 0 0 .528.043c.18 0 .356-.015.528-.043.235.185.473.379.711.58.48.404.963.841 1.442 1.311.394.385.738.755 1.066 1.109 1.043 1.124 1.784 1.928 3.256 1.928.114 0 .228-.008.341-.025 1.562-.22 2.792-1.517 2.94-3.09l.004-.04c.146-1.575.185-3.022.195-4.341.011-1.319-.004-2.466-.216-3.447l-.004-.015c-.275-1.26-1.221-2.361-2.348-2.748l-.128-.044zM8.331 10.958a1.597 1.597 0 1 1-1.597 1.597 1.597 1.597 0 0 1 1.597-1.597zm7.338 0a1.597 1.597 0 1 1-1.597 1.597 1.597 1.597 0 0 1 1.597-1.597z"/>
  </svg>
);

const AndroidLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.5 13c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5M6.5 13c-.8 0-1.5-.7-1.5-1.5S5.7 10 6.5 10 8 10.7 8 11.5 7.3 13 6.5 13m11.1-7.2l1.6-2.7c.1-.2 0-.5-.2-.6-.2-.1-.5 0-.6.2l-1.6 2.7C15.6 4.6 13.9 4 12 4s-3.6.6-4.8 1.4L5.6 2.7c-.1-.2-.4-.3-.6-.2-.2.1-.3.4-.2.6l1.6 2.7C4.1 7.2 2.1 10.1 2 13.5h20c-.1-3.4-2.1-6.3-4.4-7.7M12 21c-4.4 0-8-3.6-8-8h16c0 4.4-3.6 8-8 8" />
  </svg>
);

const IosLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94 1.07.08 2.16-.52 2.82-1.33z"/>
  </svg>
);

const PlaystationLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
    <path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356M9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.45 8.45 0 0 1-4.018-.323Z"/>
  </svg>
);

const XboxLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.202 15.967a8 8 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33m-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.4 8.4 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.5 9.5 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4 4 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.8 7.8 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12 12 0 0 1-.654-.319Z"/>
  </svg>
);

const NintendoLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="currentColor">
    <path d="M9.34 8.005c0-4.38.01-7.972.023-7.982C9.373.01 10.036 0 10.831 0c1.153 0 1.51.01 1.743.05 1.73.298 3.045 1.6 3.373 3.326.046.242.053.809.053 4.61 0 4.06.005 4.537-.123 4.976-.022.076-.048.15-.08.242a4.14 4.14 0 0 1-3.426 2.767c-.317.033-2.889.046-2.978.013-.05-.02-.053-.752-.053-7.979m4.675.269a1.62 1.62 0 0 0-1.113-1.034 1.61 1.61 0 0 0-1.938 1.073 1.9 1.9 0 0 0-.014.935 1.63 1.63 0 0 0 1.952 1.107c.51-.136.908-.504 1.11-1.028.11-.285.113-.742.003-1.053M3.71 3.317c-.208.04-.526.199-.695.348-.348.301-.52.729-.494 1.232.013.262.03.332.136.544.155.321.39.556.712.715.222.11.278.123.567.133.261.01.354 0 .53-.06.719-.242 1.153-.94 1.03-1.656-.142-.852-.95-1.422-1.786-1.256"/>
    <path d="M3.425.053a4.14 4.14 0 0 0-3.28 3.015C0 3.628-.01 3.956.005 8.3c.01 3.99.014 4.082.08 4.39.368 1.66 1.548 2.844 3.224 3.235.22.05.497.06 2.29.07 1.856.012 2.048.009 2.097-.04.05-.05.053-.69.053-7.94 0-5.374-.01-7.906-.033-7.952-.033-.06-.09-.063-2.03-.06-1.578.004-2.052.014-2.26.05Zm3 14.665-1.35-.016c-1.242-.013-1.375-.02-1.623-.083a2.81 2.81 0 0 1-2.08-2.167c-.074-.335-.074-8.579-.004-8.907a2.85 2.85 0 0 1 1.716-2.05c.438-.176.64-.196 2.058-.2l1.282-.003v13.426Z"/>
  </svg>
);

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'worth', label: 'Highest Value' },
  { value: 'name', label: 'Name' }
];

export default function GiveawayFilters({
  filters,
  onChange,
  currentTheme,
  giveaways,
  viewMode,
  onViewModeChange
}: GiveawayFiltersProps) {
  const isVhs = currentTheme.id === 'vhs80s';
  const isCyber = currentTheme.id === 'cyber';
  const isSunset = currentTheme.id === 'sunset';
  const isNeonBlue = currentTheme.id === 'neonblue';
  const isNeonGreen = currentTheme.id === 'neongreen';
  const isSpace = currentTheme.id === 'space';

  const updateFilter = (key: keyof Filters, value: string) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const handleSortClick = (value: 'newest' | 'popularity' | 'worth' | 'name') => {
    if (filters.sortBy === value) {
      const nextDirection = (filters.sortDirection || 'desc') === 'desc' ? 'asc' : 'desc';
      onChange({
        ...filters,
        sortBy: value,
        sortDirection: nextDirection
      });
    } else {
      onChange({
        ...filters,
        sortBy: value,
        sortDirection: value === 'name' ? 'asc' : 'desc'
      });
    }
  };

  const getSortButtonClass = (value: string) => {
    const isActive = filters.sortBy === value;
    
    if (isVhs) {
      return isActive
        ? 'text-[#00ffff] border-b-2 border-[#00ffff] pb-0.5 px-1 font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-0.5 text-[10px]'
        : 'text-[#ff007f] hover:text-[#00ffff]/80 pb-0.5 px-1 font-mono transition-all cursor-pointer flex items-center gap-0.5 text-[10px]';
    }

    if (isCyber) {
      return isActive
        ? 'bg-[#1f2833] border border-[#45f3ff] text-[#45f3ff] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer scale-[1.01]'
        : 'bg-[#1f2833]/20 border border-[#45f3ff]/10 text-[#45f3ff]/60 hover:text-[#45f3ff] hover:border-[#45f3ff]/30 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer';
    }

    if (isSunset) {
      return isActive
        ? 'bg-[#e06d53]/15 text-[#e06d53] border border-[#e06d53] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer scale-[1.01]'
        : 'bg-[#fffdfa] border border-stone-200 text-stone-600 hover:border-[#e06d53]/40 hover:text-[#e06d53]/80 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer';
    }

    if (isNeonGreen) {
      return isActive
        ? 'bg-zinc-950 border border-emerald-400 text-emerald-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer'
        : 'bg-zinc-950/40 border border-emerald-500/20 text-emerald-500/60 hover:text-emerald-400 hover:border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer';
    }

    // Default / Neon Blue Theme
    return isActive
      ? 'bg-slate-950 border border-blue-400 text-blue-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer'
      : 'bg-slate-950/40 border border-blue-500/20 text-blue-500/60 hover:text-blue-400 hover:border-blue-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer';
  };

  // Helper to match types
  const matchType = (type: string, typeQuery: string) => {
    const tLower = type.toLowerCase();
    if (typeQuery === 'dlc_loot') {
      return tLower === 'dlc' || tLower === 'loot';
    }
    if (typeQuery === 'beta_early') {
      return tLower === 'beta' || tLower === 'early access';
    }
    return tLower === typeQuery;
  };

  // Helper to match platforms
  const matchPlatform = (platforms: string, platformQuery: string) => {
    const platformsLower = platforms.toLowerCase();
    if (platformQuery === 'pc') {
      return (
        platformsLower.includes('pc') ||
        platformsLower.includes('steam') ||
        platformsLower.includes('epic') ||
        platformsLower.includes('gog') ||
        platformsLower.includes('ubisoft') ||
        platformsLower.includes('ea app') ||
        platformsLower.includes('itch') ||
        platformsLower.includes('drm-free')
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
  };

  // Filter giveaways matching current search query & platform (used to count types)
  const platformFiltered = React.useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    let items = giveaways;
    if (query) {
      items = items.filter(g => g.title.toLowerCase().includes(query) || g.description.toLowerCase().includes(query));
    }
    if (filters.platform !== 'all') {
      items = items.filter(g => matchPlatform(g.platforms, filters.platform));
    }
    return items;
  }, [giveaways, filters.platform, filters.search]);

  // Filter giveaways matching current search query & type (used to count platforms)
  const typeFiltered = React.useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    let items = giveaways;
    if (query) {
      items = items.filter(g => g.title.toLowerCase().includes(query) || g.description.toLowerCase().includes(query));
    }
    if (filters.type !== 'all') {
      items = items.filter(g => matchType(g.type, filters.type));
    }
    return items;
  }, [giveaways, filters.type, filters.search]);

  const getCategoryCount = (typeValue: string) => {
    if (typeValue === 'all') {
      return platformFiltered.length;
    }
    return platformFiltered.filter(g => matchType(g.type, typeValue)).length;
  };

  const getPlatformCount = (platformValue: string) => {
    if (platformValue === 'all') {
      return typeFiltered.length;
    }
    return typeFiltered.filter(g => matchPlatform(g.platforms, platformValue)).length;
  };

  // Category list with custom icons
  const typesList = [
    { value: 'all', label: 'All', icon: null },
    { value: 'game', label: 'Games', icon: <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" /> },
    { value: 'dlc_loot', label: 'DLC & Loot', icon: <Gift className="w-4 h-4 text-red-400 shrink-0" /> },
    { value: 'beta_early', label: 'Beta & Early Access', icon: <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" /> }
  ];

  // Platform row 1: All, Steam, Epic Games, GOG, DRM-Free, Itch.io, Android, iOS
  const platformsRow1 = [
    { value: 'all', label: 'All', icon: null },
    { value: 'steam', label: 'Steam', icon: <SteamLogo /> },
    { value: 'epic', label: 'Epic Games', icon: <EpicLogo /> },
    { value: 'gog', label: 'GOG', icon: <GOGLogo /> },
    { value: 'drm-free', label: 'DRM-Free', icon: <DRMFreeLogo /> },
    { value: 'itch', label: 'Itch.io', icon: <ItchLogo /> },
    { value: 'android', label: 'Android', icon: <AndroidLogo /> },
    { value: 'ios', label: 'iOS', icon: <IosLogo /> }
  ];

  // Piattaforme riga 2: PlayStation, Xbox, Nintendo
  const platformsRow2 = [
    { value: 'playstation', label: 'PlayStation', icon: <PlaystationLogo /> },
    { value: 'xbox', label: 'Xbox', icon: <XboxLogo /> },
    { value: 'switch', label: 'Nintendo', icon: <NintendoLogo /> }
  ];

  // Restituisce le classi CSS per il pulsante attivo/inattivo a seconda del tema
  const getButtonClass = (isActive: boolean) => {
    if (isVhs) {
      return isActive
        ? 'bg-[#ff007f] text-white border-2 border-[#00ffff] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider font-bold shadow-[1px_1px_0px_#00ffff] flex items-center gap-1.5 transition-all cursor-pointer'
        : 'bg-black text-[#ff007f] border-2 border-[#ff007f]/40 hover:border-[#00ffff] hover:text-[#00ffff] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider rounded-none flex items-center gap-1.5 transition-all cursor-pointer';
    }

    if (isCyber) {
      return isActive
        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black border border-cyan-300 font-bold px-2 py-1 rounded-md shadow-[0_0_6px_rgba(69,243,255,0.25)] flex items-center gap-1.5 transition-all cursor-pointer scale-[1.01]'
        : 'bg-[#1f2833]/40 border border-[#45f3ff]/20 text-[#45f3ff]/80 hover:text-white hover:border-[#45f3ff]/60 px-2 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer';
    }

    if (isSunset) {
      return isActive
        ? 'bg-[#e06d53] text-white border-2 border-[#e06d53] font-bold px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer scale-[1.01]'
        : 'bg-[#fffdfa] border-2 border-stone-200 text-stone-700 hover:border-[#e06d53]/60 px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer';
    }

    if (isNeonGreen) {
      return isActive
        ? 'bg-emerald-600 text-white font-bold border border-emerald-500/50 px-2 py-0.5 rounded-md shadow-[0_0_6px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all cursor-pointer'
        : 'bg-zinc-950/80 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer';
    }

    // Default / Neon Blue Theme
    return isActive
      ? 'bg-blue-600 text-white font-bold border border-blue-500/50 px-2 py-0.5 rounded-md shadow-[0_0_6px_rgba(59,130,246,0.3)] flex items-center gap-1.5 transition-all cursor-pointer'
      : 'bg-slate-950/80 border border-blue-500/30 text-blue-400 hover:border-blue-400 hover:text-blue-300 px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer';
  };

  const getBadgeClass = (isActive: boolean) => {
    if (isVhs) {
      return isActive
        ? 'bg-white text-black border border-black font-bold text-[8px] px-1 ml-1 font-mono'
        : 'bg-[#ff007f] text-white border border-[#ff007f] font-bold text-[8px] px-1 ml-1 font-mono';
    }
    if (isCyber) {
      return isActive
        ? 'bg-black/25 text-black font-extrabold text-[9px] px-1.5 py-0.2 rounded ml-1'
        : 'bg-cyan-500/15 text-cyan-400 font-extrabold text-[9px] px-1.5 py-0.2 rounded ml-1';
    }
    if (isSunset) {
      return isActive
        ? 'bg-white/35 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded ml-1'
        : 'bg-[#e06d53]/10 text-[#e06d53] font-bold text-[9px] px-1.5 py-0.2 rounded ml-1';
    }
    if (isNeonGreen) {
      return isActive
        ? 'bg-emerald-950/40 text-emerald-100 font-bold text-[9px] px-1.5 py-0.2 rounded ml-1'
        : 'bg-emerald-500/10 text-emerald-400 font-bold text-[9px] px-1.5 py-0.2 rounded ml-1';
    }
    // Default / Neon Blue Theme
    return isActive
      ? 'bg-blue-950/40 text-blue-100 font-bold text-[9px] px-1.5 py-0.2 rounded ml-1'
      : 'bg-blue-500/10 text-blue-400 font-bold text-[9px] px-1.5 py-0.2 rounded ml-1';
  };

  return (
    <div className={`p-3 md:p-3.5 flex flex-col gap-3 lg:h-full justify-center ${currentTheme.cardClass}`}>
      <div className="flex flex-col gap-3">
        
        {/* ROW 1: Category Selection */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 font-mono">
            Filter by Category:
          </span>
          <div className="flex flex-wrap gap-1.5 items-center">
            {typesList.map((type) => {
              const isActive = filters.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateFilter('type', type.value)}
                  className={getButtonClass(isActive)}
                >
                  {type.icon}
                  <span className="text-xs">{type.label}</span>
                  <span className={getBadgeClass(isActive)}>
                    {getCategoryCount(type.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Platform Selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider opacity-60 font-mono">
            Filter by Platform:
          </span>
          
          <div className="flex flex-col gap-2">
            {/* Prima riga: Steam, Epic Games, GOG, DRM-Free, Itch.io, Android, iOS */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {platformsRow1.map((plat) => {
                const isActive = filters.platform === plat.value;
                return (
                  <button
                    key={plat.value}
                    type="button"
                    onClick={() => updateFilter('platform', plat.value)}
                    className={getButtonClass(isActive)}
                  >
                    {plat.icon && (
                      <span className={isActive && (isVhs || isSunset || isNeonGreen || isNeonBlue) ? 'text-current' : 'opacity-85'}>
                        {plat.icon}
                      </span>
                    )}
                    <span className="text-xs">{plat.label}</span>
                    <span className={getBadgeClass(isActive)}>
                      {getPlatformCount(plat.value)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Second row: PlayStation, Xbox, Nintendo */}
            <div className="flex flex-wrap gap-1.5 items-center pt-1 border-t border-current/5">
              {/* Invisible spacer aligned with the "All" button to push PlayStation under Steam */}
              <button
                type="button"
                className={`${getButtonClass(false)} invisible pointer-events-none select-none`}
                aria-hidden="true"
              >
                <span className="text-xs">All</span>
                <span className={getBadgeClass(false)}>
                  {getPlatformCount('all')}
                </span>
              </button>

              {platformsRow2.map((plat) => {
                const isActive = filters.platform === plat.value;
                return (
                  <button
                    key={plat.value}
                    type="button"
                    onClick={() => updateFilter('platform', plat.value)}
                    className={getButtonClass(isActive)}
                  >
                    {plat.icon && (
                      <span className={isActive && (isVhs || isSunset || isNeonGreen || isNeonBlue) ? 'text-current' : 'opacity-85'}>
                        {plat.icon}
                      </span>
                    )}
                    <span className="text-xs">{plat.label}</span>
                    <span className={getBadgeClass(isActive)}>
                      {getPlatformCount(plat.value)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>        {/* ROW 3: Search Bar left, Selectors right */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-current/10 text-[10px] font-mono">
          {/* Search bar */}
          <div className="relative flex items-center w-full md:max-w-[240px] shrink-0">
            <Search size={14} className="absolute left-2.5 opacity-60 text-current" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className={`pl-8 pr-3 py-1.5 w-full text-xs outline-none transition-all ${
                isVhs 
                  ? 'bg-black border border-[#ff007f] text-[#00ffff] focus:border-[#00ffff] font-mono rounded-none uppercase' 
                  : isCyber 
                    ? 'bg-[#1f2833] border border-[#45f3ff]/30 text-[#45f3ff] focus:border-[#45f3ff] rounded-lg'
                    : isNeonGreen
                      ? 'bg-zinc-950 border border-emerald-500/30 text-emerald-400 focus:border-emerald-400 rounded-md'
                      : isNeonBlue
                        ? 'bg-slate-950 border border-blue-500/30 text-blue-400 focus:border-blue-400 rounded-md'
                        : isSunset
                          ? 'bg-white border border-stone-200 text-stone-800 focus:border-[#e06d53] rounded-lg'
                          : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-lg dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
            />
          </div>

          {/* Right: View Selector + Sorting */}
          <div className="flex flex-wrap items-center gap-4 md:justify-end flex-1">
            {/* View Selector */}
            <div className="flex items-center gap-1.5">
              <span className="opacity-60 flex items-center gap-1 shrink-0 uppercase">VIEW:</span>
              <div className={`flex items-center gap-0.5 p-0.5 border ${
                isVhs 
                  ? 'bg-black border-[#ff007f] rounded-none' 
                  : isCyber 
                    ? 'bg-[#1f2833]/50 border-[#45f3ff]/20 rounded-lg'
                    : isNeonGreen
                      ? 'bg-zinc-950 border-emerald-500/20 rounded-lg'
                      : isSunset
                        ? 'bg-white border-stone-200 rounded-lg'
                        : isSpace
                          ? 'bg-slate-950/60 border-cyan-500/20 rounded-lg'
                          : 'bg-slate-950 border-blue-500/20 rounded-lg'
              }`}>
                <button
                  type="button"
                  onClick={() => onViewModeChange('grid')}
                  className={`px-2 py-0.5 flex items-center gap-1 cursor-pointer transition-all font-bold text-[9px] ${
                    isVhs ? 'rounded-none' : 'rounded-md'
                  } ${
                    viewMode === 'grid'
                      ? isVhs
                        ? 'bg-[#ff007f] text-white font-bold'
                        : isCyber
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold'
                          : isNeonGreen
                            ? 'bg-emerald-500 text-black font-bold'
                            : isSunset
                              ? 'bg-[#e06d53] text-white font-bold'
                              : isSpace
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold'
                                : 'bg-blue-500 text-white font-bold'
                      : 'opacity-50 hover:opacity-100 text-current'
                  }`}
                  title="Grid"
                >
                  <LayoutGrid size={11} />
                  <span>GRID</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('list')}
                  className={`px-2 py-0.5 flex items-center gap-1 cursor-pointer transition-all font-bold text-[9px] ${
                    isVhs ? 'rounded-none' : 'rounded-md'
                  } ${
                    viewMode === 'list'
                      ? isVhs
                        ? 'bg-[#ff007f] text-white font-bold'
                        : isCyber
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold'
                          : isNeonGreen
                            ? 'bg-emerald-500 text-black font-bold'
                            : isSunset
                              ? 'bg-[#e06d53] text-white font-bold'
                              : isSpace
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold'
                                : 'bg-blue-500 text-white font-bold'
                      : 'opacity-50 hover:opacity-100 text-current'
                  }`}
                  title="List"
                >
                  <List size={11} />
                  <span>LIST</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange('minimal')}
                  className={`px-2 py-0.5 flex items-center gap-1 cursor-pointer transition-all font-bold text-[9px] ${
                    isVhs ? 'rounded-none' : 'rounded-md'
                  } ${
                    viewMode === 'minimal'
                      ? isVhs
                        ? 'bg-[#ff007f] text-white font-bold'
                        : isCyber
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold'
                          : isNeonGreen
                            ? 'bg-emerald-500 text-black font-bold'
                            : isSunset
                              ? 'bg-[#e06d53] text-white font-bold'
                              : isSpace
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold'
                                : 'bg-blue-500 text-white font-bold'
                      : 'opacity-50 hover:opacity-100 text-current'
                  }`}
                  title="Minimal"
                >
                  <AlignJustify size={11} />
                  <span>MINIMAL</span>
                </button>
              </div>
            </div>

            {/* Sorting options */}
            <div className="flex items-center gap-1.5">
              <span className="opacity-60 flex items-center gap-1 shrink-0">
                <ArrowUpDown size={11} className="shrink-0" />
                SORT BY:
              </span>
              <div className="flex flex-wrap gap-1 items-center">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = filters.sortBy === opt.value;
                  const isAsc = filters.sortDirection === 'asc';
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSortClick(opt.value as 'newest' | 'popularity' | 'worth')}
                      className={getSortButtonClass(opt.value)}
                    >
                      <span className="text-[10px] font-medium">{opt.label}</span>
                      {isActive && (
                        <span className="text-[9px] font-bold">
                          {isAsc ? ' ▲' : ' ▼'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
