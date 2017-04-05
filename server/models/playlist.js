var mongoose = require('mongoose')
require('./user')
require('./song')

var playlistSchema = mongoose.Schema({
  songs: [{
    type: mongoose.Schema.Types.ObjectId, ref:'Song'
  }],
  title: {
    type: String
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  first_song_art: {
    type: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  }],
  reposts: [{
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  }],
  description: {
    type: String
  }
}, {timestamps: true})

mongoose.model('Playlist', playlistSchema)
