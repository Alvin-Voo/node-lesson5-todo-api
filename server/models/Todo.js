const mongoose = require('mongoose');
const User = require('./User');

let todoSchema = mongoose.Schema({
  text: {
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  completed: {
    type:Boolean,
    default:false
  },
  completedAt: {
    type:Number,
    default:null
  },
  _creator:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Todo',todoSchema);
