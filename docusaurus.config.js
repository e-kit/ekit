/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { linkDocblocks, transpileCodeblocks } = require('remark-typescript-tools');

module.exports = {
  baseUrl: '/ekit/',
  favicon: 'https://static.yximgs.com/udata/pkg/fe/favicon.70ff1fcc.ico',
  tagline: 'ekit makes life effective and easy',
  title: 'ekit',
  url: 'https://uniforms.tools/',
  plugins: [
    [
      'docusaurus-plugin-typedoc',

      // plugin options
      {
        // list of input files relative to project (required).
        inputFiles: ['packages/model-factory/src'],

        // docs directory relative to the site directory (defaults to docs).
        docsRoot: 'docs',

        // output directory relative to docs directory - use '' for docs root (defaults to 'api').
        out: 'api',

        // Skip updating of sidebars.json (defaults to false).
        skipSidebar: false,

        // Pass in any additional Typescript/TypeDoc options (see typedoc --help).
        mode: 'file',
        target: 'ES5'
        //...etc
      }
    ]
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: './packages',
          include: ['*/*.md', '*/*.mdx'],
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [
            [
              linkDocblocks,
              {
                extractorSettings: {
                  tsconfig: path.join(__dirname, 'packages/ajax/tsconfig.json'),
                  basedir: path.join(__dirname, 'packages/ajax/src'),
                  rootFiles: ['index.ts']
                }
              }
            ]
          ]
        }
      }
    ]
  ]
};
