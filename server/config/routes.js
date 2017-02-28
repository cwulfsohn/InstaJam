multiparty = require('connect-multiparty')
multipartyMiddleware = multiparty()
var user = require("../controllers/users.js")
var song = require('../controllers/songs.js')
var image = require('../controllers/image.js')
module.exports = function(app){
  app.post('/users/new', user.create),
  app.post('/users', user.login),
<<<<<<< HEAD
  app.post('/image/new/:id', multipartyMiddleware, image.uploadFile),
  app.get('/showuser/:id', user.showUser)
=======
  app.post('/songs/new', multipartyMiddleware, song.uploadFile),
  app.post('/songs/new/art', multipartyMiddleware, song.uploadArt),
  app.get('/song/:id', song.show)
>>>>>>> 05f0de8f27a8fc1d8072dfd188540c9ab583fef7
}
