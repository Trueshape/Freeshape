import fetch from 'node-fetch';

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

// Normalize title for matching
function normalize(title) {
  if (!title) return '';
  return title.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const NORM_CORE_TITLES = CORE_GAME_TITLES.map(normalize);

async function main() {
  const consoleSiglId = 'f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e';
  const siglUrl = `https://catalog.gamepass.com/sigls/v2?id=${consoleSiglId}&language=en-us&market=US`;

  try {
    console.log('Fetching live Xbox Game Pass IDs...');
    const siglRes = await fetch(siglUrl);
    if (!siglRes.ok) throw new Error(`HTTP Status ${siglRes.status}`);
    const siglData = await siglRes.json();
    
    const gameIds = siglData
      .filter(entry => entry.id)
      .map(entry => entry.id);
    
    console.log(`Fetched ${gameIds.length} game IDs. Retrieving details in batches...`);
    
    let matchedGames = [];
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < gameIds.length; i += BATCH_SIZE) {
      const batch = gameIds.slice(i, i + BATCH_SIZE);
      const displayUrl = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${batch.join(',')}&market=US&languages=en-us`;
      
      const res = await fetch(displayUrl);
      if (!res.ok) {
        console.error(`Failed to fetch details for batch starting at ${i}`);
        continue;
      }
      
      const data = await res.json();
      const products = data.Products || [];
      
      for (const product of products) {
        const title = product.LocalizedProperties?.[0]?.ProductTitle;
        if (!title) continue;
        
        const normTitle = normalize(title);
        // Direct match or substring match
        const matchIndex = NORM_CORE_TITLES.findIndex(t => normTitle.includes(t) || t.includes(normTitle));
        
        if (matchIndex !== -1) {
          matchedGames.push({
            productId: product.ProductId,
            title: title,
            developer: product.LocalizedProperties?.[0]?.DeveloperName || 'Unknown',
            publisher: product.LocalizedProperties?.[0]?.PublisherName || 'Unknown',
            description: product.LocalizedProperties?.[0]?.ProductDescription || '',
            rating: product.MarketProperties?.[0]?.UsageData?.[0]?.AverageRating || 0,
            releaseDate: product.MarketProperties?.[0]?.OriginalReleaseDate || '',
            categories: product.Properties?.CategoryIds || [],
            images: product.LocalizedProperties?.[0]?.Images || [],
            matchedWith: CORE_GAME_TITLES[matchIndex]
          });
        }
      }
    }
    
    console.log(`Matched ${matchedGames.length} Game Pass Core games!`);
    console.log('First 3 matched games:');
    console.log(JSON.stringify(matchedGames.slice(0, 3), null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
