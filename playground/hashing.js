const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

let token = jwt.sign(data, '123abc');

console.log(token);

let decodedToken = jwt.verify(token,'123abc'); //can only verify with the 'secret' known

console.log(decodedToken);
