const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../server')
const Todo = require('../models/Todo');
const User = require('../models/User');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//before each test functions
beforeEach(populateUsers);

beforeEach(populateTodos);

const agent = request.agent(app);

describe('POST /todos',()=>{
  it('should create a new todo', (done)=>{
    let text = "some testing text";

    agent
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res)=>{//response is returned
      expect(res.body.text).toBe(text);
    })
    .end((err, res)=>{
      if(err) return done(err);

      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    });
  });

  it('should not create todo with invalid body data', (done)=>{
    agent
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send()
    .expect(400)
    .end((err,res)=>{
      if(err) return done(err);

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>done(e));
    })
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    agent
    .get('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  })
});

describe('GET /todos/:id',()=>{
  it('should return todo doc',(done)=>{
    agent
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  })

  it('should not return todo doc created by other user', (done)=>{
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })

  it('should return 404 if todo not found', (done)=>{
    agent
    .get(`/todos/${(new ObjectID()).toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })

  it('should return 404 for non-object ids', (done)=>{
    agent
    .get(`/todos/12345`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id',()=>{
  it('should remove a todo', (done)=>{
      agent
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err,res)=>{
          if(err) return done(err);
          Todo.findById(`${todos[0]._id.toHexString()}`).then(
            (todo)=>{
              // expect(todo).not.toEqual(expect.anything())//toNotExist
              expect(todo).toBeFalsy();
              done();
            }
          ).catch((e)=>done(e));
      })
  });

  it('should not remove a todo by other user', (done)=>{
      agent
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err,res)=>{
          if(err) return done(err);
          Todo.findById(`${todos[0]._id.toHexString()}`).then(
            (todo)=>{
              // expect(todo).toEqual(expect.anything())//toExist
              expect(todo).toBeTruthy();
              done();
            }
          ).catch((e)=>done(e));
      })
  });

  it('should return 404 if todo not found',(done)=>{
    agent
    .delete(`/todos/${(new ObjectID()).toHexString()}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if object id is invalid',(done)=>{
    agent
    .delete(`/todos/12345`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', ()=>{
  it('should update the todo',(done)=>{
    let updatedText = 'updated test something todo 1'
    agent
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send({
      text: updatedText,
      completed: true
    })
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(updatedText);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done)

  });

  it('should not update the todo of other user',(done)=>{
    let updatedText = 'updated test something todo 2'
    agent
    .patch(`/todos/${todos[0]._id.toHexString()}`)
    .send({
      text: updatedText,
      completed: true
    })
    .set('x-auth',users[1].tokens[0].token)
    .expect(404)
    .end(done)

  });

  it('should clear completedAt when todo is not completed', (done)=>{
    let updatedText = 'updated test something todo 2';
    agent
    .patch(`/todos/${todos[1]._id.toHexString()}`)
    .send({
      text: updatedText,
      completed: false
    })
    .set('x-auth',users[1].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(updatedText);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeNull();
    })
    .end(done)
  })

})

describe('GET /users/me',()=>{
  it('should return user if authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});//to equal empty
    })
    .end(done);
  })
});

describe('POST /users',()=>{
  it('should create a user', (done)=>{

    let email = 'hannah@33.com';
    let password = '123456'

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email)
    })
    .end((err)=>{
      if(err) return done(err);

      //check in db
      User.findOne({email}).then((user)=>{
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch((e)=>done(e));
    })
  });

  it('should return validation errors if request invalid', (done)=>{

    let email = '1mdb@1';
    let password = '12345';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);

  });

  it('should not create user if email in use', (done)=>{

    let email = users[0].email;
    let password = '123456';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
})

describe('POST /users/login', ()=>{
  it('should login user and return auth token', (done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toEqual(expect.anything());
    })
    .end((err,res)=>{
      if(err) return done(err)

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[1]).toEqual(
          expect.objectContaining({//expect the db object to have these properties
            access: 'auth',
            token: res.headers['x-auth']
          })
        )
        done();
      }).catch((e)=>done(e));
    })
  })

  it('should reject invalid login',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: '123456'
    })
    .expect(400)
    .expect((res)=>{
      expect(res.headers).not.toHaveProperty('x-auth');//token is not sent back
    })
    .end((err,res)=>{
      if(err) return done(err)

      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens).toHaveLength(1);
        done();
      }).catch((e)=>done(e));
    })
  })
});

describe('DELETE /users/me/token', ()=>{
  it('should remove auth token on logout', (done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err, res)=>{
      if(err) return done(err)
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens).toHaveLength(0);
        done();
      }).catch((e)=>done(e));
    })
  })
});
