import fetch from 'node-fetch';

async function main() {
  const url = 'https://raw.githubusercontent.com/NikkelM/Game-Pass-API/main/examples/completionist/output/formattedGameProperties_console_US.json';
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log('JSON text first 500 chars:');
    console.log(text.substring(0, 500));
    const data = JSON.parse(text);
    console.log('Parsed type:', typeof data, 'Is array:', Array.isArray(data));
    console.log('Keys:', Object.keys(data).slice(0, 5));
    const firstKey = Object.keys(data)[0];
    console.log('First Key:', firstKey);
    console.log('First Value sample:', JSON.stringify(data[firstKey], null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
