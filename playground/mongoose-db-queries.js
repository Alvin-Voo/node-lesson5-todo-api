const {ObjectID} = require('mongodb');

const mongoose = require('../server/db/mongoose');
const Todo = require('../server/models/Todo');
const User = require('../server/models/User');

let id = '5af29a39da6a7517e2ea6c4b';

//id validation with native mongodb driver
if(!ObjectID.isValid(id)) return console.log('ID not valid');

User.findById(id).then((user)=>{
  if(!user) return console.log('user not found');
  console.log('user by id',user);
}).catch((e)=>console.log(e));
