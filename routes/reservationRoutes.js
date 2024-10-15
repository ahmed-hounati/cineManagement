const express = require('express');
const ReservationController = require('../controllers/ReservationController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const router = express.Router();

router.get('/', verifyToken, (req, res) => ReservationController.getAllReservations(req, res));
router.get('/:id', verifyToken, (req, res) => ReservationController.getReservation(req, res));
router.post('/create', verifyToken, (req, res) => ReservationController.create(req, res));
router.put('/update/:id', verifyToken, (req, res) => ReservationController.updateReservation(req, res));
router.delete('/delete/:id', verifyToken, (req, res) => ReservationController.deleteReservation(req, res));


module.exports = router;
