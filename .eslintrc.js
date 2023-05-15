module.exports = {
  extends: [
    "@alergeek-ventures/eslint-config/typescript",
    "@alergeek-ventures/eslint-config/tests"
  ],
  parser: "@typescript-eslint/parser",
  root: true,
  parserOptions: {
    project: ["./tsconfig.json"]
  },
  ignorePatterns: [
    "graphql.ts",
    "*.graphql",
    ".next",
    "node_modules",
    "*.js",
    "**/*.test.ts"
  ],
  rules: {
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-magic-numbers": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    // disables console.log rule
    "no-console": "off",
    "no-magic-numbers": "off",
    "no-unused-vars": "off",
    "no-shadow": "off"
  }
};
