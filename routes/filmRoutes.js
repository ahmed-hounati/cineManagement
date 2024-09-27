const express = require('express');
const filmController = require('../controllers/FilmController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const upload = require('../middlewares/multer');  // Import the multer configuration

const router = express.Router();

router.get('/', verifyToken, (req, res) => filmController.getFilms(req, res));
router.get('/:id', verifyToken, (req, res) => filmController.getFilm(req, res));
router.post('/create', verifyToken, checkRole('admin'), upload.single('image'), (req, res) => filmController.create(req, res));
router.put('/update/:id', verifyToken, checkRole('admin'), (req, res) => filmController.updateFilm(req, res));
router.delete('/delete/:id', verifyToken, checkRole('admin'), (req, res) => filmController.deleteFilm(req, res));

module.exports = router;
