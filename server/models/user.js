var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
},{timestamps: true})

mongoose.model('User', userSchema);
