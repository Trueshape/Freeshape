import fetch from 'node-fetch';

async function main() {
  const consoleSiglId = 'f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e';
  const url = `https://catalog.gamepass.com/sigls/v2?id=${consoleSiglId}&language=en-us&market=US`;
  try {
    console.log('Fetching live Xbox Game Pass Console IDs...');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
    const data = await res.json();
    console.log('Result length:', data.length);
    console.log('Sample IDs:', data.slice(0, 10));
  } catch (err) {
    console.error('Error fetching live sigl:', err);
  }
}

main();
