const express = require('express');
const router = express.Router();

const gameApi = require("../../../controllers/api/v1/game_api");

router.get('/',gameApi.index);

router.post('/createRoom',gameApi.createRoom);
router.post('/joinRoom',gameApi.joinRoom);
router.get('/startGame',gameApi.startGame);
router.get('/playerSelect',gameApi.playerSelect);


module.exports = router;