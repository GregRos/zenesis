const path = require("path");
module.exports = {
    root: true,
    extends: ["@gregros/eslint-config"],
    parserOptions: {
        project: [
            "packages/zenesis-schema",
            "packages/zenesis-generate",
            "packages/zenesis"
        ].flatMap(pRoot => [
            path.join(pRoot, "src", "test", "tsconfig.json"),
            path.join(pRoot, "src", "lib", "tsconfig.json")
        ])
    }
};
