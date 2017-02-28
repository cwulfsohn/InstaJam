var mongoose = require('mongoose');
var fs = require('fs');
var path = require("path");
var User = mongoose.model('User');
module.exports = {
  uploadFile: function(req, res){
    var file = req.files.file;
    fs.readFile(file.path, function(err, data){
      if (err){
        console.log(err);
      }
      else {
        fs.writeFile(path.join(__dirname, file.name), data, "base64", function(err){
          if(err){
            console.log(err);
          }
        })
      }
    })
    console.log(file.type);
  }
}
