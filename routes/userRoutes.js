const express = require('express');
const UserController = require('../controllers/UserController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

const router = express.Router();


router.post('/auth/login', (req, res) => UserController.login(req, res));
router.post('/auth/register', (req, res) => UserController.register(req, res));
router.post('/auth/forget', (req, res) => UserController.forget(req, res));
router.post('/auth/reset-password/:token', (req, res) => UserController.resetPassword(req, res));
router.get('/users/me', verifyToken, (req, res) => UserController.me(req, res));
router.put('/user/update', verifyToken, (req, res) => UserController.updateUser(req, res));


router.get('/users', verifyToken, checkRole('admin'), (req, res) => UserController.getUsers(req, res));
router.post('/admin', verifyToken, checkRole("admin"), (req, res) => UserController.createAdmin(req, res));
router.get('/user/:id', verifyToken, (req, res) => UserController.getUser(req, res));

router.delete('/user/:id', verifyToken, checkRole('admin'), (req, res) => UserController.deleteUser(req, res));
router.post('/auth/logout', verifyToken, (req, res) => UserController.logout(req, res));

module.exports = router;
