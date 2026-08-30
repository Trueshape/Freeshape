import fetch from 'node-fetch';

async function main() {
  const url = 'https://raw.githubusercontent.com/NikkelM/Game-Pass-API/main/examples/completionist/output/formattedGameProperties_console_US.json';
  try {
    console.log('Fetching Console list...');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const keys = Object.keys(data);
    console.log('Total games in complete console list:', keys.length);
    console.log('First 5 games keys and titles:');
    for (let i = 0; i < Math.min(5, keys.length); i++) {
      const key = keys[i];
      console.log(`- ID: ${key}, Title: ${data[key].productTitle}`);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
