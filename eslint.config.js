import js from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  react.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['**/node_modules/**', '**/dist/**'],
    rules: {
      // Adicione regras personalizadas aqui se quiser
    },
  },
];