const express = require('express');

const mongoose = require('./db/mongoose');
const Todo = require('./models/Todo');
const User = require('./models/User');

let app = express();

app.use(express.json());//<--- can now send json body as request to this server (API)

app.post('/todos',(req,res)=>{
  let todo = new Todo(req.body);

  todo.save().then(
    (result)=>res.send(result),
    (err)=>res.status(400).send(err)
  )
})

app.get('/todos',(req,res)=>{
  Todo.find().then(
    (docs)=>{//this will return an array of doc(s)
      res.send({docs})//sending an object instead of just the array is better, since its more customizable
    },
    (err)=>res.status(400).send(err)
  )
})

app.listen(3000, ()=>{
  console.log('started on port 3000')
});


module.exports = app;
