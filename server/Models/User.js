var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    index:true // Index ensures property is unique in db.
  },
  firstName: {
    type: String
  },
  lastName: {
      type: String
  },
  email: {
    type: String
  },
  streetAddress: {
    type: String
  },
  phone: {
    type: String
  },
  salary: {
    type: Number
  },
  password: {
    type: String
  },
  roles: {
    type: Array
  }

});
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('User', userSchema);
module.exports = User;
