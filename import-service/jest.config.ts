import type { Config } from '@jest/types';

/**
 * How to import jest?
 * 1. `npm install -D jest @types/jest @babel/preset-env @babel/preset-typescript`
 * 2. Paste `babel.config.json`
 * 3. Paste this file (`jest.config.json`)
 */
const config: Config.InitialOptions = {
  moduleNameMapper: {
    "^@functions(.*)$": "<rootDir>/src/functions$1",
    "^@libs(.*)$": "<rootDir>/src/libs$1",
    "^src(.*)$": "<rootDir>/src$1"
  }
};
export default config