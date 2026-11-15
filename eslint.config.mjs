import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: ['dist/**', 'build/**', '_preview/**', 'node_modules/**', '.claude/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'server/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      'jsx-a11y': {
        components: {
          Button: 'button',
          IconButton: 'button',
          Input: 'input',
          Select: 'select',
          Textarea: 'textarea',
        },
      },
    },
    rules: {
      ...Object.fromEntries(
        Object.entries(jsxA11y.configs.recommended.rules).map(([rule, config]) => {
          if (Array.isArray(config)) {
            return [rule, [config[0] === 'error' ? 'warn' : config[0], ...config.slice(1)]];
          }
          return [rule, config === 'error' ? 'warn' : config];
        })
      ),
      'jsx-a11y/label-has-associated-control': ['warn', { depth: 3 }],
      'jsx-a11y/no-noninteractive-tabindex': ['warn', { tags: [], roles: ['tabpanel', 'region'], allowExpressionValues: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }
);
