import React,{useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import jsonParse from 'parse-json';

import './game.css';

let socket;

const Game = ({ location }) => {

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');
    const[card,setCard] = useState([]);
    const[creator,setcreator] = useState([]);
    const[bingoBoard,setBingoBoard] = useState([]);
    const[selected,setSelected] = useState([]);
    const[count,setCount] = useState(1);
    const[isSelected,setIsSelected] = useState(false);
    const[win,setWin] = useState('');
    const[lost,setLost] = useState('');
    // let selected = [];
    
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
    
        const { name,room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join-room',{ name,room }, () => {
            // console.log(socket);
        });

        
        // to unmount effect hook

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    },[ENDPOINT, location.search]); // only if these two value change, the useEffect will work

    useEffect(() => {
        socket.on('welcome', user => {
            if(user.count === 0){
                console.log(user.room.players[0].card,user.count);
                setCard(jsonParse(user.room.players[user.count].card));
                setcreator(user.room.creator);
                setRoom(user.room.room_id);
            }else{
                setCard(jsonParse(user.joinPlayer[0].players[user.count-1].card));
            }
          
        });
        socket.on('message', function(data) {
            console.log('Incoming message:', data);
            alert(data);
         });

         socket.on('game_board',function(data){
             let i = 0;
                 setInterval(() => {
                    if(i<=data.length){
                    setBingoBoard(arr => [...arr, data[i]]);
                    setCount(i)
                    if(i==30){
                        document.getElementById("showBoardNumber").innerHTML = "over";         
                    }else{
                        document.getElementById("showBoardNumber").innerHTML = data[i];
                    }
                    i++;
                    }
                 }, 2000);
                 console.log(bingoBoard);    
         })

         socket.on('winLOST',function(data){
             console.log(data);
             alert("winner and looser", data);
         })
    }, []);

    function showResults(){
        console.log("yeyey")
        socket.emit('results',{ win,lost,room });
    }

    const showStart = (who) =>{
        if(who!=''){
            return(
                <button onClick={startGame}>START</button>
            )
        }
    } 
    
    function startGame(){
        socket.emit('startGame',{room});
    }
    
    const selectNumber = (id) =>{
        if(bingoBoard.includes(id) && !selected.includes(id)){
            setSelected(arr => [...arr, id ]);
            if(isSelected === false){
                setIsSelected(true);
            }
            console.log("yourss:",selected);
            document.getElementById(id).style.backgroundColor = "yellow";
        }
    }

    const isBingo = () =>{
    let bingo = true;
    let index1;
    let index2;
    let k = 0;
    let bingoDiagonal = false;
        console.log("selection is", selected);
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                if(card[i][j] == selected[0]){
                     index1 = i;
                     index2 = j;
                }
            }
        }

        if(index1 == index2){
            let i = 0;
            let j = 0;
            for( k=0;k<5;k++){
                if(!selected.includes(card[i+k][j+k])){
                    break;
                }
            }
            if(k==5){
                bingoDiagonal = true;
            }
        }

        if(!bingoDiagonal && (index1+index2 == 4)){
            if(selected.includes(card[0][4]) && selected.includes(card[1][3]) && selected.includes(card[2][2]) && selected.includes(card[3][1]) && selected.includes(card[4][0])){
                bingoDiagonal = true;                
            }
            
        }

        
        if(!bingoDiagonal){
            for(let i=0;i<5;i++){
                // console.log(card[i][index2])
                if(!selected.includes(card[i][index2])){
                    bingo = false;
                    break;
                }
            }
        }
        
        if(!bingo){
            let j;
            for(j=0;j<5;j++){
                // console.log("j"+card[index1][j])
                if(!selected.includes(card[index1][j])){
                    bingo = false;
                    break;
                }
                
            }
            if(j==5){
                bingo = true;
            }   
        }
        if(bingo || bingoDiagonal){
            setWin(name);
            alert("bingo, you won");
            showResults();
        }else{
            if(count<30){
                alert("game is still on");
                return;
            
            }else if(selected.length>1){
                selected.splice(0,1);
                isBingo(); 
            }
            else if(count == 30){
                setLost(name);
                console.log(lost);
                alert("you lost");
                showResults();
            }
        }
    }

    const whatColor = () => {
        let color=[
            'rgb(118, 240, 101)','rgb(240, 69, 69)','rgb(41, 44, 241)','rgb(250, 160, 42)','rgb(249, 62, 255)','rgb(202, 106, 231)','rgb(211, 241, 76)'
            ,'rgb(243, 45, 45)','rgb(53, 65, 235)','rgb(33, 241, 137)','rgb(149, 240, 46)','rgb(218, 41, 241)','rgb(220, 233, 37)','rgb(233, 51, 151)'
            ,'rgb(235, 221, 26)','rgb(154, 245, 69)','rgb(208, 18, 214)','rgb(243, 28, 28)','rgb(6, 255, 243)','rgb(228, 122, 231)','rgb(0, 255, 98)'
            ,'rgb(255, 0, 0)','rgb(231, 150, 252)','rgb(238, 71, 71)'
        ]
        return color[Math.floor(Math.random() * color.length)];
    }

    return (
        <div>
            <h1>BINGO {name}</h1>
           <div>
               
               <table>
               <thead>
                   <tr id="bingoRow">
                       <td>B</td>
                       <td>I</td>
                       <td>N</td>
                       <td>G</td>
                       <td>O</td>
                   </tr>
               </thead>
               <tbody>
                    {card.slice(0, card.length).map((item, index) => {
                            return (
                            <tr>
                                <td id={item[0]} onClick={() => selectNumber(item[0])} style={{backgroundColor: whatColor()}}>{item[0]}</td>
                                <td id={item[1]} onClick={() => selectNumber(item[1])} style={{backgroundColor: whatColor()}}>{item[1]}</td>
                                <td id={item[2]} onClick={() => selectNumber(item[2])} style={{backgroundColor: whatColor()}}>{item[2]}</td>
                                <td id={item[3]} onClick={() => selectNumber(item[3])} style={{backgroundColor: whatColor()}}>{item[3]}</td>
                                <td id={item[4]} onClick={() => selectNumber(item[4])} style={{backgroundColor: whatColor()}}>{item[4]}</td>
                            </tr>
                            );
                        })}
                </tbody>
               </table>
            <div>{showStart(creator)}</div>
            <div id="showBoardNumber">
                Numbers are
            </div>
            <div>
                <h1>
                    your selection is {selected} 
                </h1>
            </div>
            {
                (isSelected === true) ? <button onClick={isBingo}>  BINGO {count} </button> : ''
            }
            
           </div>
        </div>
        
        
    )
}



export default Game;