const Comment = require('../models/CommentModel');

class CommentDAO {
    async findAllForFilm(filmId) {
        try {
            return await Comment.find({ film: filmId });
        } catch (error) {
            throw new Error('Error fetching Comments');
        }
    }


    async create(CommentData) {
        try {
            const newComment = new Comment(CommentData);
            return await newComment.save();
        } catch (error) {
            throw new Error('Error creating Comment');
        }
    }

    async updateById(id, updateData) {
        try {
            return await Comment.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating Comment');
        }
    }

    async deleteById(id) {
        try {
            return await Comment.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting Comment');
        }
    }
}

module.exports = new CommentDAO();