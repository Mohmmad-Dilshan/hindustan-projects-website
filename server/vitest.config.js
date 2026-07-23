/**
 * vitest.config.js — Backend test configuration
 *
 * - ESM project hai isliye vitest natively support karta hai
 * - Coverage: v8 provider
 * - Test files: server/tests/**
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        'src/config/db.js',     // mock DB — test coverage not needed
        'src/index.js',         // server startup
        'src/config/scheduler.js',
      ],
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 35,
      },
    },
    // Environment variables for tests (mock DATABASE_URL so env.js guard passes)
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-jwt-secret-minimum-32-characters-long',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
      CLIENT_URL: 'http://localhost:5173',
      ADMIN_SECRET_PATH: 'test-admin-path',
      PORT: '5001',
      INTEGRATION_MASTER_KEY: 'test-master-key-12345',
    },
  },
})
