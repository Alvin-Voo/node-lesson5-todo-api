// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //use ES6 destructuring to pull in more classes
//sort of like import statement

MongoClient.connect('mongodb://localhost:27017/', (err,client)=>{
  if(err) return console.log('Unable to connect to MongoDB server');

  console.log('Connected to MongoDB server');

  db = client.db('TodoApp');

  db.collection('Users').deleteMany({
    name: 'alvin'
  }).then(
    (docs)=>{
      console.log(JSON.stringify(docs,undefined,2));
      // client.close(); //async callback, close AFTER
    },
    (err)=>console.log('Unable to delete docs ',err)
  )

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5af166bfae967534c23c7c98')
  }).then(
    (docs)=>{
      console.log(JSON.stringify(docs,undefined,2));
      client.close(); //async callback, close AFTER
    },
    (err)=>console.log('Unable to delete doc ',err)
  )

})
