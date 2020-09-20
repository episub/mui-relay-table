import ts from '@wessberg/rollup-plugin-ts'
import external from 'rollup-plugin-auto-external'
import pkg from './package.json'

const rollupConifg = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.browser,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  plugins: [external(), ts()],
}

export default rollupConifg
