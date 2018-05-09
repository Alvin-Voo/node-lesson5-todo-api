const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  email:{
    type:String,
    trim:true,
    minlength:1,
    required:true
  }
})

module.exports = mongoose.model('User',userSchema);
