const express = require('express');
const CommentController = require('../controllers/CommentController');
const verifyToken = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const router = express.Router();

router.get('/:filmId', verifyToken, (req, res) => CommentController.getFilmComments(req, res));
router.post('/create', verifyToken, (req, res) => CommentController.create(req, res));
router.put('/update/:id', verifyToken, (req, res) => CommentController.updateComment(req, res));
router.delete('/delete/:id', verifyToken, (req, res) => CommentController.deleteComment(req, res));


module.exports = router;
