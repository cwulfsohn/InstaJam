var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var bcrypt = require("bcryptjs");

module.exports = {
  create: function(req, res){
    if (req.body.password != req.body.confirmPassword){
      res.json({badPass:"Passwords don't match"})
    }
    else{
      User.find({}, function(err, checkuser){
        if(err){
          res.json({err: err})
        }
        else{
          for(var i = 0; i < checkuser.length; i++){
            if(req.body.username == checkuser[i].username){
              res.json({err:"Username has been taken"})
              return
            }
            else if(req.body.email == checkuser[i].email){
              res.json({err:"Email has been taken"})
              return
            }
          }
            var user = new User({
              username: req.body.username,
              firstName : req.body.firstName,
              lastName : req.body.lastName,
              email : req.body.email,
              password : req.body.password,
              age : req.body.age,
              location: req.body.location
            });
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
            user.save(function(err, user){
              if(err){
                res.json({err:err})
              }
              else {
                res.json({user:user})
              }
          })
        }
      })
    }},
  login: function(req, res){
    if(!req.body.password){
      console.log('hello')
      res.json({err: "password is not found"})
    }
    else if(!req.body.email){
      res.json({err: "email is not found"})
    }
    else{
    User.findOne({email: req.body.email}, function(err, user){
      if(err){
        res.json({err:"Unregistered email"})
      }
      else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.json({user:user})
        }
        else {
          res.json({err:"passwords didn't match"})
        }
      }
    })
  }
  },
  showUser: function(req, res){
    User.findOne({_id: req.params.id}).populate("uploaded_songs").populate("playlists").populate({path: "playlists", populate: {path:"_user"}}).populate({path: "playlists", populate: {path:"songs"}})
    .populate({path: "playlist_reposts", populate: {path:"_user"}}).populate({path: "playlist_reposts", populate: {path:"songs"}}).populate("reposts").exec(function(err, user){
      if(err){
        res.json({err:err})
      }
      else{
        res.json({user: user})
      }
    })
  },
  showOneUser: function(req, res){
    User.findOne({_id: req.params.id}).populate("uploaded_songs").populate("playlists").populate("reposts").populate("followers").populate("following")
    .populate("like_songs").populate({path: "like_songs", populate: {path:"_user"}}).populate("like_playlists").populate({path: "like_playlists", populate: {path:"_user"}}).populate({path: "like_playlists", populate: {path:"songs"}}).exec(function(err, user){
      if(err){
        res.json({err:err})
      }
      else{
        res.json({user: user})
      }
    })
  },
  addFollow: function(req, res){
    User.findOne({_id: req.body.follow}, function(err, follow){
      if(err){
        res.json({err:err})
      }
      else{
        User.findOne({_id: req.body.follower}, function(err, follower){
          if(err){
            res.json({err: err})
          }
          else{
            follow.followers.push(follower)
            follow.save(function(err, follow_user){
              if(err){
                res.json({err: err})
              }
              else{
                follower.following.push(follow)
                follower.save(function(err, follower_user){
                  if(err){
                    res.json({err: err})
                  }
                  else{
                    console.log('works')
                    res.json({works: "works"})
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  getHomeSongs: function(req, res){
      Song.find({}).sort({'createdAt': -1}).limit(6).exec(function(err, discover){
        if (err){
          res.json({err:err})
        }
        else {
          User.find({}).sort({"number_followers": -1}).limit(6).exec(function(err, top_users){
            if (err){
              res.json({err:err})
            }
            else {
              Song.find({}).sort({"number_likes": -1}).limit(6).exec(function(err, top_songs){
                if (err){
                  res.json({err:err})
                }
                else {
                  if (req.params.id != 0){
                    User.findOne({_id:req.params.id}).populate("following").populate({path: "following", populate: {path: "uploaded_songs"}})
                    .populate({path: "following", populate: {path: "reposts"}}).exec( function(err, user){
                      if (err){
                        res.json({err:err})
                      }
                      else {
                        var stream = [];
                        var flag = false;
                        while (stream < 6 && flag===false) {
                          for (var i = 0; i < user.following.length; i++) {
                            if (user.following[i].uploaded_songs[user.following[i].uploaded_songs.length - 1] != undefined){
                              stream.push(user.following[i].uploaded_songs[user.following[i].uploaded_songs.length - 1]);
                            }
                          }
                          flag = true;
                        }
                      }
                    res.json({stream:stream, discover:discover, top_songs:top_songs, top_users: top_users})
                  })
                  }
                  else {
                    res.json({discover:discover, top_songs:top_songs, top_users: top_users})
                  }
              }
            })
          }
        })
      }

    })
  },
  unFollow: function(req, res){
    User.update({_id: req.body.follow}, {$pull: {followers: req.body.follower}}, {safe: true}, function(err, follow){
      if(err){
        res.json({err: err})
      }
      else{
        User.update({_id: req.body.follower}, {$pull: {following: req.body.follow}}, {safe: true}, function(err, follower){
          if(err){
            res.json({err: err})
          }
          else{
            res.json({work: "Works"})
          }
        })
      }
    })
  },
  editUser: function(req, res){
    User.find({}, function(err, checkuser){
      if(err){
        res.json({err: err})
      }
      else{
        for(var i = 0; i < checkuser.length; i++){
          console.log(req.body._id)
          console.log(checkuser[i]._id)
          if(req.body._id != checkuser[i]._id){
            if(req.body.username == checkuser[i].username){
              res.json({err: "Username is taken"})
              return
            }
          }
        }
        User.findOne({_id: req.body._id}, function(err, user){
          if(err){
            res.json({err: err})
          }
          else{
            user.username = req.body.username
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.description = req.body.description
            user.location = req.body.location
            user.save(function(err, user){
              if(err){
                res.json({err: err})
              }
              else{
              console.log(user)
              res.json({user: user})
            }
            })
          }
        })
      }
    })
  }
}
