var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  firstName: {
  type: String,
  required: [true, "First name required"],
  minlength: 2,
  trim: true
},
lastName: {
  type: String,
  required: [true, "Last name required"],
  trim: true
},
email: {
  type: String,
  required: [true, "email required"],
  trim: true,
  unique: true,
  minlength: 2,
  validate: [{
    validator: function( number ) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( number );
    },
    message: "Not a valid email address"
    }]
  },
  password: {
    type: String,
    required: [true, "password required"],
    trim: true,
    minlength: 8
  },
  birthday: {
    type: Date,
    required: [true, "birthday required"]
  }
},{timestamps: true});

UserSchema.pre('save', function(done){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  done();

})

mongoose.model('User', UserSchema);
