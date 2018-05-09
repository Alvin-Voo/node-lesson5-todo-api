const expect = require('expect');
const request = require('supertest');

const app = require('../server')

const Todo = require('../models/Todo');
const User = require('../models/User');


beforeEach((done)=>{//this will be called before each mocha test run
  Todo.remove({}).then(()=>done());//the db will be wiped everytime
});

describe('POST /todos',()=>{
  it('should create a new todo', (done)=>{
    let text = "some testing text";

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{//response is returned
      expect(res.body.text).toBe(text);
    })
    .end((err, res)=>{
      if(err) return done(err);

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    });
  });

  it('should not create todo with invalid body data', (done)=>{
    request(app)
    .post('/todos')
    .send()
    .expect(400)
    .end((err,res)=>{
      if(err) return done(err);

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(0);
        done();
      }).catch((e)=>done(e));
    })
  });
});
