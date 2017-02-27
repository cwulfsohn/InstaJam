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
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        birthday : req.body.birthday
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
}
