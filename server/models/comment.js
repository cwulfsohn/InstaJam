var mongoose = require('mongoose')
require('./user')
require('./song')

var commentSchema = mongoose.Schema({
  content: {
    type: String, required: [true, "Comment is needed"]
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId, ref:'User'
  },
  _song: {
    type: mongoose.Schema.Types.ObjectId, ref:'Song'
  },
  _replies: [{
    type: mongoose.Schema.Types.ObjectId, ref:'Reply'
  }],
  time_marker: Number,
}, {timestamps: true})

var replySchema = mongoose.Schema({
  content: {
    type: String, required: [true, "Comment is needed"]
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId, ref:"User"
}}, {timestamps: true})

mongoose.model('Reply', replySchema)
mongoose.model('Comment', commentSchema)
