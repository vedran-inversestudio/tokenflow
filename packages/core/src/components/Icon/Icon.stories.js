import './Icon.js';
import iconNames from './icon-list.json';

export default {
  title: 'Components/Icon',
  parameters: {
    docs: {
      description: {
        component: `
The <code>pds-icon</code> web component renders SVG icons using design tokens for size, color, and stroke width. All values are strictly mapped to Figma tokens for accuracy.

**Tokens used:**
- Sizing: <code>--pillow-dimension-icon-0_5x</code> (12px), <code>--pillow-dimension-icon-0_67x</code> (16px), <code>--pillow-dimension-icon-0_83x</code> (20px)
- Stroke width: <code>--pillow-border-width-icon-stroke-m</code> (2px)
- Color: <code>currentColor</code> (set via <code>stroke-color</code> prop or CSS)

**Usage:**

<pre><code>&lt;pds-icon name="search" variant="medium" stroke-color="var(--pillow-color-text-and-icon-primary)"&gt;&lt;/pds-icon&gt;</code></pre>
        `,
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      options: iconNames,
      description: 'Icon name (see icon-list.json for all options)',
      table: { category: 'Props' },
    },
    variant: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant (tokenized)',
      table: { category: 'Props' },
    },
    strokeColor: {
      control: 'color',
      description: 'Stroke color (token or custom)',
      table: { category: 'Props' },
    },
    strokeWidth: {
      control: 'text',
      description: 'Stroke width (token or px)',
      table: { category: 'Props' },
    },
  },
  args: {
    name: 'search',
    variant: 'medium',
    strokeColor: 'var(--pillow-color-text-and-icon-primary, #019CDE)',
    strokeWidth: 'var(--pillow-border-width-icon-stroke-m, 2px)',
  },
};

const Template = (args) => {
  return `
    <pds-icon
      name="${args.name}"
      variant="${args.variant}"
      stroke-color="${args.strokeColor}"
      stroke-width="${args.strokeWidth}"
    ></pds-icon>
  `;
};

export const Playground = Template.bind({});
Playground.args = {
  name: 'search',
  variant: 'medium',
  strokeColor: 'var(--pillow-color-text-and-icon-primary, #019CDE)',
  strokeWidth: 'var(--pillow-border-width-icon-stroke-m, 2px)',
}; 