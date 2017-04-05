var mongoose = require("mongoose");
var textSearch = require("mongoose-text-search");
var fs = require("fs");
var path = require("path");
mongoose.connect("mongodb://localhost/instajam");
var models_path = path.join(__dirname, "./../models");
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf(".js") >= 0) {
    require(models_path + "/" + file);
  }
});
