import './Button.js';
import '../Icon/Icon.js';
import iconNames from '../Icon/icon-list.json';

export default {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component: `
The \`pds-button\` web component is a fully tokenized, accessible button supporting multiple variants, sizes, and icon slots.

## Usage

\`\`\`html
<pds-button variant="filled" size="large" state="initial">
  <pds-icon name="search" variant="large" slot="icon-left"></pds-icon>
  Primary
  <pds-icon name="arrow-right" variant="large" slot="icon-right"></pds-icon>
</pds-button>
\`\`\`

- **Variants:** filled, outlined, transparent
- **Sizes:** large, medium, small
- **States:** initial, hover, active, disabled
- **Slots:** icon-left, icon-right, default (label)

## Icon Only Buttons

To create an icon-only button, use the <code>iconOnly</code> and <code>iconOnlyName</code> args, or provide only an icon in the slot:

\`\`\`html
<pds-button variant="filled" size="medium" state="initial">
  <pds-icon name="search" variant="medium" slot="icon-left"></pds-icon>
</pds-button>
\`\`\`

---
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'transparent'],
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small'],
    },
    state: {
      control: { type: 'select' },
      options: ['initial', 'hover', 'active', 'disabled'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    iconLeft: { control: 'boolean', name: 'Icon Left' },
    iconLeftName: { control: 'text', name: 'Icon Left Name', description: 'Icon name (autocomplete: see docs)' },
    iconRight: { control: 'boolean', name: 'Icon Right' },
    iconRightName: { control: 'text', name: 'Icon Right Name', description: 'Icon name (autocomplete: see docs)' },
    iconOnly: { control: 'boolean', name: 'Icon Only' },
    iconOnlyName: { control: 'text', name: 'Icon Only Name', description: 'Icon name (autocomplete: see docs)' },
  },
  args: {
    variant: 'filled',
    size: 'medium',
    state: 'initial',
    disabled: false,
    label: 'Button',
    iconLeft: true,
    iconLeftName: 'placeholder',
    iconRight: true,
    iconRightName: 'placeholder',
    iconOnly: false,
    iconOnlyName: 'placeholder',
  },
};

const Template = (args) => {
  const key = [
    args.variant, args.size, args.state, args.disabled, args.label,
    args.iconLeft, args.iconLeftName, args.iconRight, args.iconRightName,
    args.iconOnly, args.iconOnlyName
  ].join('-');
  if (args.iconOnly) {
    return `
      <pds-button
        key="${key}"
        variant="${args.variant}"
        size="${args.size}"
        state="${args.state}"
        ${args.disabled ? 'disabled' : ''}
      >
        <pds-icon name="${args.iconOnlyName}" variant="${args.size}" slot="icon-left"></pds-icon>
      </pds-button>
    `;
  }
  return `
    <pds-button
      key="${key}"
      variant="${args.variant}"
      size="${args.size}"
      state="${args.state}"
      ${args.disabled ? 'disabled' : ''}
    >
      ${args.iconLeft ? `<pds-icon name="${args.iconLeftName}" variant="${args.size}" slot="icon-left"></pds-icon>` : ''}
      ${args.label}
      ${args.iconRight ? `<pds-icon name="${args.iconRightName}" variant="${args.size}" slot="icon-right"></pds-icon>` : ''}
    </pds-button>
  `;
};

export const Playground = Template.bind({});
Playground.args = {
  variant: 'filled',
  size: 'large',
  state: 'initial',
  label: 'Primary',
  iconLeft: true,
  iconLeftName: 'placeholder',
  iconRight: true,
  iconRightName: 'placeholder',
  iconOnly: false,
  iconOnlyName: 'placeholder',
}; 