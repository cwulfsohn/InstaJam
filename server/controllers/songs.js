var mongoose = require('mongoose');
var fs = require('fs');
var path = require("path");
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var Playlist = mongoose.model('Playlist');
var static_folder = "../static/audio";
var static_images = "../static/images"
module.exports = {
  uploadFile: function(req, res){
    var file = req.files.file;
    var req_song = req.body.song;
    var filepath = req_song.uploader + file.name;
    if (file.type != "audio/mp3"){
      res.json({err:{errors:{type:{message:"MP3 Only"}}}})
    }
    else {
      User.findOne({_id: req_song.uploader}, function(err, user){
        if (err){
          res.json({err:err});
        }
        else {
          var song = new Song({
            song_title: req_song.title,
            artist_name: req_song.artist,
            song_file: filepath,
            _user: user._id
          })
          if (req_song.tags){
            var tags = req_song.tags.split(",");
            song.tags = tags;
          }
          if (req_song.description){
            song.description = req_song.description;
          }
          song.save(function(err, song){
            if (err){
              res.json({err:err})
            }
            else {
              user.uploaded_songs.push(song);
              user.save(function(err, user){
                if (err){
                  res.json({err:err})
                }
                else {
                  fs.readFile(file.path, function(err, data){
                    if (err){
                      res.json({err:err})
                    }
                    else {
                      fs.writeFile(path.join(__dirname, static_folder, filepath), data, "base64", function(err){
                        if(err){
                          res.json({err:err})
                        }
                        else {
                          res.json({song:song})
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  uploadArt: function(req, res){
    var file = req.files.file;
    var filepath = req.body.song + file.name;
    Song.findOne({_id:req.body.song}, function(err, song){
      if(err){
        res.json({err:err})
      }
      else {
        fs.readFile(file.path, function(err, data){
          if (err){
            res.json({err:err})
          }
          else {
            fs.writeFile(path.join(__dirname, static_images, filepath), data, "base64", function(err){
              if(err){
                res.json({err:err})
              }
              else {
                song.album_cover = filepath;
                song.save(function(err, song){
                  if (err){
                    res.json({err:err})
                  }
                  else {
                    res.json({song:song})
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  show: function(req, res){
    Song.findOne({_id:req.params.id}).populate("_user").exec( function(err, song){
      if (err){
        res.json({err:err});
      }
      else {
        res.json({song:song})
      }
    })
  },
  addLike: function(req, res){
    console.log(req.body)
    Song.findOne({_id: req.body.s_id}, function(err, song){
      if(err){
        res.json({err: err})
      }
      else{
        User.findOne({_id: req.body.u_id}, function(err, user){
          if(err){
            res.json({err: err})
          }
          else{
            song.likes.push(user._id)
            song.save(function(err){
              if(err){
                res.json({err: err})
              }
              else{
                user.like_songs.push(song._id)
                user.save(function(err){
                  if(err){
                    res.json({err: err})
                  }
                  else{
                    res.json({ok: 'works'})
                  }
                })
              }
            })

          }
        })
      }
    })
  },
  disLike: function(req, res){
    Song.update({_id: req.body.s_id}, {$pull: {likes: req.body.u_id}}, {safe: true}, function(err, song){
      if(err){
        res.json({err:err})
      }
      else{
        User.update({_id: req.body.u_id}, {$pull: {like_songs: req.body.s_id}}, {safe: true}, function(err, user){
          if(err){
            res.json({err:err})
          }
        else{
          res.json({user:user})
        }})
      }
    })
  },
  repost: function(req, res){
    console.log(req.body)
    Song.findOne({_id: req.body.s_id}, function(err, song){
      if(err){
        res.json({err: err})
      }
      else{
        User.findOne({_id: req.body.u_id}, function(err, user){
          if(err){
            res.json({err: err})
          }
          else{
            song.reposted_by.push(user._id)
            song.save(function(err){
              if(err){
                res.json({err: err})
              }
              else{
                user.reposts.push(song._id)
                user.save(function(err){
                  if(err){
                    res.json({err: err})
                  }
                  else{
                    res.json({ok: 'works'})
                  }
                })
              }
            })

          }
        })
      }
    })
  },
  removeRepost: function(req, res){
    Song.update({_id: req.body.s_id}, {$pull: {reposted_by: req.body.u_id}}, {safe: true}, function(err, song){
      if(err){
        res.json({err:err})
      }
      else{
        User.update({_id: req.body.u_id}, {$pull: {reposts: req.body.s_id}}, {safe: true}, function(err, user){
          if(err){
            res.json({err:err})
          }
        else{
          res.json({user:user})
        }})
      }
    })
  },
  showPlaylist: function(req, res){
    User.find({_id: req.params.u_id}).populate('playlists').exec(function(err, user){
      if(err){
        res.json({err:err})
      }
      else{
        Song.findOne({_id: req.params.s_id}, function(err, song){
          if(err){
            res.json({err: err})
          }
          else if(!user.playlists){
            res.json({playlists: "No Current Playlists", song: song})
          }
          else{
            res.json({playlists: user, song: song})
          }
        })
      }
    })

  }
}
