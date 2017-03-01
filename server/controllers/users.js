var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require("bcryptjs");

module.exports = {
  create: function(req, res){
    if (req.body.password != req.body.confirmPassword){
      res.json({badPass:"Passwords don't match"})
    }
    else{
      var user = new User({
        username: req.body.username,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        age : req.body.age
      });
      user.save(function(err, user){
        if(err){
          res.json({err:err})
        }
        else {
          res.json({user:user})
        }
      })
    }
  },
  login: function(req, res){
    User.find({email: req.body.email}, function(err, user){
      if(user.length < 1){
        res.json({err:"Unregistered email"})
      }
      else {
        if (bcrypt.compareSync(req.body.password, user[0].password)) {
          res.json({user:user})
        }
        else {
          res.json({err:"passwords didn't match"})
        }
      }
    })
  },
  showUser: function(req, res){
    User.findOne({_id: req.params.id}).populate("uploaded_songs").populate("playlists").populate({path: "playlists", populate: {path:"_user"}}).populate({path: "playlists", populate: {path:"songs"}}).populate("reposts").exec(function(err, user){
      if(err){
        res.json({err:err})
      }
      else{
        res.json({user: user})
      }
    })
  },
  showOneUser: function(req, res){
    User.findOne({_id: req.params.id}).populate("uploaded_songs").populate("playlists").populate("reposts").populate("followers").populate("following").exec(function(err, user){
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
  }
}
