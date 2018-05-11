const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


let password = '123abc!';


// let hash = bcrypt.hashSync(password, 10);
//
// let known = bcrypt.hashSync(password, hash.substr(0, hash.length-31))
// console.log(hash);
// console.log(known);

// var data = {
//   id: 10
// }
//
// let token = jwt.sign(data, '123abc');
//
// console.log(token);
//
// let decodedToken = jwt.verify(token,'123abc'); //can only verify with the 'secret' known
//
// console.log(decodedToken);

//$2a$10$PUCK/o9QQAuo8D4VhPcxm.H9RTSRbqHpCw4lhtvtNw6BTyhfeyAPm


console.log(bcrypt.hashSync(password,'$2a$10$PUCK/o9QQAuo8D4VhPcxm.'));
