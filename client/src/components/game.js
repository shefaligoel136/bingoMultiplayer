import React,{useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import jsonParse from 'parse-json';

let socket;

const Game = ({ location }) => {

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');
    const[card,setCard] = useState([]);
    const[creator,setcreator] = useState([]);
    const bingoBoard = [];
    let selected = [];
    
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
    
        const { name,room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join-room',{ name,room }, () => {
            console.log(socket);
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
                    if(i<data.length){
                    bingoBoard.push(data[i]);
                    console.log(bingoBoard);
                    document.getElementById("showBoardNumber").innerHTML = data[i];
                    i++;
                    }
                 }, 2000);
                 console.log(bingoBoard);
             
         })
    }, []);

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
        console.log(bingoBoard);

        if(bingoBoard.includes(id)){
            selected.push(id);
            document.getElementById(id).style.backgroundColor = "yellow";
        }
        
    }

    return (
        <div>
            <h1>BINGO {name}</h1>
           <div>
               
               <table>
               <thead>
                   <tr>
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
                                <td id={item[0]} onClick={() => selectNumber(item[0])}>{item[0]}</td>
                                <td id={item[1]} onClick={() => selectNumber(item[1])}>{item[1]}</td>
                                <td id={item[2]} onClick={() => selectNumber(item[2])}>{item[2]}</td>
                                <td id={item[3]} onClick={() => selectNumber(item[3])}>{item[3]}</td>
                                <td id={item[4]} onClick={() => selectNumber(item[4])}>{item[4]}</td>
                            </tr>
                            );
                        })}
                </tbody>
               </table>
            <div>{showStart(creator)}</div>
            <div id="showBoardNumber">
                Numbers are
            </div>
           </div>
        </div>
        
        
    )
}



export default Game;