import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,vue}"] }, // 適用的檔案類型
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended, // 基本的 JavaScript 規範
  ...pluginVue.configs["flat/essential"], // Vue 的基本規範
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules, // 啟用 Prettier 規則
    },
  },
  prettier, // 排除與 Prettier 衝突的 ESLint 規則
];
