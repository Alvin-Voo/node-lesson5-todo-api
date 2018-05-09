// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //use ES6 destructuring to pull in more classes
//sort of like import statement

MongoClient.connect('mongodb://localhost:27017/', (err,client)=>{
  if(err) return console.log('Unable to connect to MongoDB server');

  console.log('Connected to MongoDB server');

  db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result)=>{
  //   if(err) return console.log('Unable to insert todo', err)
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })
  db.collection('Users').insertOne({
    name: 'alvin', //driver will insert the id
    age: 5,
    location: 'SG'
  }, (err, result)=>{
    if(err) return console.log('Unable to insert todo', err)

    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp()); //ObjectID.getTimestamp()
  })

  client.close();
})
