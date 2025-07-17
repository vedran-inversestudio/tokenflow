const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'src/tokens/build/tokens.css');
const outputPath = path.join(__dirname, 'src/tokens/build/tokens.processed.css');

let css = fs.readFileSync(inputPath, 'utf8');

// Replace the last dash with an underscore for segments like -1-25x, -0-75x, etc.
css = css.replace(/(--[a-z0-9-]+)-(\d+)-(\d+x):/gi, (match, prefix, num1, num2x) => {
  const newVar = `${prefix}-${num1}_${num2x}:`;
  console.log('MATCH:', match, '->', newVar);
  return newVar;
});

// Add px to any numeric value not already ending in a unit
css = css.replace(/(:\s*)(\d+(\.\d+)?)(;)/g, (match, before, value, _, after) => {
  return `${before}${value}px${after}`;
});

fs.writeFileSync(outputPath, css, 'utf8');
console.log(`Processed CSS written to ${outputPath}`); 