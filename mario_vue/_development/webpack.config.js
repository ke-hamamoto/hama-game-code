const { VueLoaderPlugin } = require('vue-loader');

module.exports = (mode = "development") => {

  return {
    mode: mode,
    entry: {
      "js/app": "./ES6/app.js"
    },
    output: {
      filename: "[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ]
        },
        {
          // 対象となるファイルの拡張子
          test: /\.(gif|png|jpe?g|svg|eot|wof|woff|ttf)$/i,
          use: [
            {
              //画像を出力フォルダーにコピーするローダー
              loader: 'file-loader',
              options: {
                name: './images/[name].[ext]',
                esModule: false//[object module]の回避
              }
            }
          ],
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          include: [
            /es6/,
            /\/Applications\/MAMP\/htdocs\/webstaff/
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.html'],
      modules: [
        'node_modules'
      ],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'jquery$': 'jquery/dist/jquery.min.js',
        'd3$': 'd3/dist/d3.min.js'
      }
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    devtool: (mode === "development") ? "inline-source-map" : false
  }
}