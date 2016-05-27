var path = require('path')
var webpack = require('webpack')

var ENTRY = './client.js'

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    ENTRY
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: function(path) {
        if(!/node_modules/.test(path)) return true

        return false
      }
    },
    {
      test: /\.css$/,
      loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
    }]
  }
}
