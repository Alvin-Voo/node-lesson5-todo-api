const {ObjectID} = require('mongodb');
const jwt  = require('jsonwebtoken');

const Todo = require('../../models/Todo');
const User = require('../../models/User');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

//test datas to be sent to server

const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123')
  }]
},{
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}];

const todos = [
  {
    _id: new ObjectID(),
    text: 'test something todo 1'
  },
  {
    _id: new ObjectID(),
    text: 'test something todo 2',
    completed: true,
    completedAt: 333
  }
]

//to test exisitng data in db
const populateUsers = (done) =>{
  User.remove({}).then(()=>{
    let userOne = new User(users[0]).save();//use save as there is pre save
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]) //return a promise when all promises have returned
  }).then(() => done());
}

const populateTodos = (done) =>{//this will be called before each mocha test run
  Todo.remove({}).then(()=>{//the db will be wiped everytime
    return Todo.insertMany(todos);
  }).then(()=>done());
}

module.exports = {todos, populateTodos, users, populateUsers};
