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
    (err)=>res.send(err)
  )
})

app.listen(3000, ()=>{
  console.log('started on port 3000')
});
