const express = require('express');
const router = express.Router();
const villainsController = require('../controllers/villainsController');

router.get('/', villainsController.get);
router.get('/villains', villainsController.getAllVillains);
router.get('/villains/:id', villainsController.getVillainById);
router.get('/villains/name/:name', villainsController.getVillainByName);
router.post('/villains', villainsController.createVillain);
router.put('/villains/:id', villainsController.updateVillain);
router.delete('/villains/:id', villainsController.deleteVillain);

module.exports = router;