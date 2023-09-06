import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

export const file = (type) => `dist/index.${type}.js`;

export default {
  input: 'src/index.ts',
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
  ],
};
