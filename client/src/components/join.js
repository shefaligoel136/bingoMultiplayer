import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const Join = () => {

    const[name,setName] = useState('');
    const[room,setRoom] = useState('');

    return (
        <div>
            <h1>JOIN</h1>

            <div>
                <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
                <input placeholder="Room" className="joinInput" type="text" onChange={(event) => setRoom(event.target.value)} />
            </div>

            <Link onClick={event => (!name || !room) ? event.preventDefault() : null } to={`/game?name=${name}&room=${room}`}>
                <button className="button" type="submit">Join</button>
            </Link>
        </div>
        
    )
}

export default Join;