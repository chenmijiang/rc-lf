import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';
const name = 'ReactLocalForage';

export default [
  {
    input,
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
      },
      {
        name,
        file: 'dist/index.umd.js',
        format: 'umd',
        globals: {
          react: 'React',
        },
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      typescript(),
      resolve({
        preferBuiltins: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      esbuild(),
      babel({
        babelHelpers: 'bundled',
      }),
      terser(),
    ],
  },
  {
    input,
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
