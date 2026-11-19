import { createConfiguration } from '@niceprototypes/config-rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import svgr from '@svgr/rollup';
import path from 'node:path';

const configs = createConfiguration({
  plugins: [
    // No `<style>` element in any icon component: each one rendered its own copy, and a page of
    // icons paid style recalculation per instance (backlog 152). After the preset has optimized
    // the paths (it keeps `inlineStyles` off: a `style=` attribute stops it merging paths and
    // applying transforms), the SVG's class rules move onto every element they match and become
    // presentation attributes, which have the lowest specificity, so the Icon wrapper's
    // fill/stroke rules still win.
    svgr({
      svgoConfig: {
        plugins: [
          { name: 'preset-default', params: { overrides: { inlineStyles: false } } },
          { name: 'inlineStyles', params: { onlyMatchedOnce: false } },
          'convertStyleToAttrs',
          // Re-add SVGR's default id prefixing (dropped when we supply our own svgoConfig) so
          // any id stays namespaced per file and can't collide with a consumer's own markup.
          'prefixIds',
        ],
      },
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.ts', '.tsx', '.svg']
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types'
    })
  ]
});

// The SVG layer (src/svg) is plain JS that ships its own declarations, so tsc emits none
// for it. The declaration bundle keeps the SVG layer's import as external and points it at
// the shipped src/svg/index.d.ts.
const svgDeclarations = path.resolve('dist/types/svg/index.js');
const declarationConfig = configs[configs.length - 1];
declarationConfig.external = (id) => /(^|\/)svg\/index\.js$/.test(id);
declarationConfig.output[0].paths = (id) => (id === svgDeclarations ? '../src/svg/index.js' : id);

export default configs;
