import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "build/**",
      ".react-router/**",
      "**/*.test.tsx",
      "**/*.test.ts",
      "node_modules/**",
      "public/**",
      "firebaseski/public/**",
      "copyBuildToFirebase.cjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-empty-pattern": "off",
    },
  },
  {
    files: ["app/infra/JeffSkiPageWithContent.tsx"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    files: ["app/infra/firebaseClient.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["app/root.tsx"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    files: ["app/langSupport.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    files: ["app/pokePeruApp/battle/Battle.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["app/pokePeruApp/pokedex/Pokedex.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
  {
    files: ["app/pokePeruApp/battle/Typewriter.tsx"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
    },
  },
  {
    files: ["app/pokePeruApp/pokedex/exportMonsterData.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["app/readingsNihonDe/index.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
);
