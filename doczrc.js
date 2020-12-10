import { css } from 'docz-plugin-css';
import { createPlugin } from 'docz-core';

export default {
  title: 'Ekit',
  typescript: true,
  dest: 'ekit',
  menu: [],
  filterComponents: (files) => files.filter((p) => p.match(/ts[x]?$/)),
  plugins: [
    css({
      preprocessor: 'less'
    }),
    css({
      preprocessor: 'postcss'
    }),
    createPlugin({
      modifyFiles: (files) => files.filter((file) => file.indexOf('service/update.md') === -1)
    })
  ],
  modifyBundlerConfig: (config) => {
    return config;
  },
  modifyBabelRc: (babelrc, _) => {
    return {
      ...babelrc,
      plugins: [...babelrc.plugins, '@babel/plugin-proposal-optional-chaining']
    };
  }
};
