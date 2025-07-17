# Tokenflow Design System

## Project Structure

```
/src
  /components
    /Button
      Button.js
      Button.stories.js
      Button.test.js
      Button.css
    ... (other components)
  /icons
    ... (SVG icon files)
  /tokens
    ... (design token JSON files)
  /utils
    ... (helper JS/TS files if needed)
.storybook
  main.js
  preview.js
  ... (other Storybook config)
public/
  ... (static assets, if needed)
test.html
package.json
README.md
```

- All components are in `/src/components/ComponentName/`.
- All SVG icons are in `/src/icons/`.
- All design tokens are in `/src/tokens/`.
- Storybook config is in `/.storybook/`.

## Design Token Pipeline & Workflow

### Overview
This project manages design tokens exported from Figma/Token Studio and uses Style Dictionary to generate CSS variables for use in your component library (e.g., Storybook). The goal is to ensure that all design tokens (colors, spacing, typography, etc.) are accurately reflected in your codebase, with variable names and values matching Figma/Token Studio exactly.

### Token Pipeline Workflow

#### 1. Token Source Structure
- **Design tokens** are exported from Figma/Token Studio and stored in `src/tokens/original/`.
- **Core tokens** (the atomic values) are in `src/tokens/original/core/`.
- **Alias tokens** (which reference core tokens) and component-level tokens are in other files in `src/tokens/original/`.

#### 2. Flattening Script
- The script `generate-flat-aliases.js` is used to:
  - Flatten both core and alias tokens into a single flat object.
  - Ensure all keys are prefixed with `pillow.` to match Figma/Token Studio naming.
  - Output the result to `src/tokens/aliases.flat.json`.
- The script now merges both core and alias tokens, so all references can be resolved.

#### 3. Style Dictionary Configuration
- The Style Dictionary config (`style-dictionary.config.mjs`) is set to use only `aliases.flat.json` as the source.
- This avoids issues with deeply nested or empty files and ensures a flat, reference-free token set for CSS output.

#### 4. CSS Generation
- Run the following commands to generate and post-process tokens:
  ```sh
  node generate-flat-aliases.js
  npm run tokens:all
  ```
  - `npm run tokens:all` runs both the Style Dictionary build and a post-processing script (if needed).
- The output CSS variables are written to `src/tokens/build/tokens.processed.css`.

### Naming and Value Conventions
- **Variable names** in the CSS output must match Figma/Token Studio exactly (e.g., `--pillow-typography-interactive-strong-small-font-family`).
- **Values** should be primitives (e.g., `#fff`, `12px`, `Manrope`), not unresolved references.

### Common Issues & Troubleshooting

- **Unresolved References:**  
  If Style Dictionary reports unresolved references, check that all referenced tokens exist in `aliases.flat.json` and that all keys have the correct `pillow.` prefix.

- **[object Object] in CSS:**  
  This means a complex object (like typography) was not flattened into sub-properties. The flattening script must output each sub-property as a separate variable.

- **Badge/Component Styling Not Updating:**  
  - Ensure the required tokens are present in the CSS output.
  - Check that Storybook is using the latest CSS build.
  - Restart Storybook and clear browser cache if needed.

- **Multiple Storybook Instances:**  
  Use `pkill -f storybook` to kill all running Storybook processes before starting a new one.

### Current Status
- The flattening script and Style Dictionary config are set up to output all tokens (core + aliases) in a flat structure with correct naming.
- The CSS output now contains the expected variables and values.
- Some component styling (e.g., Badge) may still not reflect changes—this may require further investigation into CSS loading, caching, or component implementation.

### Next Steps
1. Double-check that the generated CSS is being loaded by Storybook.
2. Inspect the Badge component’s rendered HTML/CSS to see which variables are missing or not applied.
3. Continue refining the pipeline or component code as needed.
