// TO USE:
// 1. duplicate file
// 2. rename to "vite.config.local.js"
// 3. update settings as required
// Note: Configs are shallow merged, be
// careful not to override project settings
module.exports = {
  // local https server (requires cert and key)
  server: {
    port: '10443',
    https: {
      cert: '/home/XXX/.ssh/localhost.pem',
      key: '/home/XXX/.ssh/localhost-key.pem',
    },
  },
};