import baseConfig from "@repo/eslint/base";
import reactConfig from "@repo/eslint/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
