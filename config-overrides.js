const path = require('path');

module.exports = function override(config, env) {
  config.devServer = {
    ...config.devServer,
    allowedHosts: ['localhost', '127.0.0.1'],
  };
  return config;
};
