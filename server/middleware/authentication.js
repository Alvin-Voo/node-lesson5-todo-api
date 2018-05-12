const User = require('../models/User');

let authenticate = (req, res, next) =>{
  let token = req.header('x-auth');

  User.findByToken(token).then((user)=>{
    if(!user) return Promise.reject();
    // res.send(user);
    req.user = user;
    req.token = token;

    next() //must pass next() in middleware to ensure the request continues
  }).catch((e) => res.status(401).send());//not authorized

}

module.exports = {authenticate};
