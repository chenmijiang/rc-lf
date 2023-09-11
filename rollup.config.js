import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

export const file = (type) => `dist/index.${type}.js`;

const input = 'src/index.ts';

export default [
  {
    input,
    output: [
      {
        name: 'rc-lf',
        file: file('umd'),
        format: 'umd',
        globals: {
          react: 'React',
        },
      },
      {
        file: file('esm'),
        format: 'esm',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      babel({
        babelHelpers: 'bundled',
      }),
      typescript(),
      resolve({
        preferBuiltins: true,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      commonjs(),
      esbuild(),
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
