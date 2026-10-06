export default {
  stories: ['../src/components/**/*.stories.jsx'],
  core: { disableTelemetry: true },
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: ['../public'],
};
