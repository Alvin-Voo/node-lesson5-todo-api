// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //use ES6 destructuring to pull in more classes
//sort of like import statement

MongoClient.connect('mongodb://localhost:27017/', (err,client)=>{
  if(err) return console.log('Unable to connect to MongoDB server');

  console.log('Connected to MongoDB server');

  db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //   _id:new ObjectID('5af16276ef6deb2fa19ede2f')
  // },{
  //   $set:{
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then(
  //   (docs)=>{
  //     console.log(JSON.stringify(docs,undefined,2));
  //     client.close(); //async callback, close AFTER
  //   },
  //   (err)=>console.log('Unable to delete docs ',err)
  // )
  db.collection('Users').findOneAndUpdate({
    _id:new ObjectID('5af17028df12b03da1ca2003')
  },{
    $set:{
      name: 'jiji'
    },
    $inc:{
      age: 1
    }
  },{
    returnOriginal: false
  }).then(
    (docs)=>{
      console.log(JSON.stringify(docs,undefined,2));
      client.close(); //async callback, close AFTER
    },
    (err)=>console.log('Unable to delete docs ',err)
  )

})
