var mongoose = require('mongoose');
var fs = require('fs');
var path = require("path");
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var TimedComment = mongoose.model('TimedComment');
var Comment = mongoose.model('Comment');
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
    Song.findOne({_id:req.params.id}).populate("_user").populate('comments')
    .populate({path: "comments", populate:{path: "_user"}}).exec( function(err, song){
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
  playlistAddLike: function(req, res){
    console.log(req.body)
    Playlist.findOne({_id: req.body.p_id}, function(err, playlist){
      if(err){
        res.json({err: err})
      }
      else{
        User.findOne({_id: req.body.u_id}, function(err, user){
          if(err){
            res.json({err: err})
          }
          else{
            playlist.likes.push(user._id)
            playlist.save(function(err){
              if(err){
                res.json({err: err})
              }
              else{
                user.like_playlists.push(playlist._id)
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
  playlistDisLike: function(req, res){
    Playlist.update({_id: req.body.p_id}, {$pull: {likes: req.body.u_id}}, {safe: true}, function(err, playlist){
      if(err){
        res.json({err:err})
      }
      else{
        User.update({_id: req.body.u_id}, {$pull: {like_playlists: req.body.p_id}}, {safe: true}, function(err, user){
          if(err){
            res.json({err:err})
          }
        else{
          res.json({user:user})
        }})
      }
    })
  },
  playlistRepost: function(req, res){
    Playlist.findOne({_id: req.body.p_id}, function(err, playlist){
      if(err){
        res.json({err: err})
      }
      else{
        User.findOne({_id: req.body.u_id}, function(err, user){
          if(err){
            res.json({err: err})
          }
          else{
            playlist.reposts.push(user._id)
            playlist.save(function(err){
              if(err){
                res.json({err: err})
              }
              else{
                user.playlist_reposts.push(playlist._id)
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
  playlistRemoveRepost: function(req, res){
    Playlist.update({_id: req.body.p_id}, {$pull: {reposts: req.body.u_id}}, {safe: true}, function(err, playlist){
      if(err){
        res.json({err:err})
      }
      else{
        User.update({_id: req.body.u_id}, {$pull: {playlist_reposts: req.body.p_id}}, {safe: true}, function(err, user){
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
    User.findOne({_id: req.params.u_id}).populate('playlists').populate({path:"playlists", populate:{path: "song"}}).exec(function(err, user){
      if(err){
        res.json({err:err})
      }
      else{
        Song.findOne({_id: req.params.s_id}, function(err, song){
          if(err){
            res.json({err: err})
          }
          else{
            res.json({playlists: user, song: song})
          }
        })
      }
    })

  },
  createComment: function(req, res){
    Song.findOne({_id: req.body.song}, function(err, song){
      if (err){
        res.json({err:err})
      }
      else {
        User.findOne({_id:req.body.user}, function(err, user){
          if(err){
            res.json({err:err})
          }
          else {
            var time_marker = Math.floor(req.body.time_marker)
            for (var i = 0; i < song.timedComments.length; i++){
              if (song.timedComments[i].time === time_marker){
                res.json({err:{errors:{time:{message: "Already a comment at that time"}}}});
                return;
              }
            }
            var comment = new Comment({
              content: req.body.content,
              time_marker: time_marker,
              _user: user._id,
              _song: song._id
            });
            comment.save(function(err, comment){
              if (err){
                res.json({err:err})
              }
              else {
                song.comments.push(comment);
                var timedComment = new TimedComment({
                  time: time_marker,
                  comment: comment.content,
                  user: user.username
                })
                song.timedComments.push(timedComment)
                song.save(function(err, song){
                  if (err){
                    res.json({err:err})
                  }
                  else {
                    res.json({comment:comment, song:song})
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  createPlaylist: function(req, res){
    User.findOne({_id: req.body.user_id}, function(err, user){
      if(err){
        res.json({err: err})
      }
      else{
        Song.findOne({_id: req.body.song_id}, function(err, song){
          if(err){
            res.json({err: err})
          }
          else{
            var playlist = new Playlist({title: req.body.title, description: req.body.description, first_song_art: song.album_cover, _user: user._id, songs: song._id})
            playlist.save(function(err, playlist){
              if(err){
                res.json({err: err})
              }
              else{
                user.playlists.push(playlist)
                user.save(function(err, user){
                  if(err){
                    res.json({err: err})
                  }
                  else{
                    res.json({playlist: playlist})
                  }
                })
              }
            })
          }
        })
    }})
  },
  addToPlaylist: function(req, res){
    Song.findOne({_id: req.body.s_id}, function(err, song){
      if(err){
        res.json({err: err})
      }
      else{
        Playlist.findOne({_id: req.body.p_id}, function(err, playlist){
          if(err){
            res.json({err: err})
          }
          else{
            song.in_playlists.push(playlist)
            song.save(function(err, song){
              if(err){
                res.json({err: err})
              }
              else{
                playlist.songs.push(song)
                playlist.save(function(err, playlist){
                  if(err){
                    res.json({err: err})
                  }
                  else{
                    res.json({success: 'Success'})
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  search: function (req, res) {
    var results = {}
      Song.find({"song_title": {"$regex": req.params.search_term, "$options": "i" } }).populate("_user").exec( function (err, songs) {
        if (err) {
          console.log(err);
        } else {
          results.songs = songs;
        }
        Song.find({"artist_name": {"$regex": req.params.search_term, "$options": "i" } }).populate("_user").exec( function (err, songs_by_artist) {
          if (err) {
            console.log(err);
          } else {
            results.songs_by_artist = songs_by_artist;
          }
        Song.find({"tags": {"$regex": req.params.search_term, "$options": "i" } }).populate("_user").exec( function (err, tags) {
          if (err) {
            console.log(err);
          } else {
            results.tags = tags;
          }
          User.find({"username": {"$regex": req.params.search_term, "$options": "i"} }, function (err, users) {
            if (err) {
              console.log(err);
            } else {
              results.users = users;
            }
            Playlist.find({"title": {"$regex": req.params.search_term, "$options": "i"} })
            .populate("songs").populate("_user").exec(function (err, playlists) {
              if (err) {
                console.log(err);
              } else {
                results.playlists = playlists;
              }
              res.json(results);
            });
          });
        });
      });
    });
  }
}
