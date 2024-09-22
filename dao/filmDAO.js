const Film = require('../models/FilmModel');

class FilmDAO {
    async findAll() {
        try {
            return await Film.find();
        } catch (error) {
            throw new Error('Error fetching Films');
        }
    }

    async findById(id) {
        try {
            return await Film.findById(id);
        } catch (error) {
            throw new Error('Error finding Film');
        }
    }


    async create(FilmData) {
        try {
            const newFilm = new Film(FilmData);
            return await newFilm.save();
        } catch (error) {
            throw new Error('Error creating Film');
        }
    }

    async updateById(id, updateData) {
        try {
            return await Film.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating Film');
        }
    }

    async deleteById(id) {
        try {
            return await Film.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting Film');
        }
    }
}

module.exports = new FilmDAO();