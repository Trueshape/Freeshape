import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

interface CachedGame {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  type: string;
  platforms: string;
  end_date: string;
  users: number;
  status: string;
}

let cachedSubscriptionGames: CachedGame[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

const CORE_GAME_TITLES = [
  "Among Us",
  "Astroneer",
  "Celeste",
  "Chivalry 2",
  "Dead Cells",
  "Descenders",
  "Dishonored 2",
  "Doom Eternal",
  "Fable Anniversary",
  "Fallout 4",
  "Fallout 76",
  "Firewatch",
  "Forza Horizon 4",
  "Gangs of Sherwood",
  "Gears 5",
  "Golf with your Friends",
  "Grounded",
  "Halo 5: Guardians",
  "Halo Wars 2",
  "Hellblade: Senua's Sacrifice",
  "Human Fall Flat",
  "Inside",
  "Limbo",
  "Ori and the Will of the Wisps",
  "Overcooked! 2",
  "Payday 2",
  "Psychonauts 2",
  "Slay the Spire",
  "Spiritfarer",
  "Stardew Valley",
  "State of Decay 2",
  "Superliminal",
  "Teenage Mutant Ninja Turtles: Shredder's Revenge",
  "The Elder Scrolls Online",
  "Totally Reliable Delivery Service",
  "Unpacking",
  "Vampire Survivors",
  "Wreckfest"
];

function normalize(title: string): string {
  if (!title) return '';
  return title.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const NORM_CORE_TITLES = CORE_GAME_TITLES.map(normalize);

function getBestImage(images: any[]): string {
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80';
  }
  const idealTypes = ['SuperHeroArt', 'TitledHeroArt', 'BrandedKeyArt', 'BoxArt', 'Poster', 'Hero'];
  for (const type of idealTypes) {
    const found = images.find((img: any) => img.ImagePurpose === type);
    if (found && found.Uri) {
      let uri = found.Uri;
      if (uri.startsWith('//')) uri = 'https:' + uri;
      return uri;
    }
  }
  let uri = images[0].Uri;
  if (uri.startsWith('//')) uri = 'https:' + uri;
  return uri;
}

const fallbackXboxCoreGames: CachedGame[] = [
  {
    id: 92001,
    title: "Celeste",
    worth: "$19.99",
    thumbnail: "https://store-images.s-microsoft.com/image/apps.43794.13781229712128827.8a6a127a-5bfd-4682-bb34-315cf34f6617.9044d039-f9c9-44be-9cfc-63309a1ffb15",
    image: "https://store-images.s-microsoft.com/image/apps.43794.13781229712128827.8a6a127a-5bfd-4682-bb34-315cf34f6617.9044d039-f9c9-44be-9cfc-63309a1ffb15",
    description: "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight, hand-crafted platformer from the creators of multiplayer classic TowerFall.",
    instructions: "Available with an active Xbox Game Pass Core (Essential) subscription. Play directly from your Xbox console or PC Xbox app.",
    open_giveaway_url: "https://www.microsoft.com/p/-/9PL5V66C41WB",
    published_date: "2018-01-25",
    type: "Game",
    platforms: "Xbox Game Pass Core, Xbox Series X/S, Xbox One, PC",
    end_date: "Ongoing",
    users: 14500,
    status: "Active"
  },
  {
    id: 92002,
    title: "Stardew Valley",
    worth: "$14.99",
    thumbnail: "https://store-images.s-microsoft.com/image/apps.31828.13510798887413620.2be1b869-705b-4396-8cf9-c3c2605eb241.6c6a51d8-0402-4f7f-8e40-062e24eb2663",
    image: "https://store-images.s-microsoft.com/image/apps.31828.13510798887413620.2be1b869-705b-4396-8cf9-c3c2605eb241.6c6a51d8-0402-4f7f-8e40-062e24eb2663",
    description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life!",
    instructions: "Available with an active Xbox Game Pass Core (Essential) subscription. Play directly from your Xbox console or PC Xbox app.",
    open_giveaway_url: "https://www.microsoft.com/p/-/9MWR0S0PCL7R",
    published_date: "2016-12-14",
    type: "Game",
    platforms: "Xbox Game Pass Core, Xbox Series X/S, Xbox One, PC",
    end_date: "Ongoing",
    users: 19800,
    status: "Active"
  },
  {
    id: 92003,
    title: "Dead Cells",
    worth: "$24.99",
    thumbnail: "https://store-images.s-microsoft.com/image/apps.61763.14361517565576883.ef0c0d16-6078-430c-ab22-2592f70b4f8d.4e7195d9-4828-4e31-83c8-041a995e8e89",
    image: "https://store-images.s-microsoft.com/image/apps.61763.14361517565576883.ef0c0d16-6078-430c-ab22-2592f70b4f8d.4e7195d9-4828-4e31-83c8-041a995e8e89",
    description: "Dead Cells is a rogue-lite, metroidvania action-platformer. You'll explore a sprawling, ever-changing castle... assuming you're able to fight your way past its keepers in 2D souls-lite combat.",
    instructions: "Available with an active Xbox Game Pass Core (Essential) subscription. Play directly from your Xbox console or PC Xbox app.",
    open_giveaway_url: "https://www.microsoft.com/p/-/9N3X48Q06C7R",
    published_date: "2018-08-07",
    type: "Game",
    platforms: "Xbox Game Pass Core, Xbox Series X/S, Xbox One, PC",
    end_date: "Ongoing",
    users: 16200,
    status: "Active"
  }
];

async function fetchXboxGamePassCoreGames(): Promise<CachedGame[]> {
  try {
    console.log("Fetching Live Xbox Game Pass Core games...");
    const consoleSiglId = 'f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e';
    const siglUrl = `https://catalog.gamepass.com/sigls/v2?id=${consoleSiglId}&language=en-us&market=US`;
    
    const siglRes = await fetch(siglUrl);
    if (!siglRes.ok) throw new Error(`Xbox Sigl API returned status ${siglRes.status}`);
    const siglData: any = await siglRes.json();
    
    const gameIds = siglData
      .filter((entry: any) => entry.id)
      .map((entry: any) => entry.id);
      
    if (gameIds.length === 0) {
      throw new Error("No game IDs found in Xbox Game Pass console catalog");
    }
    
    console.log(`Fetched ${gameIds.length} game IDs. Retrieving details from Display Catalog...`);
    const matchedGames: CachedGame[] = [];
    const BATCH_SIZE = 100;
    let indexId = 92000;
    
    for (let i = 0; i < gameIds.length; i += BATCH_SIZE) {
      const batch = gameIds.slice(i, i + BATCH_SIZE);
      const displayUrl = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${batch.join(',')}&market=US&languages=en-us`;
      
      const res = await fetch(displayUrl);
      if (!res.ok) {
        console.error(`Failed to fetch details for batch starting at ${i}`);
        continue;
      }
      
      const data: any = await res.json();
      const products = data.Products || [];
      
      for (const product of products) {
        const title = product.LocalizedProperties?.[0]?.ProductTitle;
        if (!title) continue;
        
        const normTitle = normalize(title);
        const matchIndex = NORM_CORE_TITLES.findIndex(t => normTitle.includes(t) || t.includes(normTitle));
        
        if (matchIndex !== -1) {
          indexId++;
          
          // Price formatting
          const priceObj = product.DisplaySkuAvailabilities?.[0]?.Availabilities?.[0]?.OrderManagementData?.Price;
          let worth = "$19.99";
          if (priceObj && typeof priceObj.MSRP === 'number') {
            worth = `$${priceObj.MSRP.toFixed(2)}`;
          } else if (priceObj && typeof priceObj.ListPrice === 'number') {
            worth = `$${priceObj.ListPrice.toFixed(2)}`;
          }
          
          // Image extraction
          const images = product.LocalizedProperties?.[0]?.Images || [];
          const imageUrl = getBestImage(images);
          
          // Description extraction
          const desc = product.LocalizedProperties?.[0]?.ShortDescription || 
                       product.LocalizedProperties?.[0]?.ProductDescription || 
                       "Available with Xbox Game Pass Core.";
                       
          // Release date formatting
          const relDateRaw = product.MarketProperties?.[0]?.OriginalReleaseDate || "";
          const publishedDate = relDateRaw ? relDateRaw.split("T")[0] : "2026-07-01";
          
          matchedGames.push({
            id: indexId,
            title: title,
            worth: worth,
            thumbnail: imageUrl,
            image: imageUrl,
            description: desc,
            instructions: "Available with an active Xbox Game Pass Core (Essential) subscription. Play directly from your Xbox console or PC Xbox app.",
            open_giveaway_url: `https://www.microsoft.com/p/-/${product.ProductId}`,
            published_date: publishedDate,
            type: "Game",
            platforms: "Xbox Game Pass Core, Xbox Series X/S, Xbox One, PC",
            end_date: "Ongoing",
            users: 12000 + Math.floor(Math.random() * 8000),
            status: "Active"
          });
        }
      }
    }
    
    console.log(`Successfully fetched and parsed ${matchedGames.length} Game Pass Core games!`);
    if (matchedGames.length > 0) {
      return matchedGames;
    }
    throw new Error("No games matched the Core catalog list");
  } catch (err) {
    console.error("Error in fetchXboxGamePassCoreGames, using fallback:", err);
    return fallbackXboxCoreGames;
  }
}

const fallbackPSPlusGames: CachedGame[] = [
  {
    id: 90101,
    title: "Call of Duty: Modern Warfare III",
    worth: "$69.99",
    thumbnail: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3595270/05b8f73493348dfa9b6662dc13a6740929ea195b/capsule_231x87.jpg",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3595270/05b8f73493348dfa9b6662dc13a6740929ea195b/capsule_231x87.jpg",
    description: "Experience an epic cinematic campaign, massive multiplayer action, and an all-new open-world PvE Zombies experience in this blockbuster first-person shooter.",
    instructions: "Available for PlayStation Plus members. Add to your library from the PlayStation Store during the month of July.",
    open_giveaway_url: "https://store.playstation.com",
    published_date: "2026-07-01",
    type: "Game",
    platforms: "PlayStation Plus, PS4, PS5",
    end_date: "End of Month",
    users: 15430,
    status: "Active"
  },
  {
    id: 90102,
    title: "For the King II",
    worth: "$29.99",
    thumbnail: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1674620/header.jpg",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1674620/header.jpg",
    description: "Battle against Fahrul's tyrannical Queen in this challenging blend of roguelike strategy, turn-based combat, and tabletop-inspired adventure, playable solo or in co-op.",
    instructions: "Available for PlayStation Plus members. Add to your library from the PlayStation Store during the month of July.",
    open_giveaway_url: "https://store.playstation.com",
    published_date: "2026-07-01",
    type: "Game",
    platforms: "PlayStation Plus, PS5",
    end_date: "End of Month",
    users: 12450,
    status: "Active"
  },
  {
    id: 90103,
    title: "CrossCode",
    worth: "$19.99",
    thumbnail: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/368340/header.jpg",
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/368340/header.jpg",
    description: "Dive into a retro-inspired 2D Action RPG that combines 16-bit SNES-style graphics with fluid physics, a fast-paced combat system, and engaging puzzle mechanics.",
    instructions: "Available for PlayStation Plus members. Add to your library from the PlayStation Store during the month of July.",
    open_giveaway_url: "https://store.playstation.com",
    published_date: "2026-07-01",
    type: "Game",
    platforms: "PlayStation Plus, PS4",
    end_date: "End of Month",
    users: 11200,
    status: "Active"
  }
];

let cachedPSPlusGames: CachedGame[] | null = null;
let cachedPSPlusPostLink = "";

async function searchSteamGame(gameTitle: string): Promise<{ appId: string; worth: string; image: string } | null> {
  try {
    const cleanTitle = gameTitle.replace(/®|™|©/g, "").trim();
    const res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(cleanTitle)}&l=english&cc=US`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    if (!res.ok) throw new Error(`Steam search status ${res.status}`);
    const data: any = await res.json();
    if (data && data.items && data.items.length > 0) {
      const item = data.items[0];
      const appId = item.id;
      let worth = "$59.99";
      if (item.price) {
        worth = `$${(item.price.final / 100).toFixed(2)}`;
      }
      return {
        appId: String(appId),
        worth: worth,
        image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`
      };
    }
  } catch (err) {
    console.error(`Steam search failed for title "${gameTitle}":`, err);
  }
  return null;
}

async function fetchPlayStationPlusGamesFromFeed(): Promise<CachedGame[]> {
  try {
    console.log("Fetching PlayStation Blog feed...");
    let response = await fetch('https://blog.playstation.com/tag/playstation-plus/feed/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.warn("Failed to fetch PlayStation tag feed, trying main feed...");
      response = await fetch('https://blog.playstation.com/feed/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
    }

    if (!response.ok) {
      throw new Error(`Feed fetch returned status ${response.status}`);
    }

    const xmlText = await response.text();
    const items = xmlText.split('<item>');
    let monthlyGamesItem: string | null = null;
    let postLink = "";
    let postTitle = "";
    let postPubDate = "";

    // Find the latest post that contains "monthly games for" in the title
    for (let i = 1; i < items.length; i++) {
      const item = items[i];
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
      
      if (title.toLowerCase().includes('monthly games for')) {
        monthlyGamesItem = item;
        postTitle = title;
        
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
        postLink = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
        
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        postPubDate = dateMatch ? dateMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';
        break;
      }
    }

    if (!monthlyGamesItem) {
      console.warn("No 'Monthly Games for' post found in feed. Using fallback PS Plus games.");
      return fallbackPSPlusGames;
    }

    // Check if we have cached games for this specific post
    if (cachedPSPlusGames && cachedPSPlusPostLink === postLink) {
      console.log(`Using cached PS Plus games for article: ${postTitle}`);
      return cachedPSPlusGames;
    }

    console.log(`Parsing new PlayStation Plus monthly games post: "${postTitle}"`);

    const contentMatch = monthlyGamesItem.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/) || 
                         monthlyGamesItem.match(/<description>([\s\S]*?)<\/description>/);
    const content = contentMatch ? contentMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : '';

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      console.warn("GEMINI_API_KEY is not defined. Using fallback PlayStation Plus games.");
      return fallbackPSPlusGames;
    }

    const ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `
    Analyze the following PlayStation Blog article title and content to extract the PlayStation Plus monthly games announced.
    
    Article Title: "${postTitle}"
    
    For each game found, extract:
    1. The game title (exact name of the game).
    2. Platforms listed (e.g. "PS4, PS5").
    3. A short, inviting description of the game.
    4. Custom instructions on how to claim it (e.g. "Available for PlayStation Plus members. Add to your library from the PlayStation Store before the end of the month.").
    
    Return a JSON array of objects.
    `;

    console.log("Calling Gemini API to parse monthly games from content...");
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The exact name of the game." },
              platforms: { type: Type.STRING, description: "Target platforms, e.g., 'PS4, PS5'." },
              description: { type: Type.STRING, description: "A brief, highly readable summary description of the game." },
              instructions: { type: Type.STRING, description: "Instructions on how to claim this game on PlayStation Plus." }
            },
            required: ["title", "platforms", "description", "instructions"]
          }
        }
      }
    });

    const rawText = geminiResponse.text;
    if (!rawText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedGames = JSON.parse(rawText);
    if (!Array.isArray(parsedGames)) {
      throw new Error("Gemini response is not an array");
    }

    const finalGames: CachedGame[] = [];
    let gameId = 90100;

    for (const parsed of parsedGames) {
      gameId++;
      console.log(`Searching Steam details for: ${parsed.title}`);
      const steamInfo = await searchSteamGame(parsed.title);
      
      const publishedDate = postPubDate ? new Date(postPubDate).toISOString().split('T')[0] : "2026-07-01";
      const usersCount = 10000 + Math.floor(Math.random() * 8000);

      finalGames.push({
        id: gameId,
        title: parsed.title,
        worth: steamInfo ? steamInfo.worth : "$59.99",
        thumbnail: steamInfo ? steamInfo.image : "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
        image: steamInfo ? steamInfo.image : "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80",
        description: parsed.description,
        instructions: parsed.instructions,
        open_giveaway_url: steamInfo ? `https://store.steampowered.com/app/${steamInfo.appId}` : "https://store.playstation.com",
        published_date: publishedDate,
        type: "Game",
        platforms: `PlayStation Plus, ${parsed.platforms}`,
        end_date: "End of Month",
        users: usersCount,
        status: "Active"
      });
    }

    cachedPSPlusGames = finalGames;
    cachedPSPlusPostLink = postLink;
    console.log(`Successfully parsed ${finalGames.length} games from PlayStation Blog RSS.`);
    return finalGames;

  } catch (err) {
    console.error("Error in fetchPlayStationPlusGamesFromFeed:", err);
    return fallbackPSPlusGames;
  }
}

async function fetchSubscriptionGames(): Promise<CachedGame[]> {
  const now = Date.now();
  if (cachedSubscriptionGames && (now - lastCacheTime < CACHE_TTL)) {
    return cachedSubscriptionGames;
  }

  const games: CachedGame[] = [];
  
  // 1. Fetch Xbox Game Pass Core games dynamically
  const xboxCoreGames = await fetchXboxGamePassCoreGames();
  games.push(...xboxCoreGames);

  // 2. Fetch PlayStation Plus monthly games
  const psPlusGames = await fetchPlayStationPlusGamesFromFeed();
  games.push(...psPlusGames);

  cachedSubscriptionGames = games;
  lastCacheTime = now;
  return games;
}

async function startServer() {
  const app = express();

  // Route API per fare il proxy delle richieste a GamerPower
  app.get('/api/giveaways', async (req, res) => {
    try {
      const { platform, type, 'sort-by': sortBy } = req.query;
      let url = 'https://www.gamerpower.com/api/giveaways';
      
      const params = new URLSearchParams();
      if (platform) params.append('platform', platform as string);
      if (type) params.append('type', type as string);
      if (sortBy) params.append('sort-by', sortBy as string);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log(`Fetching: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`GamerPower API returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Recupera i dati dinamici dei giochi in abbonamento tramite API Steam Store
      const subsGames = await fetchSubscriptionGames();
      
      // Unisce i giochi in abbonamento con i giveaway reali di GamerPower
      if (Array.isArray(data)) {
        res.json([...subsGames, ...data]);
      } else {
        res.json(subsGames);
      }
    } catch (error: any) {
      console.error('Error fetching giveaways:', error);
      res.status(500).json({ 
        error: 'Unable to fetch giveaways from GamerPower', 
        details: error.message 
      });
    }
  });

  // Configurazione del server per lo sviluppo (Vite middleware) o produzione (dist statico)
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
