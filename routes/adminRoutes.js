const express = require('express');
const AdminController = require('../controllers/AdminController');
const verifyToken = require('../middlewares/auth');

const router = express.Router();


router.post('/login', (req, res) => AdminController.login(req, res));


router.get('/', verifyToken, (req, res) => AdminController.getAdmins(req, res));
router.post('/', verifyToken, (req, res) => AdminController.createAdmin(req, res));
router.get('/:id', verifyToken, (req, res) => AdminController.getAdmin(req, res));
router.put('/:id', verifyToken, (req, res) => AdminController.updateAdmin(req, res));
router.delete('/:id', verifyToken, (req, res) => AdminController.deleteAdmin(req, res));

module.exports = router;
