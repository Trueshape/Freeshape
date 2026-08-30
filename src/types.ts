export interface Giveaway {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  type: 'Game' | 'DLC' | 'Loot' | 'Beta' | string;
  platforms: string;
  end_date: string;
  users: number;
  status: string;
}

export type ThemeType = 'cyber' | 'neonblue' | 'neongreen' | 'sunset' | 'vhs80s' | 'space';

export interface Filters {
  search: string;
  type: string;
  platform: string;
  sortBy: 'newest' | 'popularity' | 'worth' | 'name';
  sortDirection?: 'asc' | 'desc';
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  emoji: string;
  description: string;
  bgClass: string;
  textClass: string;
  textMutedClass: string;
  cardClass: string;
  cardHeaderClass: string;
  badgeClass: {
    Game: string;
    DLC: string;
    Loot: string;
    Beta: string;
    EarlyAccess: string;
    default: string;
  };
  buttonPrimaryClass: string;
  buttonSecondaryClass: string;
  inputClass: string;
  accentBorderClass: string;
  glowClass: string;
  fontFamily: string;
  titleFontFamily: string;
}
