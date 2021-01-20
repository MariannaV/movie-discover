const path = require("path"),
  root = path.resolve(__dirname, "../");

const mode = process.env.NODE_ENV,
  isDev = mode === "development",
  isProd = mode === "production";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: require(`${root}/package.json`).browserslist,
        },
        modules: false,
        loose: true,
        spec: true,
        forceAllTransforms: true,
        useBuiltIns: "usage",
        corejs: 3,
        debug: false,
      },
    ],
    [
      "@babel/preset-typescript",
      {
        isTSX: true,
        allExtensions: true,
        allowNamespaces: true,
        onlyRemoveTypeImports: true,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    isDev && require.resolve("react-refresh/babel"),
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    [
      "react-css-modules",
      {
        webpackHotModuleReloading: isDev,
        handleMissingStyleName: "warn",
        generateScopedName: "[local]-[hash:base64:4]",
        filetypes: {
          ".scss": {
            syntax: require(`${root}/configs/stylization/postcss.config.js`)
              .syntax,
          },
        },
        exclude: "node_modules",
      },
    ],
  ].filter(Boolean),
};
