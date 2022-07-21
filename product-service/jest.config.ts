import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleNameMapper: {
    "^@functions(.*)$": "<rootDir>/src/functions$1",
    "^@libs(.*)$": "<rootDir>/src/libs$1",
    "^src(.*)$": "<rootDir>/src$1"
  }
};
export default config