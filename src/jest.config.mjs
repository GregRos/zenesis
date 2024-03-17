/** @type {import("jest").Config} */
const config = {
    automock: false,
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir:".",
    testMatch: ["<rootDir>/test/**/*.test.ts"],
    // Should be set via --coverage option
    collectCoverage: false,
    collectCoverageFrom: ["<rootDir>/lib/**/*.ts"],
    coverageDirectory: "<rootDir>/coverage",
    forceExit: true,
    moduleNameMapper: {
        "^@lib/(.*)$": "<rootDir>/lib/$1",
        "^@lib$": "<rootDir>/lib"
    },
    globals: {
        defaults: {}
    },
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "<rootDir>/test/tsconfig.json",
            transpileOnly: true
        }]
    }
};

export default config
