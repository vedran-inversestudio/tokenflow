

/** @type { import('@storybook/web-components-webpack5').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials"
  ],
  "framework": {
    "name": "@storybook/web-components-webpack5",
    "options": {}
  },
  "docs": {
    "autodocs": true,
  },
  staticDirs: ['../public'],
};
export default config;