const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src/"),
        "@": path.resolve(__dirname, "src/"),
      },
    },
  },
  // chainWebpack: (config) => {
  //   config.resolve.alias.set("@", path.join(__dirname, "src/"));
  // },
};
