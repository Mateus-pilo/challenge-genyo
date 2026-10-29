const target = process.env.API_PROXY_TARGET || 'http://localhost:3000';

module.exports = {
  '/employees': {
    target,
    changeOrigin: true,
  },
  '/health': {
    target,
    changeOrigin: true,
  },
};
