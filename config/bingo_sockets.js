const {index,createRoom,joinRoom,startGame,playerSelect} = require('../controllers/api/v1/game_api'); 
const Game = require('../models/game');

// const {createRoom} = require('../controllers/bingoGame');
let roomToSocketMap = {}
module.exports.bingoSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    // console.log('io',io);

    io.on('connection',(socket) => {
        console.log("have a new connection!!");

        socket.on('join-room', ({name,room}, callback) => {
            // console.log(name, room); 
            // console.log(socket.id);
        
            const repo =  Game.findOne({room_id:room}).exec(function(err, docs) {
                if(docs !== null){
                    console.log(docs);
                    const  {error,user} = joinRoom({id:socket.id,name, room}).then((user) => {
                        if(error){
                            return callback(error);
                        }
                        console.log("in join room :",user.joinPlayer[0].room_id);
                        socket.join(user.joinPlayer[0].room_id);  
                        socket.broadcast.to(user.joinPlayer[0].room_id).emit('message', user.joinPlayer[0].players[user.count-1].name);
                        socket.emit('welcome', user);
                        callback();
                    })
                }else{
                    const  {error,user} = createRoom({id:socket.id,name, room}).then((user) => {
                        if(error){
                            return callback(error);
                        }
                        console.log("in createRoom:",user);
        
                        socket.join(user.room.room_id);  
        
                        socket.emit('welcome', user);
                        // socket.braodcast.to(user.room.rood_id).emit('welcome', { user: 'admin', text: `${user.room.players.name}, has joined!`})
                        // console.log(socket);
                        // console.log("room id",io.adapter.rooms[room]);
                        callback();
                    });
                    
                }
        
                })
            }); 
        socket.on('startGame', (room, callback) => {
            console.log(room);
            const{error,game_board} = startGame({room}).then((game_board) => {
                setTimeout(function(){ 
                console.log("1st");
                if(error){
                    return callback(error);
                }
                const repo =  Game.findOne({room_id:room.room}).exec(function(err, docs) {
                    // console.log("in start game",docs.game_board);
                    io.in(room.room).emit('game_board',docs.game_board);
                })
            },3000)
        });     
        })
            
        socket.on('disconnect',() => {
            console.log('user left');

        });

    });
}