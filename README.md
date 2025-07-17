# Tokenflow

A modern design system pipeline that syncs Figma/Token Studio design tokens with your codebase, ensuring pixel-perfect, up-to-date UI components and documentation via Storybook.

---

## Features

- **Figma/Token Studio Integration:**  
  Syncs design tokens (color, spacing, typography, etc.) directly from Figma/Token Studio exports.
- **Automated Token Pipeline:**  
  Flattens, resolves, and sanitizes all tokens (core + aliases), including math expressions, to generate clean CSS variables.
- **Exact Naming:**  
  CSS variable names and values match Figma/Token Studio exactly (including `pillow.` prefix and underscores).
- **Storybook Integration:**  
  All components previewed in Storybook use the generated design tokens for accurate, real-time theming.
- **Extensible & Documented:**  
  Easy to add new tokens, update from Figma, and extend the system.

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-org/tokenflow.git
cd tokenflow
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root with your Figma API credentials:

```env
FIGMA_FILE_KEY=your-figma-file-key
FIGMA_TOKEN=your-figma-personal-access-token
```

> **Note:**  
> `.env` is in `.gitignore` and should not be committed.  
> You may provide a `.env.example` for collaborators.

### 4. Generate and Build Tokens

```sh
node generate-flat-aliases.js
npm run tokens:all
```
- This will flatten and resolve all tokens, then build and sanitize the CSS output.

### 5. Start Storybook

```sh
npm run storybook
```
- Storybook will use the generated CSS variables for all components.

---

## Project Structure

```
/src
  /components        # UI components (Button, Badge, etc.)
  /tokens
    /original        # Raw Figma/Token Studio exports (core, components, etc.)
    /build           # Generated CSS files (tokens.sanitized.css, etc.)
    aliases.flat.json# Flattened, resolved tokens (input for Style Dictionary)
  /stories           # Storybook stories and assets
  /utils             # Helper scripts
/.storybook          # Storybook config (loads tokens.sanitized.css)
generate-flat-aliases.js   # Token flattening script
postprocess-sanitize-tokens-css.js # CSS sanitizer
style-dictionary.config.mjs        # Style Dictionary config
fetch-figma-data.mjs              # Figma API fetch script
```

---

## Design Token Pipeline

1. **Export tokens from Figma/Token Studio** to `src/tokens/original/`.
2. **Flatten and resolve tokens** using `generate-flat-aliases.js`:
   - Merges core and alias tokens.
   - Recursively resolves references and math expressions.
   - Outputs to `src/tokens/aliases.flat.json`.
3. **Build CSS variables** with Style Dictionary:
   - Uses only the flat alias file as input.
   - Outputs to `src/tokens/build/tokens.processed.css`.
4. **Sanitize CSS** (optional but recommended):
   - Run `postprocess-sanitize-tokens-css.js` to evaluate any remaining math and clean up the CSS.
   - Output: `src/tokens/build/tokens.sanitized.css`.
5. **Storybook loads the sanitized CSS** via `.storybook/preview.js`.

---

## Example Token Files

**Core Token (color):**
```json
{
  "pillow": {
    "core": {
      "color": {
        "neutral": {
          "25": { "$type": "color", "$value": "hsl(0, 0%, 100%)" }
        }
      }
    }
  }
}
```

**Component Alias Token:**
```json
{
  "pillow": {
    "color": {
      "textfield": {
        "background": {
          "default": {
            "$type": "color",
            "$value": "{pillow.core.color.neutral.25}"
          }
        }
      }
    }
  }
}
```

**Flattened Output (aliases.flat.json):**
```json
{
  "pillow.core.color.neutral.25": { "$value": "hsl(0, 0%, 100%)" },
  "pillow.color.textfield.background.default": { "$value": "hsl(0, 0%, 100%)" }
}
```

**Sanitized CSS Output:**
```css
:root {
  --pillow-core-color-neutral-25: hsl(0, 0%, 100%);
  --pillow-color-textfield-background-default: hsl(0, 0%, 100%);
}
```

---

## Usage in Components

- Import the generated CSS in your app or Storybook (already set up in `.storybook/preview.js`).
- Use CSS variables in your components:
  ```css
  color: var(--pillow-color-textfield-background-default);
  ```

---

## Updating Tokens from Figma

1. Export new tokens from Figma/Token Studio to `src/tokens/original/`.
2. Run the flattening and build scripts:
   ```sh
   node generate-flat-aliases.js
   npm run tokens:all
   ```
3. Restart Storybook if running.

---

## Troubleshooting

- **Unresolved References:**  
  Ensure all referenced tokens exist in `aliases.flat.json` and have the correct prefix.
- **[object Object] in CSS:**  
  The flattening script must output each sub-property as a separate variable.
- **Component Styling Not Updating:**  
  - Ensure Storybook is using the latest CSS build.
  - Restart Storybook and clear browser cache if needed.
- **Multiple Storybook Instances:**  
  Use `pkill -f storybook` to kill all running Storybook processes before starting a new one.

---

## Contributing

- Fork the repo and create a feature branch.
- Follow the established token and component structure.
- Run all token and build scripts before submitting a PR.

---

## License

[MIT] or your license here.

---
