const CommentDAO = require('../dao/commentDAO');
const filmDAO = require('../dao/filmDAO');
const jwt = require('jsonwebtoken');
const userDAO = require('../dao/userDAO');



class CommentController {
    // Get all Comments
    async getFilmComments(req, res) {
        const { filmId } = req.params;
        try {
            const film = await filmDAO.findById(filmId);
            if (!film) {
                res.status(400).json("no film found");
            }
            const Comments = await CommentDAO.findAllForFilm(filmId);
            res.status(200).json(Comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    // Create a new Comment
    async create(req, res) {
        const { text, filmId } = req.body;
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token not provided' });
            }

            // Decode the token to get the user information
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const user = await userDAO.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const film = await filmDAO.findById(filmId);
            if (!film) {
                return res.status(404).json({ message: 'film not found' });
            }
            const newComment = await CommentDAO.create({ text, user: userId, film: filmId });
            res.status(201).json(newComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a Comment
    async updateComment(req, res) {
        const { id } = req.params;
        const { text } = req.body;
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token not provided' });
            }

            // Decode the token to get the user information
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const user = await userDAO.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const updatedComment = await CommentDAO.updateById(id, { text, user: userId });
            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.status(200).json(updatedComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a Comment
    async deleteComment(req, res) {
        const { id } = req.params;
        try {
            const deletedComment = await CommentDAO.deleteById(id);
            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}

module.exports = new CommentController();
