// generate-flat-aliases.js
// Usage: node generate-flat-aliases.js
// Recursively scans src/tokens/original for non-core JSON files, finds all tokens with $value referencing core tokens, and outputs a flat alias map to src/tokens/aliases.flat.json.
// Only outputs aliases for references that exist in the merged core tokens, and resolves the value recursively.

const fs = require('fs/promises');
const path = require('path');

function get(obj, pathArr) {
  return pathArr.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

const ORIGINAL_DIR = path.join(__dirname, 'src/tokens/original');
const CORE_DIR = path.join(ORIGINAL_DIR, 'core');
const OUTPUT_FILE = path.join(__dirname, 'src/tokens/aliases.flat.json');

function isCoreFile(filePath) {
  return filePath.split(path.sep).includes('core');
}

function kebabCasePath(arr) {
  return arr.join('-').replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').toLowerCase();
}

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

// Patch missing $value for transparent color tokens
function patchMissingTransparentValue(obj, pathArr = []) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (
        key.toLowerCase().includes('transparent') &&
        obj[key]['$type'] === 'color'
      ) {
        obj[key]['$value'] = '#1b1b1b00'; // Always set to fully transparent dark gray
      }
      patchMissingTransparentValue(obj[key], [...pathArr, key]);
    }
  }
}

async function loadCoreTokens() {
  let merged = {};
  async function processDir(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const json = await readJson(fullPath);
        if (json.pillow) {
          patchMissingTransparentValue(json.pillow); // Patch before merging
          merged = deepMerge(merged, json.pillow);
        }
      }
    }
  }
  await processDir(CORE_DIR);
  return merged;
}

function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      !(source[key] instanceof Date)
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function resolveValue(refPath, coreTokens, seen = new Set()) {
  let token = get(coreTokens, refPath);
  let depth = 0;
  while (token && typeof token === 'object' && '$value' in token) {
    if (typeof token.$value === 'string' && token.$value.startsWith('{pillow.')) {
      // Prevent infinite loops
      const ref = token.$value.replace(/[{}]/g, '').split('.').slice(1); // remove 'pillow'
      const refKey = ref.join('.');
      if (seen.has(refKey)) {
        console.log(`Circular reference detected for ${refKey}`);
        return undefined;
      }
      seen.add(refKey);
      token = get(coreTokens, ref);
      refPath = ref;
      depth++;
      if (depth > 20) {
        console.log(`Reference chain too deep for ${refKey}`);
        return undefined;
      }
    } else {
      return token.$value;
    }
  }
  // If token is a primitive value
  if (token !== undefined && typeof token !== 'object') {
    return token;
  }
  return undefined;
}

// --- BEGIN ENHANCED MATH RESOLUTION ---
const math = require('mathjs');

function extractReferences(expr) {
  // Find all {pillow...} references in the string
  const regex = /{([^}]+)}/g;
  let match;
  const refs = [];
  while ((match = regex.exec(expr)) !== null) {
    refs.push(match[1]);
  }
  return refs;
}

function resolveReferencesInExpr(expr, coreTokens, seen = new Set()) {
  // Replace all {pillow...} with their resolved values
  return expr.replace(/\{([^}]+)\}/g, (match, refPathStr) => {
    const refPath = refPathStr.split('.');
    if (refPath[0] === 'pillow') refPath.shift();
    const resolved = resolveValueForMath(refPath, coreTokens, seen);
    if (resolved === undefined) {
      throw new Error(`Could not resolve reference: {${refPathStr}}`);
    }
    return resolved;
  });
}

function resolveValueForMath(refPath, coreTokens, seen = new Set()) {
  // Like resolveValue, but always returns a primitive (number or string)
  let token = get(coreTokens, refPath);
  let depth = 0;
  while (token && typeof token === 'object' && '$value' in token) {
    if (typeof token.$value === 'string' && token.$value.match(/\{pillow\./)) {
      // Prevent infinite loops
      const refs = extractReferences(token.$value);
      let resolvedExpr = token.$value;
      for (const ref of refs) {
        const refKey = ref.split('.').slice(1).join('.');
        if (seen.has(refKey)) {
          throw new Error(`Circular reference detected for ${refKey}`);
        }
        seen.add(refKey);
        const refPathArr = ref.split('.');
        if (refPathArr[0] === 'pillow') refPathArr.shift();
        const resolved = resolveValueForMath(refPathArr, coreTokens, seen);
        if (resolved === undefined) {
          throw new Error(`Could not resolve reference: {${ref}}`);
        }
        resolvedExpr = resolvedExpr.replace(`{${ref}}`, resolved);
      }
      // After all references are replaced, try to evaluate if it's a math expression
      try {
        return math.evaluate(resolvedExpr);
      } catch {
        return resolvedExpr;
      }
    } else {
      return token.$value;
    }
    depth++;
    if (depth > 20) {
      throw new Error(`Reference chain too deep for ${refPath.join('.')}`);
    }
  }
  // If token is a primitive value
  if (token !== undefined && typeof token !== 'object') {
    return token;
  }
  return undefined;
}

function resolveMathValue(expr, coreTokens) {
  try {
    const replaced = resolveReferencesInExpr(expr, coreTokens);
    // Evaluate the math expression
    return math.evaluate(replaced);
  } catch (e) {
    return undefined;
  }
}

function findAliases(obj, pathArr = [], aliases = {}, coreTokens = {}) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (
        '$value' in obj[key] &&
        typeof obj[key]['$value'] === 'string' &&
        obj[key]['$type'] === 'color'
      ) {
        // Handle color tokens: convert 8-digit hex to rgba
        let value = obj[key]['$value'];
        value = hexToRgba(value);
        aliases[kebabCasePath([...pathArr, key])] = {
          ...(obj[key]['$type'] ? { $type: obj[key]['$type'] } : {}),
          $value: value
        };
      } else if (
        '$value' in obj[key] &&
        typeof obj[key]['$value'] === 'string' &&
        obj[key]['$value'].startsWith('{pillow.core.')
      ) {
        const flatKey = kebabCasePath([...pathArr, key]);
        const expr = obj[key]['$value'];
        let resolved = undefined;
        // If the value is a math expression or reference, resolve it
        if (expr.match(/\{pillow\./) && /[\*\/+\-]/.test(expr)) {
          resolved = resolveMathValue(expr, coreTokens);
        } else {
          // Fallback to original logic for direct references
          const refPath = expr.replace(/[{}]/g, '').split('.').slice(1); // remove 'pillow'
          resolved = resolveValueForMath(refPath, coreTokens);
        }
        if (resolved !== undefined) {
          aliases[flatKey] = {
            ...(obj[key]['$type'] ? { $type: obj[key]['$type'] } : {}),
            $value: resolved
          };
        } else {
          console.log(`Skipping alias ${flatKey}: could not fully resolve ${expr}`);
        }
      } else {
        findAliases(obj[key], [...pathArr, key], aliases, coreTokens);
      }
    }
  }
  return aliases;
}
// --- END ENHANCED MATH RESOLUTION ---

// --- BEGIN NESTED OUTPUT ---
function setNested(obj, pathArr, value) {
  let curr = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (!curr[pathArr[i]]) curr[pathArr[i]] = {};
    curr = curr[pathArr[i]];
  }
  curr[pathArr[pathArr.length - 1]] = { $value: value };
}

function flattenAllTokensToNested(obj, pathArr = [], nested = {}, coreTokens = {}) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if ('$value' in obj[key]) {
        let value = obj[key]['$value'];
        if (typeof value === 'string' && value.match(/^\{pillow\./)) {
          const refPath = value.replace(/[{}]/g, '').split('.').slice(1);
          const resolved = resolveValueForMath(refPath, coreTokens);
          if (resolved !== undefined) value = resolved;
        }
        setNested(nested, ['pillow', ...pathArr, key], value);
      } else {
        flattenAllTokensToNested(obj[key], [...pathArr, key], nested, coreTokens);
      }
    }
  }
  return nested;
}

function isMathExpression(str) {
  // Match if the string contains math operators
  return typeof str === 'string' && /[/*+\-]/.test(str);
}

function resolveReferencesInString(expr, allTokens) {
  return expr.replace(/{pillow[^}]+}/g, (match) => {
    const resolved = resolveReference(match, allTokens);
    // If the resolved value is still a reference, leave as is to avoid infinite loop
    if (typeof resolved === 'string' && resolved.startsWith('{pillow')) return resolved;
    return resolved;
  });
}

function evalMathPx(expr, allTokens) {
  if (typeof expr !== 'string') return expr;
  // Replace all references in the expression
  const withResolved = resolveReferencesInString(expr, allTokens);
  // Remove all 'px' for math evaluation
  const clean = withResolved.replace(/px/g, '');
  try {
    const result = math.evaluate(clean);
    if (isFinite(result)) return result + 'px';
    return expr;
  } catch {
    return expr;
  }
}

function resolveReference(value, allTokens, seen = new Set()) {
  if (typeof value === 'string' && value.startsWith('{pillow.')) {
    const refPath = value.replace(/[{}]/g, '').split('.');
    let ref = allTokens;
    for (let i = 0; i < refPath.length; i++) {
      if (ref && ref[refPath[i]]) {
        ref = ref[refPath[i]];
      } else {
        return value; // unresolved
      }
    }
    if (ref && typeof ref.$value !== 'undefined') {
      // Prevent infinite loops
      const refKey = refPath.join('.');
      if (seen.has(refKey)) return value;
      seen.add(refKey);
      return resolveReference(ref.$value, allTokens, seen);
    }
    return ref;
  }
  return value;
}

function flattenTokens(obj, prefix = '', result = {}, allTokens = null) {
  if (!allTokens) allTokens = obj; // root call
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !('$value' in obj[key])) {
      flattenTokens(obj[key], prefix ? `${prefix}.${key}` : key, result, allTokens);
    } else if (obj[key] && typeof obj[key].$value === 'object') {
      for (const subKey in obj[key].$value) {
        let value = obj[key].$value[subKey];
        value = resolveReference(value, allTokens);
        // Handle color tokens: convert 8-digit hex to rgba
        if (obj[key]['$type'] === 'color') value = hexToRgba(value);
        result[`${prefix}.${key}.${subKey}`] = { $value: value };
      }
    } else if (obj[key] && '$value' in obj[key]) {
      let value = obj[key].$value;
      value = resolveReference(value, allTokens);
      // Handle color tokens: convert 8-digit hex to rgba
      if (obj[key]['$type'] === 'color') value = hexToRgba(value);
      result[prefix ? `${prefix}.${key}` : key] = { $value: value };
    }
  }
  return result;
}
// --- END NESTED OUTPUT ---

// Utility: Convert 8-digit hex to rgba()
function hexToRgba(hex) {
  if (typeof hex !== 'string') return hex;
  const match = hex.match(/^#([0-9a-fA-F]{8})$/);
  if (!match) return hex;
  const h = match[1];
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = parseInt(h.slice(6, 8), 16) / 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

async function processDir(dir, aliases = {}, coreTokens = {}) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDir(fullPath, aliases, coreTokens);
    } else if (entry.isFile() && entry.name.endsWith('.json') && !isCoreFile(fullPath)) {
      const json = await readJson(fullPath);
      if (json.pillow) {
        findAliases(json.pillow, [], aliases, coreTokens);
      }
    }
  }
  return aliases;
}

async function main() {
  const coreTokens = await loadCoreTokens();
  let merged = {};
  async function processAll(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processAll(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const json = await readJson(fullPath);
        if (json.pillow) {
          patchMissingTransparentValue(json.pillow); // Patch before merging
          merged = deepMerge(merged, json.pillow);
        }
      }
    }
  }
  await processAll(ORIGINAL_DIR);
  // Build flat objects for both core and aliases, then merge
  const coreFlat = flattenTokens({ pillow: coreTokens });
  const aliasFlat = flattenTokens({ pillow: merged });
  const allFlat = { ...coreFlat, ...aliasFlat };
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(allFlat, null, 2));
  console.log(`All tokens (core + aliases) written in flat format to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}); 