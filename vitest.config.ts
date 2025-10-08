import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';
import path from 'path'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      // Include only unit tests under tests/unit
      include: ['tests/unit/**/*.spec.{ts,tsx,js,jsx}'],
      // Keep default excludes but do not exclude tests/unit
      exclude: configDefaults.exclude.filter((e) => e !== 'tests/**/*.spec.{js,ts,jsx,tsx}'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'components'),
      },
    },
  }),
);
