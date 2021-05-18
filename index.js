const express = require('express');
const cors = require('cors');
const port = 8000;

const app = express();
app.use(cors());

const db = require('./config/mongoose');

const bingoServer = require('http').Server(app);
const bingoSockets = require('./config/bingo_sockets').bingoSockets(bingoServer);
bingoServer.listen(5000);
console.log('Bingo Server is listening on port 5000');

app.use('/',require('./routes'));

app.get('/',function(req,res){
    res.send('<h1>BINGO GAME</h1>');
})



app.listen(port,function(err){
    if(err){
        console.log("Error!",err);
        return;
    }
    console.log(`Server running on port ${port}`);
})