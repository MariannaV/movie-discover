const webpack = require("webpack"),
  path = require("path");

const mode = process.env.NODE_ENV,
  isDev = mode === "development",
  isProd = mode === "production";
console.log(`mode: ${mode}`);

const root = path.resolve(__dirname, "../../"),
  distPath = `${root}/dist`,
  initialPath = "/",
  assetsPath = "assets";

module.exports = (env, argv) => ({
  mode,
  target: "web",
  entry: `${root}/src/index.tsx`,

  output: {
    filename: `${assetsPath}/js/[name]${isProd ? ".[chunkhash]" : ""}.js`,
    chunkFilename: `${assetsPath}/js/[name]${isProd ? ".[chunkhash]" : ""}.js`,
    path: distPath,
    publicPath: initialPath,
  },

  devServer: {
    contentBase: [`${root}/server/dist`],
    host: "0.0.0.0",
    port: "3000",
    clientLogLevel: "info",
    hot: true,
    historyApiFallback: true,
    overlay: true,
    http2: true,
    transportMode: "ws", // !!! experimental
    headers: {
      "X-Custom-Foo": "bar",
    },
  },
  devtool: isDev ? "inline-source-map" : "none",

  resolve: {
    alias: {
      "@types": `${root}/src/@types`,
      assets: `${root}/src/assets`,
      components: `${root}/src/components`,
      consts: `${root}/src/consts`,
      helpers: `${root}/src/helpers`,
      modules: `${root}/src/modules`,
      pages: `${root}/src/pages`,
      "core-js": path.dirname(require.resolve(`core-js/package.json`)),
    },
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  },

  plugins: [
    new (require("clean-webpack-plugin").CleanWebpackPlugin)(),
    /*new (require("fork-ts-checker-webpack-plugin"))({
      typescript: {
        context: root,
        configFile: `${root}/tsconfig.json`,
        mode: "write-references",
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
      eslint: {
        files: `${root}/src/!**!/!*.{ts,tsx,js,jsx}`,
      },
      async: isDev,
    }),*/

    new (require("html-webpack-plugin"))({
      template: `${root}/src/index.html`,
      scriptLoading: "defer",
      hash: isProd,
    }),
    new (require("mini-css-extract-plugin"))(),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),

    isDev && new (require("@pmmmwh/react-refresh-webpack-plugin"))(),
    isProd &&
      new (require("workbox-webpack-plugin").GenerateSW)({
        clientsClaim: true,
        skipWaiting: true,
      }),
    // isProd && new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)(),
  ].filter(Boolean),

  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        include: `${root}/src`,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          ...require(`${root}/configs/babelrc.js`),
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: require("mini-css-extract-plugin").loader,
            options: {
              hmr: isDev,
            },
          },
          "@teamsupercell/typings-for-css-modules-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                compileType: "module",
                localIdentName: "[local]-[hash:base64:4]",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              config: { path: `${root}/configs/stylization/postcss.config.js` },
              sourceMap: isDev && "inline",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require("mini-css-extract-plugin").loader,
            options: {
              hmr: isDev,
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(woff2|woff)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },

      {
        test: /\.(png|jpg)$/,
        include: `${root}/src/assets`,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        include: `${root}/src/assets`,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(mp3)$/,
        include: `${root}/src/assets`,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },

  optimization: {
    runtimeChunk: "single",
    moduleIds: "hashed",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    minimizer: [
      new (require("terser-webpack-plugin"))({
        cache: true,
        parallel: true,
        terserOptions: { mangle: true },
      }),
      new (require("optimize-css-assets-webpack-plugin"))({
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          zindex: {},
        },
      }),
    ],
  },
});
