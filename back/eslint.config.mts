import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      '**/tests/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/*.config.js',
      '**/prisma/**',
      '**/generated/**']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {

    }
  }
];