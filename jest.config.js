module.exports = {
  roots: ["<rootDir>"],
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: ["html", "text"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "/examples/",
    "/__mocks__/",
    "/__tests__/",
    "/dist/",
    "/scripts/",
    "/.husky/",
    "/.vscode/",
  ],
  testRegex: ".*__tests__/.+(\\.test\\.(ts|js|tsx|jsx))$",
  transform: {
    "^.+\\.(ts|tsx)$": "@swc/jest",
  },
  testEnvironment: "jsdom",
};
