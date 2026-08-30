import fetch from 'node-fetch';

async function main() {
  try {
    const res = await fetch('https://api.github.com/repos/NikkelM/Game-Pass-API/git/trees/main?recursive=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const data = await res.json();
    if (data && data.tree) {
      const files = data.tree.map(f => f.path);
      console.log('ALL FILES IN REPO (unfiltered):');
      console.log(files);
    } else {
      console.log('No tree found:', data);
    }
  } catch (err) {
    console.error(err);
  }
}

main();
