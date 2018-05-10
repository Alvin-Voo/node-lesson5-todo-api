const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const dbdomain = process.env.MONGODB_URI;

mongoose.connect(dbdomain);
mongoose.isValidId = ObjectID.isValid;


module.exports = mongoose;
