import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import promisePlugin from "eslint-plugin-promise";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: [
      "*.svg",
      "*.png",
      "**/node_modules/**",
      "package.json",
      "package-lock.json",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-native": reactNativePlugin,
      prettier: prettierPlugin,
      import: importPlugin,
      "react-hooks": reactHooksPlugin,
      promise: promisePlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      quotes: ["error", "double", { avoidEscape: true }],
      "max-len": ["error", 350],
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-native/no-unused-styles": "error",
      "@typescript-eslint/no-empty-interface": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "prefer-destructuring": "error",
      "no-nested-ternary": "error",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "import/no-unused-modules": "error",
      "react/react-in-jsx-scope": "off",
      "import/order": [
        "error",
        { "newlines-between": "always", alphabetize: { order: "asc" } },
      ],
      "unused-imports/no-unused-imports": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  ...tseslint.configs.recommended,
];
