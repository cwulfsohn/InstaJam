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
  app.get('/showoneuser/:id', user.showOneUser)
  app.post('/songs/new', multipartyMiddleware, song.uploadFile),
  app.post('/songs/new/art', multipartyMiddleware, song.uploadArt),
  app.get('/song/:id', song.show),
  app.post('/like', song.addLike),
  app.post('/disLike', song.disLike),
  app.post('/repost', song.repost),
  app.post('/removeRepost', song.removeRepost),
  app.post('/playlist/like', song.playlistAddLike),
  app.post('/playlist/disLike', song.playlistDisLike),
  app.post('/playlist/repost', song.playlistRepost),
  app.post('/playlist/removeRepost', song.playlistRemoveRepost),
  app.get('/playlist/:s_id/:u_id', song.showPlaylist),
  app.get('/playlists/show/:id', song.showPlaylistPage),
  app.post('/createPlaylist', song.createPlaylist),
  app.post('/comment', song.createComment)
  app.post('/addToPlaylist', song.addToPlaylist),
  app.post('/follow', user.addFollow),
  app.post('/unfollow', user.unFollow),
  app.get('/search/:search_term', song.search),
  app.post('/editUser', user.editUser),
  app.get('/home/:id', user.getHomeSongs),
  app.post('/editSong', song.editSong)
  app.delete('/playlist/:Pid/:index/:Sid', song.deleteSongPlaylist)
}
