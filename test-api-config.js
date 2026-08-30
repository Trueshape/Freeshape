import fetch from 'node-fetch';

async function main() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/NikkelM/Game-Pass-API/main/config.default.json');
    const config = await res.json();
    console.log('CONFIG.DEFAULT.JSON:', JSON.stringify(config, null, 2));
  } catch (err) {
    console.error('Error fetching config:', err);
  }

  try {
    const res = await fetch('https://raw.githubusercontent.com/NikkelM/Game-Pass-API/main/config.schema.json');
    const schema = await res.json();
    console.log('SCHEMA.JSON PROPERTIES FOR PLATFORMS:');
    if (schema.properties && schema.properties.platformsToFetch) {
      console.log(JSON.stringify(schema.properties.platformsToFetch, null, 2));
    } else {
      console.log('platformsToFetch not found in schema');
    }
  } catch (err) {
    console.error('Error fetching schema:', err);
  }
}

main();
