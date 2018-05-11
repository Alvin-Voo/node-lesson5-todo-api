require('./config/config.js');

const port = process.env.PORT;

const express = require('express');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
const Todo = require('./models/Todo');
const User = require('./models/User');

//middlewares
const {authenticate} = require('./middleware/authentication');

let app = express();

app.use(express.json());//<--- can now send json body as request to this server (API)

//todos
app.post('/todos',(req,res)=>{
  let todo = new Todo(req.body);

  todo.save().then(
    (result)=>res.send(result),
    (err)=>res.status(400).send(err)
  )
})

app.get('/todos',(req,res)=>{
  Todo.find().then(
    (todos)=>{//this will return an array of doc(s)
      res.send({todos})//sending an object instead of just the array is better, since its more customizable
    },
    (err)=>res.status(400).send(err)
  )
})


app.get('/todos/:id',(req,res)=>{
  let id = req.params.id

  if(!mongoose.isValidId(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then(
    (todo)=>{
      if(todo) return res.send({todo})//objectify all return objects..
      return res.status(404).send();
    }
  ).catch((err)=>res.status(400).send());
})

app.delete('/todos/:id',(req,res)=>{
  let id = req.params.id

  if(!mongoose.isValidId(id)) return res.status(404).send();

  Todo.findByIdAndRemove(id).then(
    (todo)=>{
      if(!todo) return res.status(404).end()
      return res.send({todo})
    }
  ).catch((err)=>res.status(400).send());
})

app.patch('/todos/:id',(req,res)=>{
  let id = req.params.id;
  let body = _.pick(req.body, ['text','completed']);//request object is from user

  if(!mongoose.isValidId(id)) return res.status(404).send();

  if(_.isBoolean(body.completed) && body.completed){//using lodash to check if its boolean
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set: body},{new:true}).then(
    (todo)=>{
      if(!todo) return res.status(404).end();
      res.send({todo});
    }).catch((e)=>res.status(400).send());
})

//users
app.post('/users',(req,res)=>{
  let body = _.pick(req.body,['email','password']);
  let user = new User(body);

  user.save().then(()=>{
      return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);//send the user
    //(converted implicitly by user.toJSON()), which we already overwritten
    //send the token back as a custom header x-auth
  }).catch((e)=>{
    res.status(400).send(e);//bad request
  })
})

app.get('/users/me', authenticate, (req,res)=>{ //authenticate is a callback function (or middleware)
  res.send(req.user);
})


app.listen(port, ()=>{
  console.log('started on port '+port);
});


module.exports = app;
