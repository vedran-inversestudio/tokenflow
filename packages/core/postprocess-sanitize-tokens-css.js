const fs = require('fs');
const math = require('mathjs');

const input = 'src/tokens/build/tokens.processed.css';
const output = 'src/tokens/build/tokens.sanitized.css';

// Convert 8-digit hex to rgba()
function hexToRgba(hex) {
  if (!/^#([0-9a-fA-F]{8})$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16) / 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const lines = fs.readFileSync(input, 'utf8').split('\n');
const sanitized = lines.map(line => {
  // Match lines like: --var-name: 16 / 100 * 25;
  const match = line.match(/(--[a-zA-Z0-9-_]+):\s*([^;]+);/);
  if (match) {
    // Math expression
    if (/[/*+\-]/.test(match[2])) {
      try {
        const clean = match[2].replace(/px/g, '');
        const result = math.evaluate(clean);
        return `${match[1]}: ${result}px;`;
      } catch {
        return line.trim();
      }
    }
    // 8-digit hex color
    if (/^#([0-9a-fA-F]{8})$/.test(match[2])) {
      return `${match[1]}: ${hexToRgba(match[2])};`;
    }
  }
  return line.trim();
});

fs.writeFileSync(output, sanitized.join('\n'), 'utf8');
console.log('Sanitized CSS written to', output); 