// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //use ES6 destructuring to pull in more classes
//sort of like import statement

MongoClient.connect('mongodb://localhost:27017/', (err,client)=>{
  if(err) return console.log('Unable to connect to MongoDB server');

  console.log('Connected to MongoDB server');

  db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5af16d6a1b882321ee0f39dd')
  // }).toArray().then(
  //   (docs)=>{
  //     console.log(JSON.stringify(docs,undefined,2));
  //     client.close(); //async callback, close AFTER retrieve result
  //   },
  //   (err)=>console.log('Unable to fetch todos ',err)
  // )
  db.collection('Users').find({
    name: 'alvin'
  }).toArray().then(
    (docs)=>{
      console.log(JSON.stringify(docs,undefined,2));
      client.close(); //async callback, close AFTER retrieve result
    },
    (err)=>console.log('Unable to fetch todos ',err)
  )

})
