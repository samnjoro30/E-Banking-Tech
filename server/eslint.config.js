import js from '@eslint/js';

export default [
  // Base recommended rules
  js.configs.recommended,

  // Backend (CommonJS) rules
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script', // ✅ IMPORTANT (CommonJS)
      globals: {
        // Node / CommonJS globals
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',

        // Timers
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        console: 'readonly',
      },
    },

    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
    },
  },

  // Test files
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  },

  // Ignore folders
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'logs/**',
      'drizzle/**',
      'eslint.config.js', // ✅ IMPORTANT
    ],
  },
];
