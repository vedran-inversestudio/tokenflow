import '../Icon/Icon.js';
import './Badge.js';
import iconNames from '../Icon/icon-list.json';

export default {
  title: 'Components/Badge',
  parameters: {
    docs: {
      description: {
        component: `
The <code>pds-badge</code> web component is a token-driven badge that can display an optional icon. All spacing, color, border, font, and icon placement are mapped to Figma tokens for absolute accuracy.

**Tokens used:**
- Padding: <code>--pillow-spacing-container-0_5x</code> (8px horizontal), <code>--pillow-spacing-container-none</code> (0px vertical)
- Gap: <code>--pillow-spacing-container-0_25x</code> (4px)
- Border radius: <code>--pillow-border-radius-container-pill</code> (1000px)
- Font size: 12px, font weight: 700
- Border width: <code>--pillow-border-width-icon-stroke-s</code> (1px)
- Colors: strictly mapped to Figma tokens per variant

**Usage:**
<pre><code>&lt;pds-badge variant="info" label="Info" icon iconname="info"&gt;&lt;/pds-badge&gt;</code></pre>
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['base', 'info', 'success', 'warning', 'danger'],
      description: 'Visual style variant',
      table: { category: 'Props' },
    },
    label: {
      control: 'text',
      description: 'Badge label',
      table: { category: 'Props' },
    },
    icon: {
      control: 'boolean',
      description: 'Show icon',
      table: { category: 'Props' },
    },
    iconName: {
      control: { type: 'text' },
      options: iconNames,
      description: 'Icon name (see icon-list.json for all options)',
      table: { category: 'Props' },
    },
  },
  args: {
    variant: 'base',
    label: 'Badge',
    icon: true,
    iconName: 'info',
  },
};

const Template = (args) => {
  return `
    <pds-badge
      variant="${args.variant}"
      label="${args.label}"
      ${args.icon ? 'icon' : ''}
      iconname="${args.iconName}"
    ></pds-badge>
  `;
};

export const Playground = Template.bind({});
Playground.args = {
  variant: 'base',
  label: 'Badge',
  icon: true,
  iconName: 'info',
}; 