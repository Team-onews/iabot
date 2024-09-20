import tsParser from '@typescript-eslint/parser';
import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');
const prettierignorePath = path.resolve(__dirname, '.prettierignore');

export default [
  includeIgnoreFile(gitignorePath),
  includeIgnoreFile(prettierignorePath),
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 13,
      sourceType: 'module',
    },
    rules: {
      semi: 'error',
      'no-eval': 'error',
      'no-empty-function': 'error',
      'no-inline-comments': 'error',
      'no-multi-spaces': 'error',
      'no-var': 'error',
      'no-debugger': 'error',
      'no-tabs': 'error',
      'no-unused-vars': 'warn',
      strict: 'error',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],

      'max-nested-callbacks': [
        'error',
        {
          max: 2,
        },
      ],

      'no-floating-decimal': 'error',
      'no-trailing-spaces': 'error',
    },
  },
  {
    files: ['**/*.ts'],
  },
];
