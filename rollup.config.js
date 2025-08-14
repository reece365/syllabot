import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    // the entry point file described above
    input: 'src/chat/script.js',
    // the output for the build folder described above
    output: {
      file: 'public/chat/bundle.js',
      // Optional and for development only. This provides the ability to
      // map the built code back to the original source format when debugging.
      sourcemap: 'inline',
      // Configure Rollup to convert your module code to a scoped function
      // that "immediate invokes". See the Rollup documentation for more
      // information: https://rollupjs.org/guide/en/#outputformat
      format: 'iife',
      compact: true
    },
    // Add the plugin to map import paths to dependencies
    // installed with npm
    plugins: [nodeResolve()]
  },
  {
    // the entry point file for management
    input: 'src/management/script.js',
    // the output for the management build folder
    output: {
      file: 'public/management/bundle.js',
      // Optional and for development only. This provides the ability to
      // map the built code back to the original source format when debugging.
      sourcemap: 'inline',
      // Configure Rollup to convert your module code to a scoped function
      // that "immediate invokes". See the Rollup documentation for more
      // information: https://rollupjs.org/guide/en/#outputformat
      format: 'iife',
      compact: true
    },
    // Add the plugin to map import paths to dependencies
    // installed with npm
    plugins: [nodeResolve()]
  },
  {
    // the entry point file for landing
    input: 'src/landing/script.js',
    // the output for the landing build folder
    output: {
      file: 'public/landing/bundle.js',
      // Optional and for development only. This provides the ability to
      // map the built code back to the original source format when debugging.
      sourcemap: 'inline',
      // Configure Rollup to convert your module code to a scoped function
      // that "immediate invokes". See the Rollup documentation for more
      // information: https://rollupjs.org/guide/en/#outputformat
      format: 'iife',
      compact: true
    },
    // Add the plugin to map import paths to dependencies
    // installed with npm
    plugins: [nodeResolve()]
  },
  {
    // the entry point file for auth
    input: 'src/auth/script.js',
    // the output for the auth build folder
    output: {
      file: 'public/auth/bundle.js',
      // Optional and for development only. This provides the ability to
      // map the built code back to the original source format when debugging.
      sourcemap: 'inline',
      // Configure Rollup to convert your module code to a scoped function
      // that "immediate invokes". See the Rollup documentation for more
      // information: https://rollupjs.org/guide/en/#outputformat
      format: 'iife',
      compact: true
    },
    // Add the plugin to map import paths to dependencies
    // installed with npm
    plugins: [nodeResolve()]
  }
];
