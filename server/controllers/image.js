var mongoose = require('mongoose');
var fs = require('fs');
var path = require("path");
var User = mongoose.model('User');
var static_path = "../static/images/"
module.exports = {
  uploadFile: function(req, res){
    console.log(req.body.type)
    var file = req.files.file;
    fs.readFile(file.path, function(err, data){
      if (err){
        console.log(err);
      }
      else {
        fs.writeFile(path.join(__dirname, static_path, file.name), data, "base64", function(err){
          if(err){
            res.json({err: err})
          }
          else{
            if(req.body.type == 'profile'){
            User.findOneAndUpdate({_id: req.params.id},{profile_image: String(file.name)}, function(err, user){
              if(err){
                res.json({err:err})
              }
              else{
                res.json({user:user})
              }
            })
          }
          else{
            User.findOneAndUpdate({_id: req.params.id},{cover_image: String(file.name)}, function(err, user){
              if(err){
                res.json({err:err})
              }
              else{
                res.json({user:user})
              }
          })
        }
          }
        })
      }
    })
    console.log(file.type);
  }
}
