const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-babel'
  ],
  devOptions: {
    port: 3000,
    open: 'default',
  },
  buildOptions: {
    out: 'build',
  },
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        const apiProxy = createProxyMiddleware({
          target: 'http://localhost:5000',
          changeOrigin: true,
        });
        apiProxy(req, res);
      }
    },
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
};
