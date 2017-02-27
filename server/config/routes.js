multiparty = require('connect-multiparty')
multipartyMiddleware = multiparty()
var user = require("../controllers/users.js")
var song = require('../controllers/songs.js')
module.exports = function(app){
  app.post('/users/new', user.create),
  app.post('/users', user.login),
  app.post('/songs/new', multipartyMiddleware, song.uploadFile)
}
