/** @type {import('@volar-plugins/prettier')} */
const { volarPrettierPlugin } = require("@volar-plugins/prettier");
const prettyhtml = require("@volar-plugins/prettyhtml");
const sassFormatter = require("@volar-plugins/sass-formatter");

module.exports = {
  plugins: [
    sassFormatter({}),
    prettyhtml({ printWidth: 100 }),
    volarPrettierPlugin({
      languages: ["html", "css", "scss", "typescript", "javascript"],
      html: {
        breakContentsFromTags: true,
      },
    }),
  ],
};
