const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8802',
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/api2',
  //   createProxyMiddleware({
  //     target: 'http://localhost:3070',
  //     changeOrigin: true,
  //   })
  // );
};
