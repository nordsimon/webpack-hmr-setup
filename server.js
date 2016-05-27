var ENV = process.env.NODE_ENV || 'development'

var http = require('http')
var fs = require('fs')
var url = require('url')
var path = require('path')

// Webpack stuff
if(ENV === 'development') {
  var webpackConfig = require('./webpack.config')
  var compiler = require('webpack')(webpackConfig)
  var webpackDevMiddleware = require('webpack-dev-middleware')

  var webpackRoute = webpackDevMiddleware(compiler,{
    noInfo: true,
    quiet: false,
    publicPath: '/dist'
  })

  var hot = require('webpack-hot-middleware')(compiler)
}
// END Webpack stuff

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true)

  // Webpack stuff
  if(ENV === 'development') {
    if(parsedUrl.pathname === '/dist/style.css') {
      return res.end()
    }

    if (req.url.indexOf(webpackConfig.output.publicPath) === 0) {
      return webpackRoute(req, res, () => {})
    }

    if(parsedUrl.pathname === '/__webpack_hmr') return hot(req, res);
  } else {
    if(parsedUrl.pathname === '/dist/bundle.js') {
      fs.createReadStream(path.join(__dirname, '/dist/bundle.js'))
      .on('error', function(err) {
        res.writeHead(404)
        res.end()
      })
      .pipe(res);
      return
    }

    if(parsedUrl.pathname === '/dist/style.css') {
      fs.createReadStream(path.join(__dirname, '/dist/style.css'))
      .on('error', function(err) {
        res.writeHead(404)
        res.end()
      })
      .pipe(res);
      return
    }
  }

  fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);

  // END Webpack stuff
})

server.listen(1234)
