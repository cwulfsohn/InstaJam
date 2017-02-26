var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var root = __dirname;

app.use(express.static(path.join(root, "client")));
app.use(express.static(path.join(root, "bower_components")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);
app.listen(2401, function(){console.log("listening on port 2401");
})