const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const _ = require('lodash');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
  email:{
    type:String,
    trim:true,
    minlength:1,
    required:true,
    unique:true,
    validate:{
      validator: validator.isEmail, //function validator.isEmail()
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
})

userSchema.methods.toJSON = function(){//overwrite the toJSON method of mongoose
  let user = this;

  return _.pick(user, ['_id','email']);
}

userSchema.methods.generateAuthToken = function () {
  let user = this;//should be an object of the document instance
  let access = 'auth';
  let token = jwt.sign({_id:user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{//return the promise with token so the calling method can chain
    return token;
  });
}

userSchema.statics.findByToken = function (token) {
  let user = this;
  let decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  }catch (e) {
    return Promise.reject(); //return a rejected Promise if verification failed
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  })
}

userSchema.pre('save', function(next){
  let user = this;

  if(user.isModified('password')){//check if the password key's value for the document is modified
    //if modified, change it into a hash
    user.password = bcrypt.hashSync(user.password,10);
  }
  next();
})

module.exports = mongoose.model('User',userSchema);
