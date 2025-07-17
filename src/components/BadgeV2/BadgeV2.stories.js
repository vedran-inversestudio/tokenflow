import './BadgeV2.js';

export default {
  title: 'Components/BadgeV2',
  component: 'pds-badge-v2',
  tags: ['autodocs'], // Optional, but recommended for SB8+
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'boolean' },
    iconname: { control: 'text' },
    variant: { control: 'text' },
  },
};

const Template = (args) => {
  const el = document.createElement('pds-badge-v2');
  Object.entries(args).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) el.setAttribute(key, '');
      else el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  });
  return el;
};

export const Base = Template.bind({});
Base.args = {
  label: 'Base Badge',
  icon: false,
  variant: 'base',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: 'Info Badge',
  icon: true,
  iconname: 'info',
  variant: 'base',
};

// Add more variants as needed 