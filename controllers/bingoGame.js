const { request } = require('express');
const Game = require('../models/game');

let arr = createArray(0,75);
let numbersArray = createArray(0,75);
let count = 0;

module.exports.createRoom = ({id,name,room}) =>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    const room1 =  Game.create({
        "players" : {
            "name" : request.name,
            "card" : createCard()
        },
        game_id : request.id,
        room : request.room
    })
    return {
        room1
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
