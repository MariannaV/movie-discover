const path = require("path"),
  root = path.resolve(__dirname, "../../");

module.exports = {
  syntax: "postcss-scss",
  plugins: [
    require("postcss-advanced-variables")(),
    require("postcss-preset-env")({
      stage: 1,
      preserve: true,
      autoprefixer: {
        grid: "autoplace",
      },
    }),
    require("postcss-property-lookup")(),
    require("postcss-nested")({ preserveEmpty: true }),
    require("postcss-color-function")(),
    require("postcss-selector-not")(),
    require("postcss-selector-matches")(),
    require("postcss-svg")({ dirs: [`${root}/src/img`], svgo: {} }),
    require("postcss-line-height-px-to-unitless")(),
    require("postcss-pxtorem")({
      // propList: ["font", "font-size", "line-height", "letter-spacing"]
      rootValue: 16,
      replace: true,
      mediaQuery: false,
    }),
    require("postcss-scale")(),
    require("postcss-assets")({ loadPaths: ["img/"] }),
    require("css-mqpacker")({ sort: true }),
  ],
};
