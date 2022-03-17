import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.js",
  output: {
    file: "dist/es.js",
    format: "es",
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
