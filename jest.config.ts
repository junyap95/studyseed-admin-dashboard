// module.exports = {
//   preset: "ts-jest",
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest to process TypeScript files
//     "^.+\\.(js|jsx|mjs)$": "babel-jest", // Use babel-jest to process JS and JSX files
//   },
//   testEnvironment: "jsdom", // Set the test environment to jsdom to simulate the browser
//   moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"], // Extensions Jest should consider
//   transformIgnorePatterns: [
//     "node_modules/(?!(@some-package|another-package)/)", // If you need to transpile certain packages
//   ],
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1",
//   },
// };

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  preset: "ts-jest",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
