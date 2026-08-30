import fetch from 'node-fetch';

async function main() {
  const url = 'https://raw.githubusercontent.com/NikkelM/Game-Pass-API/main/js/gamePass.js';
  try {
    const res = await fetch(url);
    const code = await res.ok ? await res.text() : 'Failed to fetch';
    console.log('--- FIRST 200 LINES of js/gamePass.js ---');
    console.log(code.split('\n').slice(0, 200).join('\n'));
  } catch (err) {
    console.error(err);
  }
}

main();
