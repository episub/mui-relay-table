module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['bigbrain'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        project: ['tsconfig.json'],
      },
      extends: ['bigbrain/react'],
      env: {
        browser: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              camelCase: true,
              pascalCase: true,
            },
          },
        ],
      },
    },
  ],
}
