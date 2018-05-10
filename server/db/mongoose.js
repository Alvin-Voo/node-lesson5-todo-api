const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const dbdomain = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'

mongoose.connect(dbdomain);
mongoose.isValidId = ObjectID.isValid;


module.exports = mongoose;
