const express = require('express');
const SeanceController = require('../controllers/SeanceController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const router = express.Router();

router.get('/', verifyToken, (req, res) => SeanceController.getSeances(req, res));
router.get('/places/:id', verifyToken, (req, res) => SeanceController.getPlaces(req, res));
router.get('/:id', verifyToken, (req, res) => SeanceController.getSeance(req, res));
router.post('/create', verifyToken, checkRole('admin'), (req, res) => SeanceController.create(req, res));
router.put('/update/:id', verifyToken, checkRole('admin'), (req, res) => SeanceController.updateSeance(req, res));
router.delete('/delete/:id', verifyToken, checkRole('admin'), (req, res) => SeanceController.deleteSeance(req, res));


module.exports = router;
