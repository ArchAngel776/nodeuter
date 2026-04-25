import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const tsconfigRootDir = new URL(".", import.meta.url).pathname;

export default [
  {
    ignores: ["dist/**", "node_modules/**", ".yarn/**"]
  },
  {
    files: ["*.cjs", "*.mjs"],
    languageOptions: {
      globals: globals.node
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["src/**/*.ts"]
  })),
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  }
];
