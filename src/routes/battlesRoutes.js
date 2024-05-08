const express = require('express');
const router = express.Router();
const battlesController = require('../controllers/battlesController');

router.post('/battles', battlesController.BattleWinner);
router.get('/battles', battlesController.getBattles);
router.get('/battles/:name', battlesController.getBattlesByVillainName);
router.delete('/battles/:id', battlesController.deleteBattle);

module.exports = router;