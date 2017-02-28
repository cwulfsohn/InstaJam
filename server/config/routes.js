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
  app.post('/songs/new', multipartyMiddleware, song.uploadFile),
  app.post('/songs/new/art', multipartyMiddleware, song.uploadArt),
  app.get('/song/:id', song.show),
  app.post('/like', song.addLike),
  app.post('/disLike', song.disLike),
  app.post('/repost', song.repost),
  app.post('/removeRepost', song.removeRepost)
}
