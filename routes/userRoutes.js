const express = require('express');
const UserController = require('../controllers/UserController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

const router = express.Router();


router.post('/login', (req, res) => UserController.login(req, res));
router.post('/register', (req, res) => UserController.register(req, res));


router.get('/users', verifyToken, checkRole('admin'), (req, res) => UserController.getUsers(req, res));
router.post('/admin', verifyToken, checkRole("admin"), (req, res) => UserController.createAdmin(req, res));
router.get('/user/:id', verifyToken, (req, res) => UserController.getUser(req, res));
router.put('/user/:id', verifyToken, checkRole('admin'), (req, res) => UserController.updateUser(req, res));
router.delete('/user/:id', verifyToken, checkRole('admin'), (req, res) => UserController.deleteUser(req, res));

module.exports = router;
