var mongoose = require('mongoose')
require('./user')
require('./comment')
require('./playlist')

var songSchema = mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  song_file: {
    type: String, required: [true, "File upload is required"]
  },
  album_cover: {
    type: String
  },
  artist_name: {
    type: String, required: [true, "Artist name is required"]
  },
  tags: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Comment"
  }],
  in_playlists: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Playlist"
  }],
  reposted_by: [{
    type: mongoose.Schema.Types.ObjectId, ref: "User"
  }],
  description: {
    type: String
  }
}, {timestamps: true})

mongoose.model("Song", songSchema)
