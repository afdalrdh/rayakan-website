import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      // Unused imports are removed by `npm run lint -- --fix`.
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" }],
    },
  },
  {
    // Code under src/server talks to the database and secrets: UI code may only use it through
    // server actions (src/app/actions) or server components, never from "use client" files.
    files: ["src/components/**/*.{ts,tsx}", "src/themes/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"],
    ignores: ["src/components/site/PublicSite.tsx"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [{ group: ["@/server/*"], message: "Pakai server action (src/app/actions) atau ambil datanya di page/server component." }] }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "coverage/**"]),
]);

export default eslintConfig;
