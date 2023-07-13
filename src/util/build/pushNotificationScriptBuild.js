const webpack = require('webpack');
const webpackConfig = require('../../../webpack.config');

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    process.exit(1);
  }
  console.log('Webpack build successful');
});
