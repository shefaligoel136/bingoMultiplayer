const Game = require('../../../models/game');


let arr = createArray(0,75);
let numbersArray = createArray(0,75);
let count = 0;

// This api returns all the current game

module.exports.index = async function(request,response){
    try{
        let currentGames = await Game.find({})
        console.log(request.name,request.room);
        response.send(currentGames);
        return response.status(200).json({
            
            message: "The Current games are",
        })

    }catch(err){

    }
}

// This creates a new room, on creation of the room : the person who has created the room, his bingo card generates(createCard() function does that work)

module.exports.createRoom = async function(request,response){
    try{
        
        let room = await Game.create({
            "players" : {
                "name" : request.name,
                "client_id" : request.id,
                "card" : createCard()
            },
           
            room_id : request.room,
            creator : request.id
        })

        room.save();
        let count = 0;
        // console.log(room)
        return {room,count}
            
        // return response.status(200).json({
        //     data: {
        //         room: room,

        //     },
        //     message: "Room Created",
        // })
    }catch(err){
        console.log(err);
    }
} 

// this api is for joining the room, as a new player joins his bingo card generates and gets added in the game module

module.exports.joinRoom = async function(request,response){
    try{
        // let nPlayer = await Game.find({_id: request.query.game_id},{players: 1})
        // let countPlayer = nPlayer[0].players.length
        // console.log(countPlayer);
        let join;
        join = await Game.findOneAndUpdate({
                        // _id : request.query.game_id,
                        room_id : request.room
                    },{$push:{
                        "players" : {
                            "name" : request.name,
                            "client_id" : request.id,
                            "card" : createCard()
                        }
        }});
        
        let joinPlayer = await Game.find({room_id : request.room})
        // join.save();
        console.log(joinPlayer);
        let count = joinPlayer[0].players.length;
        
        return{joinPlayer,count};

        // return response.status(200).json({
        //     data: {
        //         join: join,

        //     },
        //     message: "Room Joined",
        // })
            
    }catch(err){
        console.log(err);
    }
}

// for starting the game

module.exports.startGame =  async function(request,response){
    try{
        console.log("2nd",request.room.room);
         
        let game = await Game.find({room_id : request.room.room}).exec(function(err,game){
            let board = [];
            let i;
            // setInterval(function(){ 
                //this code runs every 3 seconds 
                // if(count<30){
                //     count++;
                for(i=0;i<30;i++){

                
                    let randomIndex = generateNumber(0,numbersArray.length-1);
        
                    let randomNumber = numbersArray[randomIndex];
                    // console.log(randomNumber);
                    // console.log(game);
        
                    game[0].game_board.push(randomNumber);
                    board.push(randomNumber);
        
                    // numbersArray.splice(randomIndex,1);
                    // if(randomNumber>=1 && randomNumber<=15){
                    //     randomNumber = "B"+randomNumber;
                    // }else if(randomNumber>=16 && randomNumber<=30){
                    //     randomNumber = "I"+randomNumber;
                    // }else if(randomNumber>=31 && randomNumber<=45){
                    //     randomNumber = "N"+randomNumber;
                    // }else if(randomNumber>=46 && randomNumber<=60){
                    //     randomNumber = "G"+randomNumber;
                    // }else if(randomNumber>=61 && randomNumber<=75){
                    //     randomNumber = "O"+randomNumber;
                    // }
                    
                    // output.innerHTML = randomNumber;
                    // play();  
                    // game.save();
                }
                    // output.innerHTML = allBingoNumber;
                    console.log("Over");
                    // const filter = {room_id : request.room};
                    // const update = {game_board : game[0].game_board}
                    // Game.findOneAndUpdate(filter, update, {
                    //     new: true,
                    //     upsert: true
                    // });
                    // console.log("board numbers",board);
                    // return [1,2,3];
                     board = changeDB(request.room.room,game[0].game_board).then((board) =>{
                        console.log("numbersss",board.game_board);
                        gb = board.game_board;
                        return {gb};
                    });
                        
                    // Game.save(game);
                    // const filter = {room_id : request.room};
                    // const update = {game_board : game[0].game_board}

                    // let doc = await Game.findOneAndUpdate(filter, update, {
                    //         new: true,
                    //         upsert: true
                    // });
                    // clearInterval();
                    
                
            
            // return response.status(200).json({
            //     data: {
            //         game: game,
    
            //     },
            //     message: "Game Started",
            // })
            
            // return board;
            // console.log("board",board);
            // return board;
        });    
    }catch(err){
        console.log(err);
    }
    
}

const changeDB = async function(room_id,game_board){
    const filter = {room_id : room_id};
    const update = {game_board : game_board}
    let board =  await Game.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true
    });
    console.log("board numbers",board);
    return board;
}

// when a person selects a new number on card, this fucntion gets called

module.exports.playerSelect = async function(request,response){
    try{
        let game = await (await Game.findOne({_id:request.query.game_id})).execPopulate(function(err,game){
            // console.log(game.players);
            game.players.map(player =>{
                if(player._id == request.query.player_id){
                    player.bingoNumbers.push(request.query.number)
                }
                // console.log(player._id);
            })
            return response.status(200).json({
                data: {
                    game: game
        
                },
                message: "Room Created",
            })
        })
        
    
    
    }catch(err){
        console.log(err);
    }
    
}

function generateNumber(min,max){
        let step1 = max - min + 1;
        let step2 = Math.random() * step1;
        let result = Math.floor(step2) + min;
        return result;
    }
    
function createArray(start,end){
        let myArray = [];
    
        for(let i=start;i<end;i++){
            myArray.push(i+1);
        }
    
        return myArray;
}

function displayCard(card) {
    content = "";
    for(let i=0;i<5;i++){
        content =content + "<tr>";
        for(let j=0;j<5;j++){''
            content = content + "<td id='" + card[i][j] + "' onclick='selectNumber("+ card[i][j] +")'>" + card[i][j] + "</td>";
        }
        content = content + "</tr>";
    }
    document.getElementById("display_card").innerHTML = content;
}
    


function createCard(){
    
    // console.log(arr);
    let card = [];
    let num;
    for(let i=0;i<5;i++){
        card[i] = [];
        for(let j=0;j<5;j++){
            if(j==0){
               num = generateCardNumber(1,15); 
               card[i][j] = num;
            }else if(j==1){
                num =  generateCardNumber(16,30);
                card[i][j] = num;
            }else if(j==2){
                num =   generateCardNumber(31,45); 
                card[i][j] = num;
            }
            else if(j==3){
                num =   generateCardNumber(46,60); 
                card[i][j] = num;
            }
            else if(j==4){
                num =   generateCardNumber(61,75); 
                card[i][j] = num;
            }
        }

    }
    console.log(card);
    // displayCard(card);
    return JSON.stringify(card);
}

function generateCardNumber(i,j){
    let randomIndex = generateNumber(i,j);
    let randomNumber = arr[randomIndex - 1];
    if(randomNumber == -1){
        return generateCardNumber(i,j);
    }
    arr[randomIndex - 1] = -1;
    return randomNumber;
}

// function play() {   
//     var beepsound = new Audio(   
//     'https://www.soundjay.com/button/sounds/beep-01a.mp3');   
//     beepsound.play();   
// }  