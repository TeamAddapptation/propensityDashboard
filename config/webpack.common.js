const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const paths = require("./paths");

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    main: paths.src + "/index.js",
    dataConnections: paths.src + "/pages/accountSettings/dataConnections/dataConnections.js",
    billing: paths.src + "/pages/accountSettings/billing/billing.js",
    profile: paths.src + "/pages/accountSettings/profile/profile.js",
    passwordReset: paths.src + "/pages/accountSettings/passwordReset/passwordReset.js",
    users: paths.src + "/pages/accountSettings/users/users.js",
    inviteUsers: paths.src + "/pages/accountSettings/inviteUsers/inviteUsers.js",
    installedPackages: paths.src + "/pages/accountSettings/installedPackages/installedPackages.js",
  },
  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: "[name].bundle.js",
    publicPath: "/",
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.public,
          to: "assets",
          globOptions: {
            ignore: ["*.DS_Store"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: "Propensity Dashboard",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/template.html", // template file
      filename: "index.html", // output file
    }),
    // Account Settings
    new HtmlWebpackPlugin({
      title: "Profile",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/profile/profile.html", // template file
      filename: "profile.html", // output file
      chunks: ["main", "profile"],
    }),
    new HtmlWebpackPlugin({
      title: "Password Reset",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/passwordReset/passwordReset.html", // template file
      filename: "passwordReset.html", // output file
      chunks: ["main", "passwordReset"],
    }),
    new HtmlWebpackPlugin({
      title: "Billing History",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/billing/billing.html", // template file
      filename: "billing.html", // output file
      chunks: ["main", "billing"],
    }),
    new HtmlWebpackPlugin({
      title: "Data Connections",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/dataConnections/dataConnections.html", // template file
      filename: "dataConnections.html", // output file
      chunks: ["main", "dataConnections"],
    }),
    new HtmlWebpackPlugin({
      title: "Users",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/users/users.html", // template file
      filename: "users.html", // output file
      chunks: ["main", "users"],
    }),
    new HtmlWebpackPlugin({
      title: "inviteUsers",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/inviteUsers/inviteUsers.html", // template file
      filename: "inviteUsers.html", // output file
      chunks: ["main", "inviteUsers"],
    }),
    new HtmlWebpackPlugin({
      title: "Installed Packages",
      favicon: paths.src + "/images/favicon.png",
      template: paths.src + "/pages/accountSettings/installedPackages/installedPackages.html", // template file
      filename: "installedPackages.html", // output file
      chunks: ["main", "installedPackages"],
    }),
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ["babel-loader"] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: "asset/resource" },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: "asset/inline" },
    ],
  },

  resolve: {
    modules: [paths.src, "node_modules"],
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": paths.src,
      assets: paths.public,
    },
  },
};
