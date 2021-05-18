const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bingoGame',{
    // writing this to avaoid deprication warnings
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error in connecting"));

db.once('open',function(){
    console.log('Connected to DB:: Mongo');
});

module.exports = db;