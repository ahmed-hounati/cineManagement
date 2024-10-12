const express = require('express');
const filmController = require('../controllers/FilmController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', verifyToken, (req, res) => filmController.getFilms(req, res));
router.get('/:id', verifyToken, (req, res) => filmController.getFilm(req, res));
router.post('/create', verifyToken, checkRole('admin'), upload, (req, res) => filmController.create(req, res));
router.put('/update/:id', verifyToken, checkRole('admin'), (req, res) => filmController.updateFilm(req, res));
router.delete('/delete/:id', verifyToken, checkRole('admin'), (req, res) => filmController.deleteFilm(req, res));
router.post('/rate/:id', verifyToken, filmController.rateFilm);
router.post('/addFav/:id', verifyToken, filmController.addFav);
router.post('/removeFav/:id', verifyToken, filmController.removeFav);
router.get('/average-rating/:id', verifyToken, filmController.getAverageRating);

module.exports = router;
