import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/CacheRoute.js',
  output: {
    file: 'dist/cacheRoute.min.js',
    format: 'cjs'
  },
  external: [
    'react',
    'react-router-dom'
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
