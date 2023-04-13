import { defineConfig, Plugin } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import { basename } from "path";
import { writeFileSync } from "fs";

const pluginName = basename(process.cwd());

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: `dist/${pluginName}.js`,
      format: "cjs",
      strict: false,
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({ minify: true, target: "ES2019" })
  ],
});