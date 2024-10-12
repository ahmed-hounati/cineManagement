const filmDAO = require('../dao/filmDAO');
const FilmDAO = require('../dao/filmDAO');
const userDAO = require('../dao/userDAO');
const jwt = require('jsonwebtoken');



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
        try {
            if (!req.files || !req.files.poster || !req.files.video) {
                return res.status(400).json({ message: "image or video files are required" });
            }
            const savedFilm = await FilmDAO.create(req.body, {
                poster: req.files.poster[0],
                video: req.files.video[0]
            });
            res.status(200).json({
                message: "movie created successfully", film: savedFilm
            });
        } catch (err) {
            res.status(500).send({ message: err.message || "an error while adding a film" });
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


    async rateFilm(req, res) {
        const { id } = req.params;
        const { rating } = req.body;
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

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        try {
            const film = await filmDAO.findById(id);
            if (!film) {
                return res.status(404).json({ message: 'Film not found' });
            }

            const existingRating = film.ratings.find(r => r.user.toString() === userId.toString());

            if (existingRating) {
                existingRating.rating = rating;
            } else {
                film.ratings.push({ user: userId, rating });
            }
            await film.save();

            return res.status(200).json({ message: 'Rating submitted successfully', film });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    };


    async getAverageRating(req, res) {
        const { id } = req.params;

        try {
            const film = await filmDAO.findById(id);
            if (!film) {
                return res.status(404).json({ message: 'Film not found' });
            }

            // Calculate the average rating
            const totalRatings = film.ratings.length;
            const ratingSum = film.ratings.reduce((acc, curr) => acc + curr.rating, 0);
            const averageRating = totalRatings ? (ratingSum / totalRatings).toFixed(1) : 0;

            return res.status(200).json({ averageRating, totalRatings });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    };


    async addFav(req, res) {
        const { id } = req.params;
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        try {
            // Decode the token to get the user information
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const user = await userDAO.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const film = await filmDAO.findById(id);
            if (!film) {
                return res.status(400).json({ message: 'Film not found' });
            }

            // Check if the film is already in the user's favorites
            const existingFilm = user.favorites.find(fav => fav.toString() === id.toString());

            if (existingFilm) {
                return res.status(400).json({ message: 'Film already in favorites' });
            }
            user.favorites.push(id);
            await user.save();

            return res.status(200).json({ message: 'Film added to favorites' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }

    async removeFav(req, res) {
        const { id } = req.params;
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        try {
            // Decode the token to get the user information
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Find the user by ID
            const user = await userDAO.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const film = await filmDAO.findById(id);
            if (!film) {
                return res.status(400).json({ message: 'Film not found' });
            }

            const filmIndex = user.favorites.findIndex(fav => fav.toString() === id.toString());
            if (filmIndex === -1) {
                return res.status(400).json({ message: 'Film not found in favorites' });
            }

            user.favorites.splice(filmIndex, 1);
            await user.save();

            return res.status(200).json({ message: 'Film removed from favorites' });

        } catch (error) {
            console.error('Error removing from favorites:', error);
            return res.status(500).json({ message: 'Server error', error });
        }
    }


}

module.exports = new FilmController();
