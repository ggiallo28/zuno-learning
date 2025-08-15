/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: [
        'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'
      ],
      exclude: [
        'node_modules',
        'dist',
        'build',
        'amplify',
        'src/scripts/test*.ts',
        'src/test/setup.ts',
        'tests/e2e/**' // Exclude E2E tests from unit test runs
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          'tests/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
          'src/scripts/',
          'src/ui-components/',
          'amplify/',
          'dist/',
          'build/',
          'src/aws-exports.js',
          'src/amplifyconfiguration.json'
        ],
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
          }
        }
      },
      testTimeout: 10000,
      hookTimeout: 10000
    }
  })
)