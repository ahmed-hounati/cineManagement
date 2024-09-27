const FilmDAO = require('../dao/filmDAO');
const FilmModel = require('../models/FilmModel');



class FilmController {
    // Get all Films
    async getFilms(req, res) {
        try {
            const Films = await FilmDAO.findAll();
            res.status(200).json(Films);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get an Film by ID
    async getFilm(req, res) {
        const { id } = req.params;
        try {
            const Film = await FilmDAO.findById(id);
            if (!Film) {
                return res.status(404).json({ message: 'Film not found' });
            }
            res.status(200).json(Film);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new Film
    async create(req, res) {
        const { status, duration, description, name } = req.body;

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        try {
            const imagePath = req.file.path;

            const newFilm = await FilmModel.create({
                status,
                duration,
                description,
                name,
                image: {
                    data: imagePath,
                    contentType: req.file.mimetype
                }
            });

            res.status(201).json(newFilm);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


    // Update a Film
    async updateFilm(req, res) {
        const { id } = req.params;
        const { status, duration, description, name } = req.body;
        try {
            const updatedFilm = await FilmDAO.updateById(id, { status, duration, description, name });
            if (!updatedFilm) {
                return res.status(404).json({ message: 'Film not found' });
            }
            res.status(200).json(updatedFilm);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a Film
    async deleteFilm(req, res) {
        const { id } = req.params;
        try {
            const deletedFilm = await FilmDAO.deleteById(id);
            if (!deletedFilm) {
                return res.status(404).json({ message: 'Film not found' });
            }
            res.status(200).json({ message: 'Film deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}

module.exports = new FilmController();
