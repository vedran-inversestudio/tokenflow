const fs = require('fs');
const math = require('mathjs');

const input = 'src/tokens/build/tokens.processed.css';
const output = 'src/tokens/build/tokens.sanitized.css';

const lines = fs.readFileSync(input, 'utf8').split('\n');
const sanitized = lines.map(line => {
  // Match lines like: --var-name: 16 / 100 * 25;
  const match = line.match(/(--[a-zA-Z0-9-_]+):\s*([^;]+);/);
  if (match && /[/*+\-]/.test(match[2])) {
    try {
      // Remove px, evaluate, append px
      const clean = match[2].replace(/px/g, '');
      const result = math.evaluate(clean);
      return `${match[1]}: ${result}px;`;
    } catch {
      return line.trim();
    }
  }
  return line.trim();
});

fs.writeFileSync(output, sanitized.join('\n'), 'utf8');
console.log('Sanitized CSS written to', output); 