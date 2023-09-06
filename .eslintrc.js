const path = require("path");
module.exports = {
    root: true,
    extends: ["@gregros/eslint-config"],
    rules: {
        "no-duplicate-imports": "off",
        "@typescript-eslint/ban-types": "off"
    },
    parserOptions: {
        project: [
            path.join(__dirname, "src/lib/tsconfig.json"),
            path.join(__dirname, "src/test/tsconfig.json")
        ]
    }
};
