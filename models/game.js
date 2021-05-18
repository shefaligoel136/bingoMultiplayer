const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const player = new Schema({
//     name : {type : String},
//     card : {type: String},
//     bingoNumbers : {type : [Number], default : []}
// })

const gameSchema = new Schema({
    players : [{name : {type : String, default : " "},
                card : {type: String , default : " "},
                client_id : {type: String , default : " "},
                bingoNumbers : {type : [Number], default : []}}],
    game_board: {type : [Number]},
    room_id : {type: String , default : " "},
    game_id: {type : String},
    creator: {type: String , default : " "}
},{
    timestamps : true
});

const GameSchema = mongoose.model('GameSchema',gameSchema);
module.exports = GameSchema;