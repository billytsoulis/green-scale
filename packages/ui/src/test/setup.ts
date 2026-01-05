import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

/**
 * GreenScale Global Test Setup
 * Path: packages/ui/src/test/setup.ts
 * * This file extends Vitest with jest-dom matchers and handles 
 * * automatic DOM cleanup between tests.
 */

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Automatically cleanup the DOM after each test to prevent collisions
afterEach(() => {
  cleanup();
});