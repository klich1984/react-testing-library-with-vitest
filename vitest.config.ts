import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // makes some global matchers available for testing.
    setupFiles: ['./src/setupTest.ts'],
    coverage: {
      exclude: [
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.types.ts',
        '**/*.d.ts',
        '**/types',
      ],
      thresholds: {
        functions: 90,
      },
    },
  },
})
