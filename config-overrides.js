const { override, addWebpackDevServerConfig } = require('customize-cra');

const devServerConfig = () => (config) => {
  config.allowedHosts = 'all'; 
  return config;
};

module.exports = {
  webpack: override(),
  devServer: override(devServerConfig())
};
