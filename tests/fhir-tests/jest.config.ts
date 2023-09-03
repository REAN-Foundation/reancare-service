// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose   : false,
    transform : {
        ".(ts|tsx)" : "ts-jest"
    },
    testRegex              : "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "moduleFileExtensions" : [
        "ts",
        "tsx",
        "js"
    ],
    globalSetup        : "<rootDir>/tests/test.setup/global.setup.ts",
    globalTeardown     : "<rootDir>/tests/test.setup/global.teardown.ts",
    setupFilesAfterEnv : ['<rootDir>/tests/test.setup/jest.setup.ts'],
    testTimeout        : 120000,
};

export default config;

// // Or async function
// export default async (): Promise<Config.InitialOptions> => {
//   return {
//     verbose : true,
//   };
// };
