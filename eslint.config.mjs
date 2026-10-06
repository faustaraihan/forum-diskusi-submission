import js from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['dist/**', 'storybook-static/**', 'node_modules/**', '.superpowers/**'] },
  js.configs.recommended,
  daStyle,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z]', argsIgnorePattern: '^_' }] },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      globals: { cy: 'readonly', Cypress: 'readonly', describe: 'readonly', it: 'readonly', beforeEach: 'readonly', expect: 'readonly' },
    },
  },
];
