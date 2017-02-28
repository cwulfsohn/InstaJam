multiparty = require('connect-multiparty')
multipartyMiddleware = multiparty()
var user = require("../controllers/users.js")
var song = require('../controllers/songs.js')
var image = require('../controllers/image.js')
module.exports = function(app){
  app.post('/users/new', user.create),
  app.post('/users', user.login),
  app.post('/image/new/:id', multipartyMiddleware, image.uploadFile),
  app.get('/showuser/:id', user.showUser)
}
