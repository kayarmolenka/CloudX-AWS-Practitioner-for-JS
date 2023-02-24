const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  context: __dirname,
  entry: slsw.lib.entries,
  target: "node",
  devtool: slsw.lib.webpack.isLocal
    ? "eval-cheap-module-source-map"
    : "source-map",
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: __dirname,
        exclude: /node_modules/,
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: "10",
                },
              },
            ],
          ],
        },
      },
    ],
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
};
