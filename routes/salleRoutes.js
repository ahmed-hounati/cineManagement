const express = require('express');
const SalleController = require('../controllers/SalleController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const router = express.Router();

router.get('/', verifyToken, (req, res) => SalleController.getSalles(req, res));
router.get('/:id', verifyToken, (req, res) => SalleController.getSalle(req, res));
router.post('/create', verifyToken, checkRole('admin'), (req, res) => SalleController.create(req, res));
router.put('/update/:id', verifyToken, checkRole('admin'), (req, res) => SalleController.updateSalle(req, res));
router.delete('/delete/:id', verifyToken, checkRole('admin'), (req, res) => SalleController.deleteSalle(req, res));


module.exports = router;